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

import {useQuery} from '@apollo/client';
import i18n from '../../../../../../../../../../../../../../common/I18n';
import {StatusTag} from '../../../../../../../../../../../../../../common/components';
import {getCommerceOrderItems} from '../../../../../../../../../../../../../../common/services/liferay/graphql/queries';
import {SLA_STATUS_TYPES} from '../../../../../../../../../../../../../../common/utils/constants';
import getDateCustomFormat from '../../../../../../../../../../../../../../common/utils/getDateCustomFormat';

const dateFormat = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
};

export default function useGetSubscriptionsTermsRows(
	activePage,
	accountSubscriptionERC
) {
	const {data} = useQuery(getCommerceOrderItems, {
		variables: {
			filter: `customFields/accountSubscriptionERC eq '${accountSubscriptionERC}'`,
			page: activePage,
			pageSize: 5,
		},
	});

	const dataOrderItems = data?.orderItems?.items || [];

	const totalCount = data?.orderItems?.totalCount;

	const getRowByColumns = () => {
		return dataOrderItems.map(({customFields, options, quantity}) => {
			const optionsParsed = JSON.parse(options);
			const fields = customFields.reduce(
				(fieldsAccumulator, currentField) => ({
					...fieldsAccumulator,
					[currentField.name]: currentField.customValue.data,
				}),
				{}
			);

			return {
				'instance-size': optionsParsed.instanceSize || '-',
				'provisioned': fields.provisionedCount || '-',
				'quantity': quantity || '-',
				'start-end-date': `${getDateCustomFormat(
					optionsParsed.startDate,
					dateFormat
				)} - ${getDateCustomFormat(optionsParsed.endDate, dateFormat)}`,
				'subscription-term-status':
					(fields.status && (
						<StatusTag
							currentStatus={i18n.translate(
								SLA_STATUS_TYPES[
									`${fields.status.toLowerCase()}`
								]
							)}
						/>
					)) ||
					'-',
			};
		});
	};

	return {getRowByColumns, totalCount};
}
