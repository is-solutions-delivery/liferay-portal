/* eslint-disable no-undef */
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const liferaySitesBtn = fragmentElement.querySelector('.sites-container');
const liferaySitesBtnIcons = liferaySitesBtn.querySelectorAll(
	'.liferay-sites .account-dropdown-icon'
);

liferaySitesBtn.addEventListener('click', () => {
	liferaySitesBtnIcons.forEach((cur_liferaySitesBtnIcon) => {
		cur_liferaySitesBtnIcon.classList.toggle('d-none');
	});
});
