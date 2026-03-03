/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const productIcon = document.getElementById(
	`product-icon-${configuration.fragmentId}`
);
const productIconImg = document.querySelector(
	`.product-icon-img-${configuration.fragmentId}`
);

productIconImg.src = productIcon.textContent;
