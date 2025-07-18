/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const getElementByClass = (className) =>
	document.querySelector(`.${className}`);

const domElements = {
	containerHubCard: getElementByClass('container-enablement-hub-card'),
	cardLink: getElementByClass('sales-enablement-hub-card-link'),
	card: getElementByClass('sales-page-card'),
	cardDescription: getElementByClass('sales-page-card-description'),
	cardGoToText: getElementByClass('sales-page-card-go-to-text'),
	cardTitle: getElementByClass('sales-page-card-title'),
};

const fetchUserAccounts = async () => {
	const response = await Liferay.Util.fetch(
		`/o/headless-admin-user/v1.0/user-accounts/${Liferay.ThemeDisplay.getUserId()}`
	);
	return response.json();
};

const updateCardUI = (isTrainer) => {
	const {
		card,
		cardDescription,
		cardGoToText,
		cardLink,
		cardTitle
	} = domElements;

	card.classList.toggle('sales-enablement-hub-card-icon', isTrainer);
	card.classList.toggle('sales-resources-card-icon', !isTrainer);

	if (isTrainer) {
		cardTitle.textContent = 'Enablement Hub';
		cardDescription.textContent =
			'Access exclusive assets, tools, and materials designed to help our partners and staff succeed in their roles, from sales to certified training.';
		cardGoToText.textContent = 'Go to the Enablement Hub';
		cardLink.href = '/web/sales-enablement/home';
	} else {
		cardTitle.textContent = 'Sales Resources';
		cardDescription.textContent =
			'Find the latest presentation decks, battle cards, reports, and other essential resources to effectively position and sell Liferay solutions.';
		cardGoToText.textContent = 'Go to the Sales Enablement Hub';
		cardLink.href = '/web/sales-enablement/sales-resources';
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	const user = await fetchUserAccounts();

	const userExternalReferenceCode = user.roleBriefs.map((userRole) => userRole.externalReferenceCode);
	const userGroupNames = user.userGroupBriefs.map((userGroup) => userGroup.name);
	
	const isEmployeeOrPartner = (userGroupNames) =>
	userGroupNames.includes('Employees') || userGroupNames.includes('Partners');

	if (isEmployeeOrPartner(userGroupNames)) {
		domElements.containerHubCard.classList.remove('hide');

		updateCardUI(userExternalReferenceCode.includes('TRAINERS-LOUNGE-CONTENT-ADMIN') ||
		userExternalReferenceCode.includes('TRAINERS-LOUNGE-USER'));
	}
});
