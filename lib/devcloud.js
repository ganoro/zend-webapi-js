/**
 * Authenticate to the Zend Developer Cloud service given the username and
 * password. Once authentication is validated, a session id is retrieved and
 * assigned as cookie
 * 
 * @param user
 * @param password
 * @param _success(cookie)
 * @param _error(message)
 */
function authenticate(user, password, _success, _error) {

	var params = 'username=' + encodeURIComponent(user) + '&password='
			+ encodeURIComponent(password);

	$.ajax({
		type : "POST",
		url : "https://my.phpcloud.com/user/login?format=json",
		data : params,
		contentType : "application/x-www-form-urlencoded",
		success : function(data, textStatus) {
			try {
				resp = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			setSessionId(resp.session.phpcloudsess);
			_success(resp.session.phpcloudsess);
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(jqxhr.response);
		}
	});
}

/**
 * Lists all containers for a given user TODO *all*
 * 
 * @param _success(containers)
 * @param _error(message)
 */
function list(_success, _error) {
	var params = '/container/list?format=json';

	$.ajax({
		type : "POST",
		url : "https://my.phpcloud.com/container/list?format=json",
		data : params,
		contentType : "application/x-www-form-urlencoded",
		success : function(data, textStatus) {
			try {
				resp = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			_success(resp.containers);
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(textStatus);
		}
	});
}

/**
 * Get overview for a given container
 * 
 * @param url overview url (given by the list() API)
 * @param _success(info)
 * @param _error(message)
 */
function overview(url, _success, _error) {
	
	$.ajax({
		type : "GET",
		url : "https://my.phpcloud.com" + url,
		success : function(data, textStatus) {
			try {
				resp = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			_success(resp);
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(textStatus);
		}
	});
}

/**
 * Retrieve information about a particular request's events and code tracing.
 * The requestUid identifier is provided in a cookie that is set in the response
 * to the particular request.
 * 
 * @param containerName
 * @param requestUid
 * @param _success(summary)
 * @param _error(message)
 */
function requestSummary(containerName, requestUid, _success, _error) {
	var params = 'containerName/' + containerName + '/requestUid/' + requestUid
			+ '?format=json';

	$.ajax({
		type : "GET",
		url : "https://my.phpcloud.com/monitor/get-request-summary/" + params,
		success : function(data, textStatus) {
			try {
				resp = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			if (resp.status == 'Success') {
				_success(resp.response);
			} else {
				_error(resp.response.message);
			}
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(textStatus);
		}
	});
}

/**
 * Download the amf file specified by codetracing identifier
 * 
 * @param containerName
 * @param amf
 * @param _success(amf)
 * @param _error(message)
 */
function downloadAmf(containerName, amf, _success, _error) {
	var params = 'containerName/' + containerName + '/amf/' + amf
			+ '?format=json';

	$.ajax({
		type : "GET",
		url : "https://my.phpcloud.com/monitor/download-amf/" + params,
		success : function(data, textStatus) {
			try {
				var response = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			if (response.status == 'Success') {
				_success(response.response);
			} else {
				_error(response.response.message);
			}
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(textStatus);
		}
	});
}

/**
 * Start a debug session for specific issue
 * 
 * @param containerName
 * @param amf
 * @param _success(status)
 * @param _error(message)
 */
function startDebug(containerName, issueId, eventGroupId, _success, _error) {
	var params = 'containerName/' + containerName + '/issueId/' + issueId
			+ '/eventGroupId/' + eventGroupId + '?format=json';

	$.ajax({
		type : "GET",
		url : "https://my.phpcloud.com/monitor/start-debug/" + params,
		success : function(data, textStatus) {
			try {
				resp = JSON.parse(data);
			} catch (ex) {
				_error('error parsing json');
				return;
			}
			if (resp.status == 'Success') {
				_success(resp.response);
			} else {
				_error(resp.response.message);
			}
		},
		error : function(jqxhr, textStatus, errorThrown) {
			_error(textStatus);
		}
	});
}

function setSessionId(sessionid) {
	var today = new Date();
	var expire = new Date();
	if (sessionid != null) {
		expire.setTime(today.getTime() + 3600000 * 24);
	}
	document.cookie = "phpcloudsess=" + escape(sessionid) + ";expires="
			+ expire.toGMTString();
}
