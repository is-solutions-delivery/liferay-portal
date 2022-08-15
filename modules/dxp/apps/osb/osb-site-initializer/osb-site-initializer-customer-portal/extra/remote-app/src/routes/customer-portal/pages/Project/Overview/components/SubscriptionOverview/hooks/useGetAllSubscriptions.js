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

import {useEffect, useState} from 'react';
import {useAppPropertiesContext} from '../../../../../../../../common/contexts/AppPropertiesContext';

import {getAccountSubscriptions} from '../../../../../../../../common/services/liferay/graphql/queries';
import {useCustomerPortal} from '../../../../../../context';

export default function useGetAllSubscriptions(
	parseAccountSubscriptionGroupERC
) {
	const {client} = useAppPropertiesContext();
	const [{project, subscriptionGroups}] = useCustomerPortal();

	const [accountSubscriptions, setAccountSubscriptions] = useState([]);
	const [
		subscriptionGroupsWithSubscriptions,
		setSubscriptionGroupsWithSubscriptions,
	] = useState([]);

	useEffect(() => {
		const getAllSubscriptions = async (accountKey) => {
			const {data: dataAccountSubscriptions} = await client.query({
				fetchPolicy: 'network-only',
				query: getAccountSubscriptions,
				variables: {
					filter: `accountKey eq '${accountKey}'`,
				},
			});

			if (dataAccountSubscriptions) {
				const dataAllSubscriptions =
					dataAccountSubscriptions?.c?.accountSubscriptions?.items;

				const accountSubscriptionGroups = subscriptionGroups.filter(
					(subscriptionGroup) =>
						dataAllSubscriptions.some(
							(subscription) =>
								subscription.accountSubscriptionGroupERC.replace(
									`${accountKey}_`,
									''
								) ===
								parseAccountSubscriptionGroupERC(
									subscriptionGroup.name
								)
						)
				);

				setAccountSubscriptions(dataAllSubscriptions);

				setSubscriptionGroupsWithSubscriptions(
					accountSubscriptionGroups.sort(
						(
							previousAccountSubscriptionGroup,
							nextAccountSubscriptionGroup
						) =>
							previousAccountSubscriptionGroup?.tabOrder -
							nextAccountSubscriptionGroup?.tabOrder
					)
				);
			}
		};

		if (subscriptionGroups && project) {
			getAllSubscriptions(project.accountKey);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client, project, subscriptionGroups]);

	return {
		accountSubscriptions,
		subscriptionGroupsWithSubscriptions,
	};
}
