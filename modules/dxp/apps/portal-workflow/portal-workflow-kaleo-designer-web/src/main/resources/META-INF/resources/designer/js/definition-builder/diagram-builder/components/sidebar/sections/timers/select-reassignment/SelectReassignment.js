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
import ClayIcon from '@clayui/icon';
import React, {useEffect} from 'react';

const options = [
	{
		assignmentType: 'assetCreator',
		label: Liferay.Language.get('asset-creator'),
	},
	{
		assignmentType: 'resourceActions',
		label: Liferay.Language.get('resource-actions'),
	},
	{
		assignmentType: 'roleId',
		label: Liferay.Language.get('role'),
	},
	{
		assignmentType: 'user',
		label: Liferay.Language.get('user'),
	},
	{
		assignmentType: 'roleType',
		disabled: true,
		label: Liferay.Language.get('role-type'),
	},
	{
		assignmentType: 'scriptedReassignment',
		label: Liferay.Language.get('scripted-reassignment'),
	},
];

const SelectReassignment = ({
	currentAssignmentType,
	setSection,
	setSubSections,
}) => {
	useEffect(() => {
		if (!currentAssignmentType) {
			setSection('assetCreator');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ClayForm.Group>
			<label htmlFor="reassignment-type">
				{Liferay.Language.get('reassignment-type')}

				<span
					className="ml-2"
					title={Liferay.Language.get('select-the-reassignment-type')}
				>
					<ClayIcon
						className="text-muted"
						symbol="question-circle-full"
					/>
				</span>
			</label>

			<ClaySelect
				aria-label="Select"
				defaultValue={currentAssignmentType}
				id="reassignment-type"
				onChange={(event) => {
					setSection(event.target.value);
					setSubSections([{identifier: `${Date.now()}-0`}]);
				}}
			>
				{options.map(({assignmentType, disabled, label}) => (
					<ClaySelect.Option
						disabled={disabled}
						key={assignmentType}
						label={label}
						value={assignmentType}
					/>
				))}
			</ClaySelect>
		</ClayForm.Group>
	);
};

export {SelectReassignment};
