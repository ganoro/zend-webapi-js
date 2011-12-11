var webApiClient = { // keyName : 'ZendCloudManager',
	// secretKey :
	// '7d4ad0af82f080c39e981335aa164b5f05bbe82c1afa8b26e6038b9bb04d81e8',
	// host : 'royganor.my.phpcloud.com',
	host : 'localhost',
	keyName : 'sdk.roy',
	secretKey : '1ec9a51da63d5c64856768924361b5128a5c7823b73d9f5ca69ea11c360a18eb',
	requestUri : '',
	date : '',

	applicationDeploy : function(packageContent, baseUrl) {
		this.requestUri = '/ZendServerManager/Api/applicationDeploy';
		return false;
	},

	getSystemInfo : function(_success, _error) {
		this.requestUri = '/ZendServerManager/Api/getSystemInfo';
		var params = {};
		this.getRequest(params, _success, _error);

	},
	applicationGetStatus : function(id, _success, _error) {
		this.requestUri = '/ZendServerManager/Api/applicationGetStatus';
		var params = {
			'applications[0]' : id
		};
		this.getRequest(params, _success, _error);
	},

	postRequest : function(params, _success, _error) {
		var url = this.getApiUrl() + this.requestUri;
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
				_error(jqxhr.response);
			}
		});
	},

	postMultiRequest : function(params, _success, _error) {
		var url = this.getApiUrl() + this.requestUri;
		var paramsString = this.encodeParams(params);
		var requestHeaders = this.getHeaders();
		
		$.ajax({
			type : "POST",
			url : url,
			headers : requestHeaders,
			contentType: 'multipart/form-data, boundary=--bla-bla-bla--',
			data : paramsString,
			success : function(data, textStatus) {
				if (data.getElementsByTagName('responseData').length == 1) {
					_success(data);
				} else {
					_error(data);
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(jqxhr.response);
			}
		});
	},
	
	getRequest : function(params, _success, _error) {
		var url = this.getApiUrl() + this.requestUri;
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
		var requestUri = this.requestUri;
		var userAgent = this.getUserAgent();
		var date = this.getDate();
		var str = host['Z-Host'] + ':' + requestUri + ':'
				+ userAgent['Z-User-agent'] + ':' + date['Z-Date'];
		return new jsSHA(str, 'ASCII').getHMAC(this.secretKey, 'ASCII',
				"SHA-256", "HEX");
	}

};
