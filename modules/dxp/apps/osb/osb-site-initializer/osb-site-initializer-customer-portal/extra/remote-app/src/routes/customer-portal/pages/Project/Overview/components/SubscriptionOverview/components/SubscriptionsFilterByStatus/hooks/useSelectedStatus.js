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

function useSelectedStatus({
	SUBSCRIPTIONS_STATUS,
	selectedStatus,
	setSelectedStatus,
}) {
	const handleChange = (status) => {
		if (status === 'All') {
			return setSelectedStatus(
				selectedStatus.length ===
					Object.keys(SUBSCRIPTIONS_STATUS).length
					? []
					: [
							SUBSCRIPTIONS_STATUS.active,
							SUBSCRIPTIONS_STATUS.expired,
							SUBSCRIPTIONS_STATUS.future,
					  ]
			);
		}

		setSelectedStatus(
			selectedStatus.includes(status)
				? selectedStatus.filter((value) => status !== value)
				: [...selectedStatus, status]
		);
	};

	return handleChange;
}

export default useSelectedStatus;
