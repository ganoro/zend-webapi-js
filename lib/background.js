chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "signout") { // request to signout
		delete localStorage["username"];
		delete localStorage['phpcloudsess'];
		delete localStorage['containers_length'];
		setSessionId(null);
	} else {
		sendResponse({});
	}
});
