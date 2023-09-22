/* eslint-disable no-undef */
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const accountMenuBtn = fragmentElement.querySelector('.account-info');
const accountMenuBtnIcons = accountMenuBtn.querySelectorAll(
	'.account-dropdown-icon'
);

accountMenuBtn.addEventListener('click', () => {
	accountMenuBtnIcons.forEach((cur_accountMenuBtnIcon) => {
		cur_accountMenuBtnIcon.classList.toggle('d-none');
	});
});
