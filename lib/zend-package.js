/**
 * 
 * @param appName
 * @param code
 */
function packageSpup(appName, code) {
	zip = new JSZip();
	zip.add("deployment.xml", getDescriptor(appName));
	zip.folder("data").add("index.php", code);
	return zip.generate(true);
}

/**
 * @param appName
 * @returns {String}
 */
function getDescriptor(appName) {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>" +
           "<package xmlns=\"http://www.zend.com/server/deployment-descriptor/1.0\" version=\"1.0\">" +
           "<name>" + appName + "</name>" +
           "<version>" + 
           "<release>1.0.0</release>" + 
           "</version>" +
           "<appdir>data</appdir>" + 
           "</package>";
}