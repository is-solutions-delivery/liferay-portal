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

import {ClayToggle} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import SidebarPanel from '../../SidebarPanel';
import TimerFields from './TimerFields';

const TimerDuration = ({
	selectedItem,
	setTimerSections,
	timerIdentifier,
	timersIndex,
	updateSelectedItem,
}) => {
	const [recurrence, setRecurrence] = useState(
		selectedItem?.data.taskTimers?.delay[timersIndex]?.scale.length > 1
	);

	const handleToggle = () => {
		if (recurrence) {
			setRecurrence(false);
			setTimerSections((previousSections) => {
				const updatedSections = [...previousSections];

				delete updatedSections[timersIndex].recurrence;
				delete updatedSections[timersIndex].recurrenceScale;

				return updatedSections;
			});
		}
		else {
			setRecurrence(true);
		}
	};

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('duration')}>
			<TimerFields
				selectedItem={selectedItem}
				setTimerSections={setTimerSections}
				timerIdentifier={timerIdentifier}
				timersIndex={timersIndex}
				updateSelectedItem={updateSelectedItem}
			/>

			<div className="timers-duration-toggle">
				<ClayToggle
					label={Liferay.Language.get('recurrence')}
					onToggle={handleToggle}
					toggled={recurrence}
				/>

				<span
					className="ml-2"
					title={Liferay.Language.get(
						'repeat-the-action-at-a-given-duration-until-the-workflow-task-is-completed'
					)}
				>
					<ClayIcon
						className="text-muted"
						symbol="question-circle-full"
					/>
				</span>
			</div>

			{recurrence && (
				<TimerFields
					recurrence
					scaleHelpText={Liferay.Language.get('recurrence')}
					selectedItem={selectedItem}
					setTimerSections={setTimerSections}
					timerIdentifier={timerIdentifier}
					timersIndex={timersIndex}
					updateSelectedItem={updateSelectedItem}
				/>
			)}
		</SidebarPanel>
	);
};

TimerDuration.propTypes = {
	selectedItem: PropTypes.object.isRequired,
	setSelectedItem: PropTypes.func.isRequired,
	timersIndex: PropTypes.number.isRequired,
	updateSelectedItem: PropTypes.func.isRequired,
};

export default TimerDuration;
