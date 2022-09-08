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

import classNames from 'classnames';
import SubscriptionsFilterByStatus from './components/SubscriptionsFilterByStatus';
import SubscriptionsNavbar from './components/SubscriptionsNavbar';

const SubscriptionGroupsNavBar = ({
	firstselectedSubscriptionGroup,
	handleAllStatusSelected,
	handleChangeStatus,
	handleChangeSubscriptionGroup,
	handleOtherStatusSelected,
	handleSelectedStatusIcon,
	selectedSubscriptionGroup,
	subscriptionGroups,
}) => {
	return (
		<div
			className={classNames('align-items-center d-flex', {
				'justify-content-between': subscriptionGroups?.length < 5,
				'justify-content-evenly': subscriptionGroups?.length > 4,
			})}
		>
			<SubscriptionsNavbar
				firstselectedSubscriptionGroup={firstselectedSubscriptionGroup}
				handleChangeSubscriptionGroup={handleChangeSubscriptionGroup}
				selectedSubscriptionGroup={selectedSubscriptionGroup}
				subscriptionGroups={subscriptionGroups}
			/>

			<SubscriptionsFilterByStatus
				handleAllStatusSelected={handleAllStatusSelected}
				handleChangeStatus={handleChangeStatus}
				handleOtherStatusSelected={handleOtherStatusSelected}
				handleSelectedStatusIcon={handleSelectedStatusIcon}
			/>
		</div>
	);
};

export default SubscriptionGroupsNavBar;
