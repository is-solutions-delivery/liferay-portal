/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const todayDate = new Date();
const currentYear = todayDate.getFullYear();

const currenFiscalYearStart = `${currentYear}-01-01`;
const currenFiscalYearEnd = `${currentYear}-12-31`;

const fiscalYearFilterCloseDate = `closeDate ge ${currenFiscalYearStart} and closeDate le ${currenFiscalYearEnd}`;
const fiscalYearFilterSubmitDate = `submitDate ge ${currenFiscalYearStart}T00:00:00Z and submitDate le ${currenFiscalYearEnd}T23:59:59Z`;

const todayDateISO = todayDate.toISOString().split('T')[0];
todayDate.setDate(todayDate.getDate() + 30);
const todayDate30Days = todayDate.toISOString().split('T')[0];

export const Filters = {
	DEAL_DASHBOARD: {
		approvedLeads: `leadType eq 'Partner Qualified Lead (PQL)'`,
		rejectedLeads: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'CAM rejected'`,
		submittedLeads: `leadType eq 'Partner Qualified Lead (PQL)'`,
	},
	LEVEL_DASHBOARD: {
		closedWon: `${fiscalYearFilterCloseDate} and stage eq 'Closed Won'`,
		newBusiness: `${fiscalYearFilterCloseDate} and stage eq 'Closed Won' and type eq 'New Business' `,
		newProjectExistingBusiness: `${fiscalYearFilterCloseDate} and stage eq 'Closed Won' and type eq 'New Project Existing Business'`,
	},
	MDF_DASHBOARD: {
		nestedFields: `accountEntry,mdfReqToActs,actToBgts,mdfReqToMDFClms&nestedFieldsDepth=2`,
		requestsFilter: `${fiscalYearFilterSubmitDate} and mdfRequestStatus ne 'draft'`,
	},
	RENEWAL_DASHBOARD: {
		renewals: `closeDate ge ${todayDateISO} and closeDate le ${todayDate30Days} and type eq 'Existing Business' and stage ne 'Closed Lost' and stage ne 'Disqualified' and stage ne 'Rejected' and stage ne 'Rolled into another opportunity'`,
	},
	REVENUE_DASHBOARD: {
		closedWon: `${fiscalYearFilterCloseDate} and stage eq 'Closed Won'`,
	},

	// DEAL_LISTING: {
	// 	// It is probably possible to write more complex querry to combine these two

	// 	submitted: `/o/c/leadsfs?pageSize=200&filter=leadType eq 'Partner Qualified Lead (PQL)' and leadStatus ne 'Qualified' and leadStatus ne 'CAM rejected'`,
	// 	rejected: `/o/c/leadsfs?pageSize=200&filter=leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'CAM rejected' and createDate ge ${currenFiscalYearStart} and createDate le ${currenFiscalYearEnd}`,
	// },
	// OPPORTUNITY_LISTING: {
	// 	// It is probably possible to write more complex querry to combine these two

	// 	closed: ``,
	// 	open: ``,
	// },
	// RENEWAL_LISTING: {
	// 	// It is probably possible to write more complex querry to combine these two

	// 	open: ``,
	// 	closed: ``,
	// },
	// MDF_REQUEST_LISTING: {
	// 	// One query is for Partner Users, the other for Channels  users, only difference is Channels sees 2 years worth of data and Partners only see current year

	// 	partners: ``,
	// 	channels: ``,
	// },
	// MDF_CLAIM_LISTING: {
	// 	// One query is for Partner Users, the other for Channels  users, only difference is Channels sees 2 years worth of data and Partners only see current year

	// 	partners: ``,
	// 	channels: ``,
	// },
};
