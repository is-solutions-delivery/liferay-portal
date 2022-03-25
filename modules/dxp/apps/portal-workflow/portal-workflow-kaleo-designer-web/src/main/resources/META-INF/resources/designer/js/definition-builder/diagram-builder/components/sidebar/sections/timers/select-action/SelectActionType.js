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

import ClayForm, {ClaySelect} from '@clayui/form';
import React from 'react';

const options = [
	{
		actionType: 'timerActions',
		disabled: false,
		label: Liferay.Language.get('action'),
	},
	{
		actionType: 'timerNotifications',
		disabled: true,
		label: Liferay.Language.get('notification'),
	},
	{
		actionType: 'reassignments',
		disabled: false,
		label: Liferay.Language.get('reassignment'),
	},
];

const SelectActionType = ({
	actionSectionsIndex,
	actionType,
	reassignments,
	setActionSections,
}) => {
	options[2].disabled = reassignments;
	function handleChange(value) {
		setActionSections((previousSections) => {
			const updatedSections = [...previousSections];

			updatedSections.splice(actionSectionsIndex, 1, {
				actionType: value,
				identifier: `${Date.now()}-${actionSectionsIndex}`,
			});

			return updatedSections;
		});
	}

	return (
		<ClayForm.Group>
			<label htmlFor="action-type">{Liferay.Language.get('type')}</label>

			<ClaySelect
				aria-label="Select"
				defaultValue={actionType}
				id="action-type"
				onChange={(event) => {
					handleChange(event.target.value);
				}}
			>
				{options.map((item) => (
					<ClaySelect.Option
						disabled={item.disabled}
						key={item.actionType}
						label={item.label}
						value={item.actionType}
					/>
				))}
			</ClaySelect>
		</ClayForm.Group>
	);
};

export default SelectActionType;
