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
import {useEffect, useState} from 'react';
import {useOutletContext} from 'react-router-dom';
import i18n from '../../../../../../../common/I18n';
import {useCustomerPortal} from '../../../../../context';
import {actionTypes} from '../../../../../context/reducer';
import {
	PRODUCT_TYPES,
	SUBSCRIPTIONS_STATUS,
} from '../../../../../utils/constants';
import {getWebContents} from '../../../../../utils/getWebContents';
import CardSubscription from '../SubscriptionOverview/components/CardSubscription';
import SubscriptionsFilterByStatus from '../SubscriptionOverview/components/SubscriptionsFilterByStatus';
import SubscriptionsNavbar from '../SubscriptionOverview/components/SubscriptionsNavbar';
import '../../app.scss';
import useGetAllSubscriptions from './hooks/useGetAllSubscriptions';

import {parseAccountSubscriptionGroupERC} from './utils/parseAccountSubscriptionGroupERC';

const SubscriptionOverview = () => {
	const [{project, subscriptionGroups}, dispatch] = useCustomerPortal();

	const {
		accountSubscriptions,
		subscriptionGroupsWithSubscriptions,
	} = useGetAllSubscriptions(parseAccountSubscriptionGroupERC);

	const {setHasQuickLinksPanel, setHasSideMenu} = useOutletContext();

	const [selectedSubscriptionGroup, setSelectedSubscriptionGroup] = useState(
		''
	);
	const [selectedStatus, setSelectedStatus] = useState([
		SUBSCRIPTIONS_STATUS.active,
		SUBSCRIPTIONS_STATUS.expired,
		SUBSCRIPTIONS_STATUS.future,
	]);

	const subscriptionsCards = accountSubscriptions.filter(
		(subscription) =>
			subscription.accountSubscriptionGroupERC.replace(
				`${project?.accountKey}_`,
				''
			) === parseAccountSubscriptionGroupERC(selectedSubscriptionGroup) &&
			selectedStatus.includes(subscription.subscriptionStatus)
	);

	useEffect(() => {
		setHasQuickLinksPanel(true);
		setHasSideMenu(true);
	}, [setHasSideMenu, setHasQuickLinksPanel]);

	useEffect(() => {
		if (project && subscriptionGroups) {
			dispatch({
				payload: getWebContents(
					project.dxpVersion,
					project.slaCurrent,
					subscriptionGroups
				),
				type: actionTypes.UPDATE_QUICK_LINKS,
			});
		}
	}, [dispatch, project, subscriptionGroups]);

	const isPartnership =
		selectedSubscriptionGroup === PRODUCT_TYPES.partnership ||
		(subscriptionGroups &&
			subscriptionGroups[0]?.name === PRODUCT_TYPES.partnership);

	return (
		<div>
			<div className="d-flex flex-column mr-4 mt-6">
				{!isPartnership && <h3>{i18n.translate('subscriptions')}</h3>}

				{!!subscriptionGroupsWithSubscriptions.length && (
					<div>
						<div
							className={classNames('align-items-center d-flex', {
								'justify-content-between':
									subscriptionGroupsWithSubscriptions.length <
									5,
								'justify-content-evenly':
									subscriptionGroupsWithSubscriptions.length >
									4,
							})}
						>
							<SubscriptionsNavbar
								selectedSubscriptionGroup={
									selectedSubscriptionGroup
								}
								setSelectedSubscriptionGroup={
									setSelectedSubscriptionGroup
								}
								subscriptionGroups={
									subscriptionGroupsWithSubscriptions
								}
							/>

							<SubscriptionsFilterByStatus
								selectedStatus={selectedStatus}
								setSelectedStatus={setSelectedStatus}
							/>
						</div>

						<div className="cp-overview-cards-subscription d-flex flex-wrap mt-4">
							{subscriptionsCards.length ? (
								subscriptionsCards.map(
									(accountSubscription, index) => (
										<CardSubscription
											cardSubscriptionData={
												accountSubscription
											}
											key={index}
											selectedSubscriptionGroup={
												selectedSubscriptionGroup
											}
										/>
									)
								)
							) : (
								<p className="mx-auto pt-5">
									{i18n.translate(
										'no-subscriptions-match-these-criteria'
									)}
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubscriptionOverview;
