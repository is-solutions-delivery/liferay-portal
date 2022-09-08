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

import {useGetAccountSubscriptions} from '../../../../../../../../../../common/services/liferay/graphql/account-subscriptions/queries/useGetAccountSubscriptions';

export default function useGetSubscriptionsCards(
	project,
	selectedSubscriptionGroup,
	selectedStatus
) {
	const {data: dataAccountSubscriptions} = useGetAccountSubscriptions({
		filter: `accountKey eq '${project?.accountKey}'`,
	});
	const accountSubscriptions =
		dataAccountSubscriptions?.c?.accountSubscriptions?.items;

	const parseAccountSubscriptionGroupERC = (subscriptionName) => {
		return subscriptionName?.toLowerCase().replaceAll(' ', '-');
	};

	return accountSubscriptions?.filter(
		(subscription) =>
			subscription.accountSubscriptionGroupERC.replace(
				`${project?.accountKey}_`,
				''
			) === parseAccountSubscriptionGroupERC(selectedSubscriptionGroup) &&
			selectedStatus.includes(subscription.subscriptionStatus)
	);
}
