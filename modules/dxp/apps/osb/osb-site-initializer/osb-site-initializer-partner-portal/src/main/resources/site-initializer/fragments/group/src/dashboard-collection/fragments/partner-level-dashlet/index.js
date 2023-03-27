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

import ClayLoadingIndicator from '@clayui/loading-indicator';
import React, {useEffect, useState} from 'react';

import PartnershipLevel from '../../common/components/PartnershipLevel';
import Container from '../../common/components/container';
import {PartnershipLevels} from '../../common/enums/partnershipLevels';
import {partnerLevelProperties} from '../../common/mock/mock';
import ClayIconProvider from '../../common/utils/ClayIconProvider';

export default function () {
	const [data, setData] = useState({});
	const [headcount, setHeadcount] = useState({});
	const [completed, setCompleted] = useState({});
	const [loading, setLoading] = useState(false);

	const getAccountInformation = async () => {
		setLoading(true);

		// eslint-disable-next-line @liferay/portal/no-global-fetch
		const accountsData = await fetch(
			'/o/headless-admin-user/v1.0/my-user-account',
			{
				headers: {
					'accept': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
			}
		);

		if (accountsData.ok) {
			const userAccount = await accountsData.json();
			console.log('userAccount', userAccount);

			// eslint-disable-next-line @liferay/portal/no-global-fetch
			const accountInfoData = await fetch(
				`/o/headless-admin-user/v1.0/accounts/${userAccount.accountBriefs[0].id}`,
				{
					headers: {
						'accept': 'application/json',
						'x-csrf-token': Liferay.authToken,
					},
				}
			);

			// eslint-disable-next-line @liferay/portal/no-global-fetch
			const accountUsersResponse = await fetch(
				`/o/headless-admin-user/v1.0/accounts/${userAccount.accountBriefs[0].id}/user-accounts`,
				{
					headers: {
						'accept': 'application/json',
						'x-csrf-token': Liferay.authToken,
					},
				}
			);

			const checkedItems = {};

			if (accountInfoData.ok) {
				const fragmentData = await accountInfoData.json();
				console.log('fragmentData', fragmentData);

				if (
					fragmentData.partnerLevel !== PartnershipLevels.AUTHORIZED
				) {
					if (fragmentData.solutionDeliveryCertification) {
						checkedItems['solutionDeliveryCertification'] = true;
					}

					if (
						fragmentData.partnerLevel !== PartnershipLevels.SILVER
					) {
						if (fragmentData.marketingPlan) {
							checkedItems['marketingPlan'] = true;
						}

						if (fragmentData.marketingPerformance) {
							checkedItems['marketingPerformance'] = true;
						}

						if (
							fragmentData.partnerLevel === PartnershipLevels.GOLD
						) {
							const hasMatchingARR =
								fragmentData.aRRAmount ===
								partnerLevelProperties[
									fragmentData.partnerLevel
								].growthARR;

							const hastMatchingNPOrNB =
								fragmentData.newProjectExistingBusiness ===
								partnerLevelProperties[
									fragmentData.partnerLevel
								].newProjectExistingBusiness;

							if (hasMatchingARR || hastMatchingNPOrNB) {
								checkedItems['arr'] = true;
							}
						}

						if (
							fragmentData.partnerLevel ===
								PartnershipLevels.PLATINUM &&
							fragmentData.aRRAmount ===
								fragmentData.growthARR + fragmentData.renewalARR
						) {
							checkedItems['arr'] = true;
						}
					}
				}

				if (accountUsersResponse.ok) {
					const {
						items: accountUsers,
					} = await accountUsersResponse.json();

					console.log('accountUsers', accountUsers);

					const countHeadcount = {
						partnerMarketingUser: 0,
						partnerSalesUsers: 0,
					};

					accountUsers.forEach((user) => {
						if (
							user.accountBriefs[0].roleBriefs.find(
								(role) => role.name === 'Partner Marketing User'
							)
						) {
							countHeadcount['partnerMarketingUser'] += 1;
						}

						if (
							user.accountBriefs[0].roleBriefs.find(
								(role) => role.name === 'Partner Sales Users'
							)
						) {
							countHeadcount['partnerSalesUsers'] += 1;
						}
					});

					if (
						countHeadcount.partnerMarketingUser ===
							partnerLevelProperties[fragmentData.partnerLevel]
								.partnerMarketingUser &&
						countHeadcount.partnerSalesUsers ===
							partnerLevelProperties[fragmentData.partnerLevel]
								.partnerSalesUsers
					) {
						checkedItems['headcount'] = true;
					}

					setHeadcount(countHeadcount);
				}

				setData(fragmentData);
				setCompleted(checkedItems);
			}
		}

		setLoading(false);
	};

	useEffect(() => {
		getAccountInformation();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return <ClayLoadingIndicator className="mb-10 mt-9" size="md" />;
	}

	return (
		<ClayIconProvider>
			<Container title="Partnership Level">
				<PartnershipLevel
					completed={completed}
					data={data}
					headcount={headcount}
				/>
			</Container>
		</ClayIconProvider>
	);
}
