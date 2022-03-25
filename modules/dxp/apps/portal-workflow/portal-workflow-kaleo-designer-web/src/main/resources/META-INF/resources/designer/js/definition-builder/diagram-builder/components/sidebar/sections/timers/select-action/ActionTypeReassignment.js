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

import React, {useContext, useState} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import AssetCreator from '../select-reassignment/AssetCreator';
import ResourceActions from '../select-reassignment/ResourceActions';
import Role from '../select-reassignment/Role';
import RoleType from '../select-reassignment/RoleType';
import ScriptedReassignment from '../select-reassignment/ScriptedReassignment';
import {SelectReassignment} from '../select-reassignment/SelectReassignment';
import User from '../select-reassignment/User';

const assignmentSectionComponents = {
	assetCreator: AssetCreator,
	resourceActions: ResourceActions,
	roleId: Role,
	roleType: RoleType,
	scriptedReassignment: ScriptedReassignment,
	user: User,
};

const ActionTypeReassignment = (props) => {
	const {selectedItem} = useContext(DiagramBuilderContext);
	const assignmentType = selectedItem?.data?.assignments;
	const [section, setSection] = useState(assignmentType || 'assetCreator');
	const [sections, setSections] = useState([{identifier: `${Date.now()}-0`}]);
	const ReassignmentSectionComponent = assignmentSectionComponents[section];

	return (
		<>
			<SelectReassignment
				section={section}
				setSection={setSection}
				setSections={setSections}
			/>

			{sections.map(({identifier, ...restProps}, index) => {
				return (
					ReassignmentSectionComponent && (
						<ReassignmentSectionComponent
							{...props}
							{...restProps}
							identifier={identifier}
							index={index}
								setErrors={setErrors}
								setSections={setSubSections}
			})}
		</>
	);
};

export default ActionTypeReassignment;
