const fetchLicense = async (
	accountKey,
	dateEnd,
	dateState,
	licenseKeyDownloadURL,
	productName,
	sessionId
) => {
	// eslint-disable-next-line @liferay/portal/no-global-fetch
	const response = await fetch(
		`${licenseKeyDownloadURL}/${accountKey}/product-groups/${productName}/product-environment/production/common-license-key?dateEnd=${dateEnd}&dateStart=${dateState}`,
		{
			headers: {
				'Okta-Session-ID': sessionId,
			},
		}
	);

	return response;
};

export {fetchLicense};
