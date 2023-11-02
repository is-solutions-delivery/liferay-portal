/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const Filters = {
    DEAL_DASHBOARD: {
        deals: `/o/c/leadsfs?pageSize=200&filter=leadType eq 'Partner Qualified Lead (PQL)' and createDate ge ${fiscalYearStart} and createDate le ${fiscalYearEnd}`,
	},
    LEVEL_DASHBOARD: {
        opportunities: `/o/c/opportunitysfs?pageSize=200&sort=closeDate:desc&filter=stage eq 'Closed Won' and closeDate ge ${fiscalYearStart} and closeDate le ${fiscalYearEnd}`,
    },
    MDF_DASHBOARD: { //Need to add filter for submitDate between ${fiscalYearStart} and ${fiscalYearEnd}
        requests: `/o/c/mdfrequests?nestedFields=accountEntry,mdfReqToActs,actToBgts,mdfReqToMDFClms&nestedFieldsDepth=2&pageSize=9999&filter=mdfRequestStatus ne 'draft'`,
    },
    RENEWAL_DASHBOARD: {
		renewals: `/o/c/opportunitysfs?pageSize=200&sort=closeDate:asc&filter=type eq 'Existing Business' and stage ne 'Closed Lost' and stage ne 'Disqualified' and stage ne 'Rejected' and stage ne 'Rolled into another opportunity' and closeDate le ${thirtyDaysFromToday}`,
	},
    REVENUE_DASHBOARD: {
        opportunities: `/o/c/opportunitysfs?pageSize=200&sort=closeDate:desc&filter=stage eq 'Closed Won' and closeDate ge ${fiscalYearStart} and closeDate le ${fiscalYearEnd}`,
    },
    DEAL_LISTING: { //It is probably possible to write more complex querry to combine these two
        submitted: `/o/c/leadsfs?pageSize=200&filter=leadType eq 'Partner Qualified Lead (PQL)' and leadStatus ne 'Qualified' and leadStatus ne 'CAM rejected'`,
        rejected: `/o/c/leadsfs?pageSize=200&filter=leadType eq 'Partner Qualified Lead (PQL)' and leadStatus eq 'CAM rejected' and createDate ge ${fiscalYearStart} and createDate le ${fiscalYearEnd}`,
    },
    OPPORTUNITY_LISTING: { //It is probably possible to write more complex querry to combine these two
        open: ``,
        closed: ``,
    },
    RENEWAL_LISTING:{ //It is probably possible to write more complex querry to combine these two
        open: ``,
        closed: ``,
    },
    MDF_REQUEST_LISTING: { //One query is for Partner Users, the other for Channels  users, only difference is Channels sees 2 years worth of data and Partners only see current year
        partners: ``,
        channels: ``,
    },
    MDF_CLAIM_LISTING: { //One query is for Partner Users, the other for Channels  users, only difference is Channels sees 2 years worth of data and Partners only see current year
        partners: ``,
        channels: ``,
    },
};
