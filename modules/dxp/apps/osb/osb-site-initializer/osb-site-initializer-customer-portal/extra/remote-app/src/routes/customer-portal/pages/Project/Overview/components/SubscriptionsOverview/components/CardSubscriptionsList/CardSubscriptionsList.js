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

import i18n from '../../../../../../../../../common/I18n';
import CardSubscriptions from './components/CardSubscriptions/CardSubscriptions';
import useGetSubscriptionsCards from './hooks/useGetSubscriptionsCards';

const CardSubscriptionsList = ({
	project,
	selectedStatus,
	selectedSubscriptionGroup,
}) => {
	const subscriptionsCards = useGetSubscriptionsCards(
		project,
		selectedSubscriptionGroup,
		selectedStatus
	);

	return (
		<div className="cp-overview-cards-subscription d-flex flex-wrap mt-4">
			{subscriptionsCards?.length ? (
				subscriptionsCards.map((accountSubscription, index) => (
					<CardSubscriptions
						cardSubscriptionData={accountSubscription}
						key={index}
						selectedSubscriptionGroup={selectedSubscriptionGroup}
					/>
				))
			) : (
				<p className="mx-auto pt-5">
					{i18n.translate('no-subscriptions-match-these-criteria')}
				</p>
			)}
		</div>
	);
};

export default CardSubscriptionsList;
