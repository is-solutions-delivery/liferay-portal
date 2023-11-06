/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const todayDate = new Date();
const currentYear = todayDate.getFullYear();

const currentFiscalYearStart = `${currentYear}-01-01`;
const currentFiscalYearEnd = `${currentYear}-12-31`;

const fiscalYearFilterCloseDate = `closeDate ge ${currentFiscalYearStart} and closeDate le ${currentFiscalYearEnd}`;
const fiscalYearFilterSubmitDate = `submitDate ge ${currentFiscalYearStart}T00:00:00Z and submitDate le ${currentFiscalYearEnd}T23:59:59Z`;

todayDate.setDate(todayDate.getDate() + 30);
const thirtyDaysFromToday = todayDate.toISOString().split('T')[0];

export const Filters = {
	DEAL_DASHBOARD: {
		approvedLeads: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'Qualified'`,
		rejectedLeads: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'CAM rejected'`,
		submittedLeads: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus ne 'Qualified' and leadStatus ne 'CAM rejected'`,
	},
	LEVEL_DASHBOARD: {
		closedWon: `stage eq 'Closed Won' and ${fiscalYearFilterCloseDate}`,
		newBusiness: `stage eq 'Closed Won' and type eq 'New Business' and ${fiscalYearFilterCloseDate}`,
		newProjectExistingBusiness: `stage eq 'Closed Won' and type eq 'New Project Existing Business' and ${fiscalYearFilterCloseDate}`,
	},
	MDF_DASHBOARD: {
		nestedFields: `accountEntry,mdfReqToActs,actToBgts,mdfReqToMDFClms&nestedFieldsDepth=2`,
		requestsFilter: `${fiscalYearFilterSubmitDate} and mdfRequestStatus ne 'draft'`,
	},
	RENEWAL_DASHBOARD: {
		renewals: `closeDate le ${thirtyDaysFromToday} and type eq 'Existing Business' and stage ne 'Closed Lost' and stage ne 'Disqualified' and stage ne 'Rejected' and stage ne 'Rolled into another opportunity'`,
	},
	REVENUE_DASHBOARD: {
		closedWon: `stage eq 'Closed Won' and ${fiscalYearFilterCloseDate} `,
	},
	DEAL_LISTING: {
		rejected: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'CAM rejected' and ${fiscalYearFilterCloseDate} `,
		submitted: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus ne 'Qualified' and leadStatus ne 'CAM rejected' and Created_date__c ge 2023-01-01`,
		combo: `leadType eq 'Partner Qualified Lead (PQL)' and leadStatus ne 'Qualified'`,
	},
	OPPORTUNITY_LISTING: {
		closed: `stage eq 'Closed Won' or stage eq 'Closed Lost' or stage eq 'Disqualified' or stage eq 'Rejected' and type eq 'New Business' or type eq 'New Project Existing Business' and ${fiscalYearFilterCloseDate}`,
		open: `stage ne 'Closed Won' and stage ne 'Closed Lost' and stage ne 'Disqualified' and stage ne 'Rejected' stage ne 'Rolled into opportunity' and type eq 'New Business' or type eq 'New Project Existing Business'`,
		combo: `stage ne 'Rolled into opportunity' and type ne 'Existing Business'`,
	},
	RENEWAL_LISTING: {
		closed: `stage eq 'Closed Won' or stage eq 'Closed Lost' and type eq 'Existing Business' and ${fiscalYearFilterCloseDate}`,
		open: `stage ne 'Closed Won' and stage ne 'Closed Lost' and stage ne 'Disqualified' and stage ne 'Rolled into opportunity' and type eq 'Existing Business'`,
		combo: `stage ne 'Rolled into opportunity' and type eq 'Existing Business'`,
	},
};
