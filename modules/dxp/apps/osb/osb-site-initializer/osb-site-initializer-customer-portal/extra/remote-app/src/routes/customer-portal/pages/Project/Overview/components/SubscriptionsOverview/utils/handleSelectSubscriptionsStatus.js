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

import i18n from '../../../../../../../../common/I18n';
import {SUBSCRIPTIONS_STATUS} from '../../../../../../utils/constants';

export default function handleSelectSubscriptionsStatus(selectedStatus) {
	const isAllStatusSelected =
		selectedStatus.length === Object.keys(SUBSCRIPTIONS_STATUS).length;

	const allStatusSelected = isAllStatusSelected
		? []
		: [
				SUBSCRIPTIONS_STATUS.active,
				SUBSCRIPTIONS_STATUS.expired,
				SUBSCRIPTIONS_STATUS.future,
		  ];

	const otherStatusSelected = (status) =>
		selectedStatus.includes(status)
			? selectedStatus.filter((value) => status !== value)
			: [...selectedStatus, status];

	const handleOtherStatusSelected = isAllStatusSelected
		? i18n.translate('all')
		: !selectedStatus.length
		? i18n.translate('none')
		: selectedStatus.join(', ');

	return {
		allStatusSelected,
		handleOtherStatusSelected,
		isAllStatusSelected,
		otherStatusSelected,
	};
}
