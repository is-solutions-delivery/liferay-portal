/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const getElementByClass = (className) =>
	document.querySelector(`.${className}`);

const domElements = {
	containerEnablementHubCard: getElementByClass(
		'container-enablement-hub-card'
	),
	salesEnablementHubCardLink: getElementByClass(
		'sales-enablement-hub-card-link'
	),
	salesPageCard: getElementByClass('sales-page-card'),
	salesPageCardDescription: getElementByClass('sales-page-card-description'),
	salesPageCardGoToText: getElementByClass('sales-page-card-go-to-text'),
	salesPageCardTitle: getElementByClass('sales-page-card-title'),
};

const fetchUserAccounts = async () => {
	const response = await Liferay.Util.fetch(
		`/o/headless-admin-user/v1.0/user-accounts/${Liferay.ThemeDisplay.getUserId()}`
	);

	return response.json();
};

const renderCardByRole = (isTrainerLoungeUserAccountRole) => {
	const {
		salesEnablementHubCardLink,
		salesPageCard,
		salesPageCardDescription,
		salesPageCardGoToText,
		salesPageCardTitle,
	} = domElements;

	salesPageCard.classList.toggle(
		'sales-enablement-hub-card-icon',
		isTrainerLoungeUserAccountRole
	);
	salesPageCard.classList.toggle(
		'sales-resources-card-icon',
		!isTrainerLoungeUserAccountRole
	);

	if (isTrainerLoungeUserAccountRole) {
		salesEnablementHubCardLink.href = '/web/sales-enablement/home';
		salesPageCardDescription.textContent =
			'Access exclusive assets, tools, and materials designed to help our partners and staff succeed in their roles, from sales to certified training.';
		salesPageCardGoToText.textContent = 'Go to the Enablement Hub';
		salesPageCardTitle.textContent = 'Enablement Hub';
	}
	else {
		salesEnablementHubCardLink.href = '/web/sales-enablement/sales-resources';
		salesPageCardDescription.textContent =
			'Find the latest presentation decks, battle cards, reports, and other essential resources to effectively position and sell Liferay solutions.';
		salesPageCardGoToText.textContent = 'Go to the Sales Enablement Hub';
		salesPageCardTitle.textContent = 'Sales Resources';
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	const userAccount = await fetchUserAccounts();

	const userExternalReferenceCode = userAccount.roleBriefs.map(
		(userRole) => userRole.externalReferenceCode
	);
	const userGroupNames = userAccount.userGroupBriefs.map(
		(userGroup) => userGroup.name
	);

	const isEmployeeOrPartner = (userGroupNames) =>
		userGroupNames.includes('Employees') ||
		userGroupNames.includes('Partners');

	if (isEmployeeOrPartner(userGroupNames)) {
		domElements.containerEnablementHubCard.classList.remove('hide');

		renderCardByRole(
			userExternalReferenceCode.includes(
				'TRAINERS-LOUNGE-CONTENT-ADMIN'
			) || userExternalReferenceCode.includes('TRAINERS-LOUNGE-USER')
		);
	}
});
