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
		label: Liferay.Language.get('second'),
		scale: 'second',
	},
	{
		label: Liferay.Language.get('minute'),
		scale: 'minute',
	},
	{
		label: Liferay.Language.get('hour'),
		scale: 'hour',
	},
	{
		label: Liferay.Language.get('day'),
		scale: 'day',
	},
	{
		label: Liferay.Language.get('week'),
		scale: 'week',
	},
	{
		label: Liferay.Language.get('month'),
		scale: 'month',
	},
	{
		label: Liferay.Language.get('year'),
		scale: 'year',
	},
];

const SelectTimeScale = ({setTimerScale, timerScale}) => {
	const handleChange = (target) => {
		setTimerScale(target.value);
	};

	return (
		<ClayForm.Group className="mb-0">
			<ClaySelect
				aria-label="Select"
				defaultValue={timerScale}
				id="scale"
				onChange={({target}) => {
					handleChange(target);
				}}
			>
				{options.map((item) => (
					<ClaySelect.Option
						key={item.scale}
						label={item.label}
						value={item.scale}
					/>
				))}
			</ClaySelect>
		</ClayForm.Group>
	);
};

export default SelectTimeScale;
