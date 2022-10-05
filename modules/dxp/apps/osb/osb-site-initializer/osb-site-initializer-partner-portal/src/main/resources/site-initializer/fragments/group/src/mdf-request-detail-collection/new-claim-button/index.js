/* eslint-disable no-undef */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

const currentPath = Liferay.currentURL.split('/');
const mdfRequestedId = +currentPath[currentPath.length - 1];
const SITE_URL = Liferay.ThemeDisplay.getLayoutRelativeURL()
	.split('/')
	.slice(0, 3)
	.join('/');

const claimButton = fragmentElement.querySelector('.newClaim');

claimButton.onclick = () => {
	Liferay.Util.navigate(
		`${SITE_URL}/marketing/mdf-claim/new/#/mdfrequest/${mdfRequestedId}`
	);
};
