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

import {ClayInput} from '@clayui/form';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

import SelectTimeScale from './TimerScale';

const TimerFields = ({
	index,
	recurrence,
	scaleHelpText,
	selectedItem,
	updateSelectedItem,
}) => {
	const [timerScale, setTimerScale] = useState(
		selectedItem?.data.taskTimers?.delay[index].scale[recurrence ? 1 : 0] ||
			'second'
	);
	const [timerValue, setTimerValue] = useState(
		selectedItem?.data.taskTimers?.delay[index].duration[
			recurrence ? 1 : 0
		] || ''
	);

	const handleBlur = () => {
		updateSelectedItem(
			{
				delay: {
					duration: timerValue,
					scale: timerScale,
				},
			},
			{
				delay: recurrence ? 1 : 0,
			}
		);
	};

	return (
		<div className="form-group-autofit timer-inputs">
			<div className="form-group-item">
				<label htmlFor="timerScale">
					{Liferay.Language.get('scale')}
				</label>

				<SelectTimeScale
					recurrence={recurrence}
					setTimerScale={setTimerScale}
					setTimerValue={setTimerValue}
					timerScale={timerScale}
					updateSelectedItem={updateSelectedItem}
				/>

				{scaleHelpText && <div className="help-text">{scaleHelpText}</div>}
			</div>

			<div className="form-group-item">
				<label htmlFor="timerValue">
					{Liferay.Language.get('duration')}
				</label>

				<ClayInput
					min="0"
					onBlur={handleBlur}
					onChange={({target}) => setTimerValue(target.value)}
					step="1"
					type="number"
					value={timerValue}
				/>
			</div>
		</div>
	);
};

TimerFields.propTypes = {
	index: PropTypes.number,
	recurrence: PropTypes.bool,
	scaleHelpText: PropTypes.string,
	selectedItem: PropTypes.object,
	updateSelectedItem: PropTypes.func,
};

export default TimerFields;
