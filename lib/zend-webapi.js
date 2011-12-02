var webApiClient = {
	keyName : 'ZendCloudManager',
	secretKey : '7d4ad0af82f080c39e981335aa164b5f05bbe82c1afa8b26e6038b9bb04d81e8',
	host : 'royganor.my.phpcloud.com',
	requestUri : '',
	date : '',

	applicationDeploy : function(packageContent, baseUrl) {
		this.requestUri = '/ZendServerManager/Api/applicationDeploy';
		return false;
	},

	applicationGetStatus : function(id) {
		this.requestUri = '/ZendServerManager/Api/applicationGetStatus';
		var params = {'applications[0]' : id};
		_success = function() {
			alert('in success');
		};
		_error = function(msg) {
			alert('in error');
		};
		this.getRequest(this.getApiUrl() + this.requestUri, params, _success, _error);
	},

	getHeaders : function() {
		return $.extend({}, this.getDate(), this.getHost(),
				this.getUserAgent(), this.getZendSignature());
	},

	postRequest : function(url, params, _success, _error) {
		var paramsString = this.encodeParams(params);
		var headers = this.getHeaders();

		$.ajax({
			type : "POST",
			url : url,
			headers : headers,
			data : paramsString,
			contentType : "application/x-www-form-urlencoded",
			beforeSend: function(jqXHR, settings) {
				return true;
			},
			success : function(data, textStatus) {
				try {
					var xmlDoc = $.parseXML(data);
					var xml = $(xmlDoc);
					if (xml.find('errorData').text().length == 0) {
						_success(xml);
					} else {
						_error(xml.find('errorMessage').text());
					}
				} catch (ex) {
					_error('error parsing xml');
					return;
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(jqxhr.response);
			}
		});
	},

	getRequest : function(url, params, _success, _error) {
		var paramsString = this.encodeParams(params);
		var headers = this.getHeaders();

		$.ajax({
			type : "GET",
			headers : headers,
			url : url + "?" + paramsString,
			beforeSend: function(jqXHR, settings) {
				return true;
			},
			success : function(data, textStatus) {
				try {
					var xmlDoc = $.parseXML(data);
					var xml = $(xmlDoc);
					if (xml.find('errorData').text().length == 0) {
						_success(xml);
					} else {
						_error(xml.find('errorMessage').text());
					}
				} catch (ex) {
					_error('error parsing xml');
					return;
				}
			},
			error : function(jqxhr, textStatus, errorThrown) {
				_error(textStatus);
			}
		});
	},

	encodeParams : function(params) {
		queryString = "";
		if (this.isEmpty(params)) {
			return queryString;
		}
		$.each(params, function(key, value) {
			queryString = queryString + '&' + escape(key) + "=" + escape(value);
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
			Date : this.date
		};
	},

	getUserAgent : function() {
		return {
			'User-agent' : 'spup'
		};
	},

	getHost : function() {
		return {
			Host : this.host
		};
	},

	getApiUrl : function() {
		return 'https://' + this.host + ':10082';
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
		var str = host + ':' + requestUri + ':' + userAgent + ':' + date;
		return new jsSHA(str, 'ASCII').getHMAC(this.secretKey, 'ASCII',
				"SHA-256", "HEX");
	}

};
