/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const getElement = (className) => document.querySelector(`.${className}`);

const elements = {
	containerEnablementHubCard: getElement('container-enablement-hub-card'),
	salesEnablementHubCard: getElement('sales-enablement-hub-card'),
	salesEnablementHubCardLink: getElement('sales-enablement-hub-card-link'),
	salesPageCard: getElement('sales-page-card'),
	salesPageCardDescription: getElement('sales-page-card-description'),
	salesPageCardGoToText: getElement('sales-page-card-go-to-text'),
	salesPageCardTitle: getElement('sales-page-card-title'),
};

const extractNames = (items = []) => items.map((item) => item.name);

const fetchUserAccountsInfo = async () => {
	const response = await Liferay.Util.fetch(
		`/o/headless-admin-user/v1.0/user-accounts/${Liferay.ThemeDisplay.getUserId()}`
	);

	return await response.json();
};

const setupCardForRole = (isTrainer) => {
	const {
		salesEnablementHubCardLink,
		salesPageCard,
		salesPageCardDescription,
		salesPageCardGoToText,
		salesPageCardTitle,
	} = elements;

	if (isTrainer) {
		salesPageCard.classList.add('sales-enablement-hub-card-icon');
		salesPageCard.classList.remove('sales-resources-card-icon');

		salesPageCardTitle.innerText = 'Enablement Hub';
		salesPageCardDescription.innerText =
			'Access exclusive assets, tools, and materials designed to help our partners and staff succeed in their roles, from sales to certified training.';
		salesPageCardGoToText.innerText = 'Go to the Enablement Hub';
		salesEnablementHubCardLink.href = '/web/sales-enablement/home';
	}
	else {
		salesPageCard.classList.add('sales-resources-card-icon');
		salesPageCard.classList.remove('sales-enablement-hub-card-icon');

		salesPageCardTitle.innerText = 'Sales Resources';
		salesPageCardDescription.innerText =
			'Find the latest presentation decks, battle cards, reports, and other essential resources to effectively position and sell Liferay solutions.';
		salesPageCardGoToText.innerText = 'Go to the Sales Enablement Hub';
		salesEnablementHubCardLink.href =
			'/web/sales-enablement/sales-resources';
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	const userInfo = await fetchUserAccountsInfo();

	const roleNames = extractNames(userInfo.roleBriefs);
	const userGroupNames = extractNames(userInfo.userGroupBriefs);

	const isEmployeeOrPartner =
		userGroupNames.includes('Employees') ||
		userGroupNames.includes('Partners');

	if (isEmployeeOrPartner) {
		elements.containerEnablementHubCard.classList.remove('hide');

		const isTrainer =
			roleNames.includes('Trainer’s Lounge Content Admin') ||
			roleNames.includes('Trainer’s Lounge User');

		setupCardForRole(isTrainer);
	}
});
