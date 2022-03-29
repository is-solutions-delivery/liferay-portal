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

/* eslint-disable no-undef */
const btnDashboard = fragmentElement.querySelector('.dashboard-menu');
const btnApplications = fragmentElement.querySelector('.applications-menu');
const btnPolicies = fragmentElement.querySelector('.policies-menu');
const btnClaims = fragmentElement.querySelector('.claims-menu');
const btnReports = fragmentElement.querySelector('.reports-menu');
const btnLogo = fragmentElement.querySelector('.top-bar');

const redirectUrl = (routeName) => {
	const {pathname} = new URL(Liferay.ThemeDisplay.getCanonicalURL());
	const urlPaths = pathname.split('/').filter(Boolean);
	const siteName = `/${urlPaths
		.slice(0, urlPaths.length > 2 ? urlPaths.length - 1 : urlPaths.length)
		.join('/')}`;

	window.location.href = `${origin}${siteName}/${routeName}`;
};

btnDashboard.onclick = () => redirectUrl('dashboard');
btnApplications.onclick = () => redirectUrl('applications');
btnPolicies.onclick = () => redirectUrl('policies');
btnClaims.onclick = () => redirectUrl('claims');
btnReports.onclick = () => redirectUrl('reports');
btnLogo.onclick = () => redirectUrl('dashboard');

const layoutName = configuration.layoutName;
const headerTitleElement = fragmentElement.querySelector(
	'.page-header-container p'
);
const dashBoardTitle = `<span class="font-weight-bolder h3">Hi, Hugo.</span> You're	on track this month!`;

headerTitleElement.innerHTML =
	layoutName === 'Dashboard'
		? dashBoardTitle
		: `<span class="font-weight-bolder h3">${layoutName}</span>`;

if (layoutName === 'Applications') {
	document.querySelector(
		'.component-tabs .navbar.navbar-collapse-absolute.navbar-expand-md.navbar-underline.navigation-bar.navigation-bar-light'
	).style = 'border-color: #fff !important;';
}

if (layoutName !== 'Applications' && layoutName !== 'Claims') {
	fragmentElement
		.querySelector('.header-content .new-button')
		.classList.add('d-none');
}

if (layoutName === 'Applications' || layoutName === 'Claims') {
	const buttonValue =
		layoutName === 'Claims' ? 'New Claim' : 'New Application';
	fragmentElement.querySelector(
		'.header-content .new-button'
	).innerHTML = `<span class='mr-2 plus-icon'>+</span>${buttonValue}`;
	fragmentElement.querySelector('.page-header-container').style =
		'border-bottom: 1px solid #D3D3D4; box-shadow: none;';
}
