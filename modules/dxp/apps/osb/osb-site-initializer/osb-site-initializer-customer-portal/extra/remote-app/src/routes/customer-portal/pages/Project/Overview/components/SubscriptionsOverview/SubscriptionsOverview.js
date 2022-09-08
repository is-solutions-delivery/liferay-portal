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
import {useOutletContext} from 'react-router-dom';
import i18n from '../../../../../../../common/I18n';
import {useCustomerPortal} from '../../../../../context';
import {SUBSCRIPTIONS_STATUS} from '../../../../../utils/constants';
import '../../app.scss';
import CardSubscriptionsList from './components/CardSubscriptionsList/CardSubscriptionsList';
import SubscriptionGroupsNavBar from './components/SubscriptionGroupsNavBar/SubscriptionGroupsNavBar';
import useAccountSubscriptionGroupsName from './hooks/useAccountSubscriptionGroupsName';
import handleSelectSubscriptionsStatus from './utils/handleSelectSubscriptionsStatus';

const SubscriptionsOverview = () => {
	const [{project}] = useCustomerPortal();
	const {setHasQuickLinksPanel, setHasSideMenu} = useOutletContext();
	const [selectedSubscriptionGroup, setSelectedSubscriptionGroup] = useState(
		''
	);
	const [
		accountSubscriptionGroupsNames,
		setAccountSubscriptionGroupsNames,
	] = useState([]);

	const [selectedStatus, setSelectedStatus] = useState([
		SUBSCRIPTIONS_STATUS.active,
		SUBSCRIPTIONS_STATUS.expired,
		SUBSCRIPTIONS_STATUS.future,
	]);

	const {isPartnership} = useAccountSubscriptionGroupsName(
		project,
		selectedSubscriptionGroup,
		setAccountSubscriptionGroupsNames
	);

	const {
		allStatusSelected,
		handleOtherStatusSelected,
		isAllStatusSelected,
		otherStatusSelected,
	} = handleSelectSubscriptionsStatus(selectedStatus);

	useEffect(() => {
		setHasQuickLinksPanel(true);
		setHasSideMenu(true);
	}, [setHasSideMenu, setHasQuickLinksPanel]);

	return (
		<div>
			<div className="d-flex flex-column mr-4 mt-6">
				{!isPartnership && <h3>{i18n.translate('subscriptions')}</h3>}

				<SubscriptionGroupsNavBar
					firstselectedSubscriptionGroup={(subscriptionGroups) =>
						setSelectedSubscriptionGroup(
							subscriptionGroups[0]?.name
						)
					}
					handleAllStatusSelected={isAllStatusSelected ? 'check' : ''}
					handleChangeStatus={(status) =>
						status === 'All'
							? setSelectedStatus(allStatusSelected)
							: setSelectedStatus(otherStatusSelected(status))
					}
					handleChangeSubscriptionGroup={(value) =>
						setSelectedSubscriptionGroup(value)
					}
					handleOtherStatusSelected={handleOtherStatusSelected}
					handleSelectedStatusIcon={(status) =>
						selectedStatus.includes(status) ? 'check' : ''
					}
					selectedSubscriptionGroup={selectedSubscriptionGroup}
					subscriptionGroups={accountSubscriptionGroupsNames}
				/>

				<CardSubscriptionsList
					project={project}
					selectedStatus={selectedStatus}
					selectedSubscriptionGroup={selectedSubscriptionGroup}
				/>
			</div>
		</div>
	);
};

export default SubscriptionsOverview;
