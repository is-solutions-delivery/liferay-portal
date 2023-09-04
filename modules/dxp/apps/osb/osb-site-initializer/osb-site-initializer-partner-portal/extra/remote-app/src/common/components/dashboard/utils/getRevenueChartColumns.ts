/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function getRevenueChartColumns(
	revenueCurrency: any,
	growthRevenueData: any,
	renewalRevenueData: any,
	setTitleChart: any,
	setValueChart: any,
	setColumnsRevenueChart: any
) {
	const STAGE_CLOSEDWON = 'Closed Won';

	const chartColumns = [];

	const totalGrowthRevenue = growthRevenueData?.items?.reduce(
		(accumulator: number, currentValue: any) => {
			if (currentValue.stage === STAGE_CLOSEDWON) {
				return accumulator + currentValue.growthArr;
			}

			return accumulator;
		},
		0
	);

	chartColumns.push(['Growth Revenue', totalGrowthRevenue]);

	const totalRenewalRevenue = renewalRevenueData?.items?.reduce(
		(accumulator: number, currentValue: any) => {
			accumulator + currentValue.renewalArr;

			return accumulator;
		},
		0
	);

	chartColumns.push(['Renewal Revenue', totalRenewalRevenue]);

	const totalRevenueAmount = totalGrowthRevenue + totalRenewalRevenue;

	setValueChart(totalRevenueAmount);
	setTitleChart(` Total Revenue`);
	setColumnsRevenueChart(chartColumns);
}
