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

import ClayModal from '@clayui/modal';
import React, {useState} from 'react';
import i18n from '../../../../../../../../../../../../../common/I18n';
import {
	Button,
	Table,
} from '../../../../../../../../../../../../../common/components';
import getKebabCase from '../../../../../../../../../../../../../common/utils/getKebabCase';
import useGetSubscriptionsTermsRows from './hooks/useGetSubscriptionsTermsRows';
import getSubscriptionsTermsColumns from './utils/getSubscriptionsTermsColumns';
import getSubscriptionsTermsColumnsWithoutProvisioned from './utils/getSubscriptionsTermsColumnsWithoutProvisioned';

const provisionedRequiredGroups = [
	'Commerce',
	'DXP',
	'Portal',
	'Social Office',
];

const ModalCardSubscriptions = ({
	accountSubscriptionERC,
	observer,
	onClose,
	subscriptionGroup,
	subscriptionName,
}) => {
	const [activePage, setActivePage] = useState(1);

	const subscriptionsTermsColumns = getSubscriptionsTermsColumns();

	const {getRowByColumns, totalCount} = useGetSubscriptionsTermsRows(
		activePage,
		accountSubscriptionERC
	);

	const columnsWithoutProvisioned = getSubscriptionsTermsColumnsWithoutProvisioned(
		subscriptionsTermsColumns
	);

	return (
		<ClayModal center observer={observer} size="lg">
			<div className="pt-4 px-4">
				<div className="d-flex justify-content-between mb-4">
					<div className="flex-row mb-1">
						<h6 className="text-brand-primary">
							{i18n.translate('subscription-terms').toUpperCase()}
						</h6>

						<h2 className="text-neutral-10">{`${i18n.translate(
							getKebabCase(subscriptionGroup)
						)} ${i18n.translate(
							getKebabCase(subscriptionName)
						)}`}</h2>
					</div>

					<Button
						appendIcon="times"
						aria-label="close"
						className="align-self-start"
						displayType="unstyled"
						onClick={onClose}
					/>
				</div>

				<div>
					<Table
						columns={
							provisionedRequiredGroups.includes(
								subscriptionGroup
							)
								? subscriptionsTermsColumns
								: columnsWithoutProvisioned(
										subscriptionsTermsColumns
								  )
						}
						hasPagination
						paginationConfig={{
							activePage,
							itemsPerPage: 5,
							setActivePage,
							totalCount,
						}}
						rows={getRowByColumns()}
						tableVerticalAlignment="middle"
					/>
				</div>
			</div>
		</ClayModal>
	);
};

export default ModalCardSubscriptions;
