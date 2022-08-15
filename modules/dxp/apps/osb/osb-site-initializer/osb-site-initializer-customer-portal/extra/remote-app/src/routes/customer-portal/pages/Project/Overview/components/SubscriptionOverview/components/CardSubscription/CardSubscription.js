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

import {useModal} from '@clayui/modal';
import {useState} from 'react';
import i18n from '../../../../../../../../../common/I18n';
import {StatusTag} from '../../../../../../../../../common/components';
import {useAppPropertiesContext} from '../../../../../../../../../common/contexts/AppPropertiesContext';
import {SLA_STATUS_TYPES} from '../../../../../../../../../common/utils/constants';
import getDateCustomFormat from '../../../../../../../../../common/utils/getDateCustomFormat';
import getKebabCase from '../../../../../../../../../common/utils/getKebabCase';
import ModalCardSubscription from '../../../../../../../containers/ModalCardSubscription';
import {dateFormat} from './utils/dateFormat';
import {SUBSCRIPTION_IMAGE_FILE} from './utils/subscriptionImageFile';

const CardSubscription = ({
	cardSubscriptionData,
	selectedSubscriptionGroup,
}) => {
	const {liferayWebDAV} = useAppPropertiesContext();
	const [visible, setVisible] = useState(false);
	const {observer, onClose} = useModal({
		onClose: () => setVisible(false),
	});

	const subscriptionStatus = cardSubscriptionData.subscriptionStatus.toLowerCase();

	const parseAccountSubscriptionTerms = (subscriptionName) =>
		subscriptionName.toLowerCase().replace(' ', '-');

	const accountSubscriptionERC = `${
		cardSubscriptionData.accountSubscriptionGroupERC
	}_${parseAccountSubscriptionTerms(cardSubscriptionData.name)}`;

	return (
		<>
			{visible && (
				<ModalCardSubscription
					accountSubscriptionERC={accountSubscriptionERC}
					observer={observer}
					onClose={onClose}
					subscriptionGroup={selectedSubscriptionGroup}
					subscriptionName={cardSubscriptionData.name}
				/>
			)}
			<div
				className="border border-light cp-card-subscription px-3 py-4 rounded"
				onClick={() => setVisible(true)}
			>
				<div className="text-center">
					<img
						className="w-25"
						src={`${liferayWebDAV}/assets/navigation-menu/${
							SUBSCRIPTION_IMAGE_FILE[
								selectedSubscriptionGroup
							] || 'portal_icon.svg'
						}`}
					/>
				</div>

				<div className="mt-4">
					<h5 className="mb-1 text-center title">
						{i18n.translate(
							getKebabCase(cardSubscriptionData?.name)
						) || ' - '}
					</h5>

					<p className="mb-1 text-center text-neutral-7 text-paragraph-sm">
						{`${i18n.translate('instance-size')}: `}

						{`${cardSubscriptionData?.instanceSize || ' - '}`}
					</p>

					<p className="mb-3 text-center">
						{`${getDateCustomFormat(
							cardSubscriptionData?.startDate,
							dateFormat
						)} - ${getDateCustomFormat(
							cardSubscriptionData?.endDate,
							dateFormat
						)}`}
					</p>

					<div className="d-flex justify-content-center">
						<StatusTag
							currentStatus={i18n.translate(
								SLA_STATUS_TYPES[subscriptionStatus]
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default CardSubscription;
