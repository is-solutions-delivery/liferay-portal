/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const buttonElement = document.querySelector('.sticky-container-24 button');
const storefrontHeader = document.querySelector('.sticky-container-24');
let headerInitialOffset = null;
let isSmall = false;

function updateSticky() {
	if (headerInitialOffset === null) {
		headerInitialOffset = storefrontHeader.offsetTop;
	}

	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const triggerPoint = headerInitialOffset - 20;

	const shouldBeSmall = isSmall
		? scrollTop > triggerPoint - 36
		: scrollTop > triggerPoint + 36;

	if (shouldBeSmall !== isSmall) {
		isSmall = shouldBeSmall;
		storefrontHeader.classList.toggle('small-header', isSmall);

		if (buttonElement) {
			buttonElement.classList.toggle('btn-sm', isSmall);
		}
	}
}

let ticking = false;
window.addEventListener(
	'scroll',
	() => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				updateSticky();
				ticking = false;
			});
			ticking = true;
		}
	},
	{passive: true}
);

updateSticky();
