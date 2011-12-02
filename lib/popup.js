function login(f) {
	// prepare args
	var u = f.username.value;
	var p = f.password.value;
	
	// authenticate phpcloud
	authenticate(u, p, authenticate_success, authenticate_error);
	
	return false;
}

function authenticate_success(sessionid) {
	localStorage['phpcloudsess'] = sessionid;

	var select = $('#login-form-message')[0];
	select.style.display = 'none';

	list(list_success, list_error);
}

function authenticate_error(status) {
	var select = $('#login-form-message')[0];
	select.style.display = 'inline';
	
	var select = $('#login-form-welcome-title')[0];
	select.style.display = 'none';
	signout();
}

function list_success(containers) {
	localStorage['containers_length'] = containers.length;
	for ( var i = 0; i < containers.length; i++) {
		localStorage['containers' + i] = containers[i].name;
		overview(containers[i].url, overview_success, overview_error);
	}
	refreshPopupContent();
}

function list_error(status) {
	authenticate_error();
}

function overview_success(data) {
	localStorage['containers_kName' + data.container.name] = data.container.sz_api_key_name;
	localStorage['containers_key' + data.container.name] = data.container.zs_api_key;
}

function overview_error(message) {
	authenticate_error(message);
}

function refreshPopupContent() {
	if (localStorage['containers_length'] == undefined) {
		if ($('#mini_bar_welcome').length > 0) {
			$('#mini_bar_welcome')[0].style.display = 'none';
		}
		if ($('#mini_bar_login').length > 0) {
			$('#mini_bar_login')[0].style.display = 'inline';
		}
		$('#settings-button').css('display', 'none'); 
		$('#logout-button').css('display', 'none');
		$('#mini_bar_header').width(350);
		document.body.style.width="360px";
	} else {
		codeMirror = CodeMirror.fromTextArea(document.getElementById("code"), {
		        lineNumbers: true,
		        matchBrackets: true,
		        mode: "application/x-httpd-php",
		        indentUnit: 4,
		        indentWithTabs: true,
		        enterMode: "keep",
		        tabMode: "shift"
		});
		
		if ($('#mini_bar_welcome').length > 0) {
			$('#mini_bar_welcome')[0].style.display = 'inline';
		}
		if ($('#mini_bar_login').length > 0) {
			$('#mini_bar_login')[0].style.display = 'none';
		}
		$('#settings-button').css('display', 'block'); 
		$('#logout-button').css('display', 'block');
		$('#mini_bar_header').width(490);
		codeMirror.focus();
		codeMirror.setCursor(5);
		document.body.style.width="500px";
	}
}

function runSpup() {
	webApiClient.applicationGetStatus(2);
	return false;
}

function signout() {
	chrome.extension.sendRequest({
		method : "signout"
	}, function(response) {

	});
	return false;
}

