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

import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import SidebarPanel from '../../../SidebarPanel';

const ResourceActions = ({
	actionData,
	actionSectionsIndex,
	setActionSections,
}) => {
	const {selectedItem} = useContext(DiagramBuilderContext);
	const [resourceActions, setResourceActions] = useState('');

	const onChange = ({target: {value}}) => {
		setActionSections((currentSections) => {
			const updatedSections = [...currentSections];

			updatedSections[actionSectionsIndex].assignmentType =
				'resourceActions';
			updatedSections[actionSectionsIndex].resourceAction = value;

			return updatedSections;
		});
		setResourceActions(value);
	};

	useEffect(() => {
		setResourceActions(selectedItem.data.assignments?.resourceAction || '');
		if (actionData.resourceAction) {
			setResourceActions(actionData.resourceAction);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('resource-actions')}>
			<ClayForm.Group>
				<label htmlFor="resource-actions">
					{Liferay.Language.get('resource-actions')}

					<span className="ml-1 mr-1 text-warning">*</span>

					<span
						data-tooltip-align="bottom-right"
						title={Liferay.Language.get(
							'enter-the-comma-separated-resource-actions'
						)}
					>
						<ClayIcon
							className="text-muted"
							symbol="question-circle-full"
						/>
					</span>
				</label>

				<ClayInput
					component="textarea"
					id="resource-actions"
					onChange={onChange}
					placeholder={Liferay.Language.get(
						'type-resource-actions-here'
					)}
					type="text"
					value={resourceActions}
				/>
			</ClayForm.Group>
		</SidebarPanel>
	);
};

export default ResourceActions;
