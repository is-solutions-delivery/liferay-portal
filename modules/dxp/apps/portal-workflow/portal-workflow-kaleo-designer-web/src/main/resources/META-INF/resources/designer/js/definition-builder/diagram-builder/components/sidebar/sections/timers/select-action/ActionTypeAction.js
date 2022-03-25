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

// import ClayButton, {ClayButtonWithIcon} from '@clayui/button';

import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';

import {DiagramBuilderContext} from '../../../../../DiagramBuilderContext';
import BaseActionsInfo from '../../shared-components/BaseActionsInfo';

const ActionTypeAction = ({
	actionData,
	actionSectionsIndex,
	actionType,
	executionTypeInput = () => {
		'';
	},
	setActionSections,
}) => {
	const {selectedItem} = useContext(DiagramBuilderContext);
	const validActionData =
		actionData.actionType === 'timerActions' ? actionData : null;
	const [template, setTemplate] = useState(validActionData?.template || '');
	const [description, setDescription] = useState(
		validActionData?.description || ''
	);
	const [executionTypeOptions, setExecutionTypeOptions] = useState([
		{
			label: Liferay.Language.get('on-entry'),
			value: 'onEntry',
		},
		{
			label: Liferay.Language.get('on-exit'),
			value: 'onExit',
		},
	]);
	const [executionType, setExecutionType] = useState(
		validActionData?.executionType ?? executionTypeOptions[0].value
	);
	const [name, setName] = useState(validActionData?.name || '');
	const [priority, setPriority] = useState(validActionData?.priority || 1);

	const updateActionInfo = (item) => {
		if (item.name && item.template && item.executionType) {
			setActionSections((previousSections) => {
				const updatedSections = [...previousSections];

				updatedSections[actionSectionsIndex] = {
					...previousSections[actionSectionsIndex],
					...item,
					actionType,
				};

				return updatedSections;
			});
		}
	};

	return (
		<BaseActionsInfo
			description={description}
			executionType={executionType}
			executionTypeInput={executionTypeInput}
			executionTypeOptions={executionTypeOptions}
			name={name}
			placeholderName={Liferay.Language.get('my-action')}
			placeholderTemplate="${userName} sent you a ${entryType} for review in the workflow."
			priority={priority}
			selectedItem={selectedItem}
			setDescription={setDescription}
			setExecutionType={setExecutionType}
			setExecutionTypeOptions={setExecutionTypeOptions}
			setName={setName}
			setPriority={setPriority}
			setTemplate={setTemplate}
			template={template}
			templateLabel={Liferay.Language.get('template')}
			templateLabelSecondary={Liferay.Language.get('groovy')}
			updateActionInfo={updateActionInfo}
		/>
	);
};

ActionTypeAction.propTypes = {
	actionSectionsIndex: PropTypes.number.isRequired,
	actionSubSectionsIndex: PropTypes.number.isRequired,
	timersIndex: PropTypes.number.isRequired,
	updateSelectedItem: PropTypes.func.isRequired,
};

export default ActionTypeAction;
