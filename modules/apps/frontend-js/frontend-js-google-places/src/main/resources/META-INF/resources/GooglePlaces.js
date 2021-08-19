/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

export const loadScript = (googlePlacesAPIKey) => {
	if (!googlePlacesAPIKey) {
		return console.warn('Google Places API Key is missing');
	}

	const SCRIPT_TAG_KEY = 'googleMapsScript';

	let script = document.getElementById(SCRIPT_TAG_KEY);

	if (!script) {
		script = document.createElement('script');

		script.addEventListener('load', () => {
			script.setAttribute('data-loaded', 'true');
		});

		script.setAttribute('id', SCRIPT_TAG_KEY);
		script.setAttribute('type', 'text/javascript');

		script.setAttribute(
			'src',
			`https://maps.googleapis.com/maps/api/js?libraries=places&key=${googlePlacesAPIKey}`
		);

		document.head.appendChild(script);
	}
};

export default loadScript;
