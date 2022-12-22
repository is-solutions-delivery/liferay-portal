/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import ClayButton from '@clayui/button';
import ClayChart from '@clayui/charts';
import React, {useEffect, useMemo, useState} from 'react';

import Container from '../../common/components/container';
const colors = {
	aproved: '#8FB5FF',
	closedwon: '#002C62',
	rejected: '#FF6060',
	submited: '#E7EFFF',
};
export default function () {
	const [opportunities, setOpportunities] = useState();
	const [leads, setLeads] = useState();
	useEffect(() => {
		const getOpportunities = async () => {
			// eslint-disable-next-line @liferay/portal/no-global-fetch
			await fetch('/o/c/opportunitysfs', {
				headers: {
					'accept': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					setOpportunities(data?.items);
				})
				.catch(() => {
					Liferay.Util.openToast({
						message: 'An unexpected error occured.',
						type: 'danger',
					});
				});
		};
		const getLeads = async () => {
			// eslint-disable-next-line @liferay/portal/no-global-fetch
			await fetch('/o/c/leadsfs', {
				headers: {
					'accept': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					setLeads(data?.items);
				})
				.catch(() => {
					Liferay.Util.openToast({
						message: 'An unexpected error occured.',
						type: 'danger',
					});
				});
		};
		getOpportunities();
		getLeads();
	}, []);

	const filteredDeals = useMemo(() => {
		return {
			approvedDeals: opportunities?.filter(
				(item) => item.stage === 'Open'
			),
			closedWonDeals: opportunities?.filter(
				(item) => item.stage === 'Closed Won'
			),
			rejectedDeals:
				leads?.filter((item) => item.leadStatus === 'CAM rejected') ||
				opportunities?.filter((item) => item.stage === 'Rejected'),
			submitedDeals: leads?.filter(
				(item) =>
					item.leadType === 'Partner Prospect Lead (PPL)' &&
					(item.leadStatus !== 'Sales Qualified Opportunity' ||
						item.leadStatus !== 'CAM rejected')
			),
		};
	}, [leads, opportunities]);

	const chart = {
		bar: {
			radius: {
				ratio: 0.2,
			},
			width: {
				ratio: 0.3,
			},
		},
		data: {
			colors,
			columns: [
				['submited', 110, 80, 200, 200],
				['aproved', 200, 100, 140, 140],
				['rejected', 295, 250, 298, 298],
				['closedwon', 50, 50, 50, 50],
			],
			groups: [['submited', 'aproved', 'closedwon']],
			order: 'desc',
			type: 'bar',
			types: {
				aproved: 'bar',
				closedwon: 'bar',
				rejected: 'spline',
				submited: 'bar',
			},
		},
		filteredData: [
			filteredDeals?.approvedDeals,
			filteredDeals?.closedWonDeals,
			filteredDeals?.rejectedDeals,
			filteredDeals?.submitedDeals,
		],
		grid: {
			y: {
				lines: [{value: 100}, {value: 200}, {value: 300}, {value: 400}],
			},
		},
	};

	return (
		<Container className="deals-chart-card-height" title="Deals">
			<ClayChart bar={chart.bar} data={chart.data} grid={chart.grid} />

			<div>
				<hr className="mb-3 mt-1" />

				<div className="d-flex">
					<ClayButton className="btn btn-primary mr-4 mt-2">
						View All
					</ClayButton>

					<ClayButton className="btn btn-primary mr-4 mt-2">
						New Deal
					</ClayButton>
				</div>
			</div>
		</Container>
	);
}
