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

import ClayButton from '@clayui/button';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import SidebarPanel from '../../SidebarPanel';
import CurrentTimers from './CurrentTimers';

const TimersSummary = ({setContentName}) => {
	const {selectedItem} = useContext(DiagramBuilderContext);

	return (
		<SidebarPanel panelTitle={Liferay.Language.get('timers')}>
			{!selectedItem?.data.taskTimers ? (
				<ClayButton
					className="mr-3"
					displayType="secondary"
					onClick={() => {
						setContentName('timers');
					}}
				>
					{Liferay.Language.get('new')}
				</ClayButton>
			) : (
				<CurrentTimers
					setContentName={setContentName}
					taskTimers={selectedItem.data.taskTimers}
				/>
			)}
		</SidebarPanel>
	);
};

TimersSummary.propTypes = {
	setContentName: PropTypes.func.isRequired,
};

export default TimersSummary;
