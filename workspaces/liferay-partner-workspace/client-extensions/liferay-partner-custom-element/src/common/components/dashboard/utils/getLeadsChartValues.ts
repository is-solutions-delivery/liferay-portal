/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getChartQuarterCount from './getDealsChartQuarterCount';

export default function getLeadsChartValues(
	rejectedLeads: any[],
	submittedLeads: any[],
	approvedLeads: any[]
) {
	return {
		approved: approvedLeads
			?.filter((approvedLead: any) => approvedLead.isConverted)
			.reduce(
				(accumulatedApprovedValues, item) =>
					getChartQuarterCount(
						accumulatedApprovedValues,
						item.dateCreated
					),
				[0, 0, 0, 0]
			),
		rejected: rejectedLeads.reduce(
			(accumulatedRejectedValues, item) =>
				getChartQuarterCount(
					accumulatedRejectedValues,
					item.dateCreated
				),
			[0, 0, 0, 0]
		),
		submitted: submittedLeads
			?.filter(
				(submittedLead: any) =>
					!submittedLead.isConverted ||
					(submittedLead.stage !== 'CAM Rejected' &&
						submittedLead.stage !== 'Qualified')
			)
			.reduce(
				(accumulatedSubmittedValues, item) =>
					getChartQuarterCount(
						accumulatedSubmittedValues,
						item.dateCreated
					),
				[0, 0, 0, 0]
			),
	};
}
