var applicationInfo = webApiClient.applicationDeploy("my content", "test");
applicationInfo = webApiClient.applicationGetStatus(info.id);

while (applicationInfo.status != 'OK') {
	applicationInfo = webApiClient.applicationGetStatus(info.id);
}
