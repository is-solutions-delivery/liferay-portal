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

import {useEffect} from 'react';
import {useGetAccountSubscriptionGroups} from '../../../../../../../../common/services/liferay/graphql/account-subscription-groups';
import {PRODUCT_TYPES} from '../../../../../../utils/constants';

export default function useAccountSubscriptionGroupsName(
	project,
	selectedSubscriptionGroup,
	setAccountSubscriptionGroupsNames
) {
	const {data} = useGetAccountSubscriptionGroups({
		filter: `accountKey eq '${project?.accountKey}' and hasActivation eq true`,
		sort: 'tabOrder:asc',
	});
	const subscriptionGroups = data?.c?.accountSubscriptionGroups?.items;

	useEffect(() => {
		setAccountSubscriptionGroupsNames(
			subscriptionGroups?.filter(
				(subscriptionGroup) => subscriptionGroup?.name
			)
		);
	}, [setAccountSubscriptionGroupsNames, subscriptionGroups]);

	const isPartnership =
		selectedSubscriptionGroup === PRODUCT_TYPES.partnership ||
		(subscriptionGroups &&
			subscriptionGroups[0]?.name === PRODUCT_TYPES.partnership);

	return {isPartnership};
}
