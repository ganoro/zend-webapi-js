var webApiClient = { // keyName : 'ZendCloudManager',
	// secretKey :
	// '7d4ad0af82f080c39e981335aa164b5f05bbe82c1afa8b26e6038b9bb04d81e8',
	// host : 'royganor.my.phpcloud.com',
	host : 'localhost',
	keyName : 'roy',
	secretKey : '848dd80b6f8d99977e6343cede25a561da45fd00b62a375196ebb738b5492a53',
	requestRoute : '',
	date : '',

	applicationDeploy : function(packageContent, baseUrl, _success, _error) {
		this.setRequestRoute('/ZendServer/Api/applicationDeploy');
		var params = {
			'baseUrl' : baseUrl
		};
		var files = [ {
			'contentType' : 'application/vnd.zend.applicationpackage',
			'paramName' : 'appPackage',
			'content' : packageContent,
			'filename' : 'app-file.zpk'
		} ];
		this.postMultiRequest(params, files, _success, _error);
	},

	getSystemInfo : function(_success, _error) {
		this.setRequestRoute('/ZendServer/Api/getSystemInfo');
		this.getRequest({}, _success, _error);

	},
	applicationGetStatus : function(id, _success, _error) {
		this.setRequestRoute('/ZendServer/Api/applicationGetStatus');
		this.getRequest({
			'applications[0]' : id
		}, _success, _error);
	},

	postRequest : function(params, _success, _error) {
		var url = this.getApiUrl() + this.requestRoute;
		var paramsString = this.encodeParams(params);
		var requestHeaders = this.getHeaders();

		$.ajax({
			type : "POST",
			url : url,
			headers : requestHeaders,
			data : paramsString,
			success : function(data, textStatus) {
				if (data.getElementsByTagName('responseData').length == 1) {
					_success(data);
				} else {
					_error(data);
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(jqxhr.responseText);
			}
		});
	},

	postMultiRequest : function(params, files, _success, _error) {
		var url = this.getApiUrl() + this.requestRoute;
		var requestHeaders = this.getHeaders();
		var paramsAndFiles = this.encodeParamsAndFiles(params, files);

		$.ajax({
			type : "POST",
			contentType : 'multipart/form-data; boundary=split',
			url : url,
			headers : requestHeaders,
			data : paramsAndFiles,
			success : function(data, textStatus) {
				if (data.getElementsByTagName('responseData').length == 1) {
					_success(data);
				} else {
					_error(data);
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(jqxhr.responseText);
			}
		});
	},

	getRequest : function(params, _success, _error) {
		var url = this.getApiUrl() + this.requestRoute;
		var paramsString = this.encodeParams(params);
		if (paramsString != "") {
			url = url + "?" + paramsString;
		}
		var requestHeaders = this.getHeaders();

		$.ajax({
			type : "GET",
			url : url,
			headers : requestHeaders,
			success : function(data, textStatus) {
				if (data.getElementsByTagName('responseData').length == 1) {
					_success(data);
				} else {
					_error(data);
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(jqxhr.responseText);
			}
		});
	},

	setRequestRoute : function(route) {
		this.requestRoute = route;
	},

	getHeaders : function() {
		return $.extend({}, this.getDate(), this.getHost(),
				this.getUserAgent(), this.getZendSignature());
	},

	encodeParams : function(params) {
		queryString = "";
		if (this.isEmpty(params)) {
			return queryString;
		}
		$.each(params,
				function(key, value) {
					queryString = queryString + '&' + escape(key) + "="
							+ escape(value);
				});
		return queryString.slice(1);
	},

	encodeParamsAndFiles : function(params, files) {
		queryString = "";

		if (!this.isEmpty(params)) {
			$.each(params, function(key, value) {
				queryString = queryString
						+ "--split\nContent-Disposition: form-data, name=\""
						+ key + "\"\n" + value + "\n";
			});
		}

		if (!this.isEmpty(files)) {
			$
					.each(
							files,
							function(index, value) {
								var contentType = value.contentType;
								var paramName = value.paramName;
								var content = value.content;
								var filename = value.filename;

								queryString += "--split\nContent-Disposition: form-data, name=\""
										+ paramName
										+ "\";\n"
										+ "filename=\""
										+ filename + "\"\n";
								queryString += "Content-type: " + contentType
										+ "\n\n";
								queryString += content;
								queryString += "\n";
							});
		}

		return queryString;
	},

	isEmpty : function(ob) {
		for ( var i in ob) {
			return false;
		}
		return true;
	},

	getDate : function() {
		if (this.date.length == 0) {
			this.date = new Date().toGMTString();
		}
		return {
			'Z-Date' : this.date
		};
	},

	getUserAgent : function() {
		return {
			'Z-User-agent' : 'spup'
		};
	},

	getHost : function() {
		return {
			'Z-Host' : this.host
		};
	},

	getApiUrl : function() {
		return 'http://' + this.host + ':10081';
	},

	getZendSignature : function() {
		var hmac = this.calcHmac();
		return {
			'X-Zend-Signature' : this.keyName + ';' + hmac
		};
	},

	calcHmac : function() {
		var host = this.getHost();
		var requestRoute = this.requestRoute;
		var userAgent = this.getUserAgent();
		var date = this.getDate();
		var str = host['Z-Host'] + ':' + requestRoute + ':'
				+ userAgent['Z-User-agent'] + ':' + date['Z-Date'];
		return new jsSHA(str, 'ASCII').getHMAC(this.secretKey, 'ASCII',
				"SHA-256", "HEX");
	}

};
