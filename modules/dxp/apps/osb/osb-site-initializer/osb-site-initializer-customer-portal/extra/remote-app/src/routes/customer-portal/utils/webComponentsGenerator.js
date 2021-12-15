export function webComponentsGenerator(slaCurrentVersionAndProducts) {
	const [slaCurrent, dxpVersion, ...products] = slaCurrentVersionAndProducts;
	const webComponentsArray = [];

	if (
		products.includes('DXP Cloud') ||
		products.includes('Portal') ||
		products.includes('Commerce') ||
		(!products.includes('Partnership') &&
			slaCurrent !== 'Limited Subscription')
	) {
		webComponentsArray.push('WEB-CONTENT-ACTION-01');
	}

	if (
		!products.includes('Partnership') &&
		slaCurrent !== 'Limited Subscription'
	) {
		webComponentsArray.push('WEB-CONTENT-ACTION-02');
	}

	if (!products.includes('DXP') || !products.includes('DXP Cloud')) {
		webComponentsArray.push('WEB-CONTENT-ACTION-03');
	}

	if (dxpVersion) {
		webComponentsArray.push(dxpVersionWebComponent(dxpVersion));
	}

	if (!products.includes('Analytics Cloud')) {
		webComponentsArray.push('WEB-CONTENT-ACTION-09');
	}

	return webComponentsArray;
}

const dxpVersionWebComponent = (dxpVersion) => {
	if (dxpVersion === '7.0') {
		return 'WEB-CONTENT-ACTION-04';
	}
	if (dxpVersion === '7.1') {
		return 'WEB-CONTENT-ACTION-05';
	}
	if (dxpVersion === '7.2') {
		return 'WEB-CONTENT-ACTION-06';
	}
	if (dxpVersion === '7.3') {
		return 'WEB-CONTENT-ACTION-07';
	}
	if (dxpVersion === '7.4') {
		return 'WEB-CONTENT-ACTION-08';
	}
};
