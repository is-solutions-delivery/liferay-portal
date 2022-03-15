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

import React, {useContext, useEffect, useState} from 'react';

import {DiagramBuilderContext} from '../../../../DiagramBuilderContext';
import Timer from './Timer';

const Timers = (props) => {
	const {selectedItem, setSelectedItem} = useContext(DiagramBuilderContext);
	const [timerSections, setTimerSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	const getActions = (actions) => {
		const data = Object.entries(actions);
		const sections = [];

		for (let index = 0; index < data[0][1].length; index++) {
			const section = {};
			section.actionType = 'actions';
			section.description = data.find(
				(entry) => entry[0] === 'description'
			)[1][index];
			section.executionType = data.find(
				(entry) => entry[0] === 'executionType'
			)[1][index];
			section.identifier = `${Date.now()}-${index}`;
			section.name = data.find((entry) => entry[0] === 'name')[1][index];
			section.priority = data.find((entry) => entry[0] === 'priority')[1][
				index
			];
			section.template = data.find((entry) => entry[0] === 'script')[1][
				index
			];
			sections.push(section);
		}

		return sections;
	};

	useEffect(() => {
		if (selectedItem.data.taskTimers?.delay) {
			const desserializedSections = [];
			for (
				let index = 0;
				index < selectedItem.data.taskTimers.delay.length;
				index++
			) {
				const section = {
					actions: getActions(
						selectedItem.data.taskTimers.timerActions[index]
					),
					description:
						selectedItem.data.taskTimers.description[index],
					duration:
						selectedItem.data.taskTimers.delay[index].duration[0],
					durationScale:
						selectedItem.data.taskTimers.delay[index].scale[0],
					identifier: `${Date.now()}-${index}`,
					name: selectedItem.data.taskTimers.name[index],
					reassignments:
						selectedItem.data.taskTimers.reassignments[index],
					timerNotifications:
						selectedItem.data.taskTimers.timerNotifications[index],
				};

				if (
					selectedItem.data.taskTimers.delay[index].duration
						.length === 2
				) {
					section.recurrence =
						selectedItem.data.taskTimers.delay[index].duration[1];
					section.recurrenceScale =
						selectedItem.data.taskTimers.delay[index].duration[1];
				}

				desserializedSections.push(section);
			}
			setTimerSections(desserializedSections);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const serializebleSections = timerSections.filter(
			(section) =>
				section.duration &&
				section.durationScale &&
				(section.actions ||
					section.reassignments ||
					section.notifications)
		);
		let taskTimers;

		if (serializebleSections.length !== 0) {
			taskTimers = {
				blocking: serializebleSections.map(
					({recurrence, recurrenceScale}) =>
						recurrence && recurrenceScale ? 'false' : 'true'
				),
				delay: serializebleSections.map(
					({
						duration,
						durationScale,
						recurrence,
						recurrenceScale,
					}) => {
						const delay = {
							duration: [duration],
							scale: [durationScale],
						};
						if (recurrence && recurrenceScale) {
							delay.duration.push(recurrence);
							delay.scale.push(recurrenceScale);
						}

						return delay;
					}
				),
				description: serializebleSections.map(
					({description}) => description
				),
				name: serializebleSections.map(({name}) => name),
				reassignments: serializebleSections.map(() => ({})),
				timerActions: serializebleSections.map(({actions}) => ({
					description: actions.map(({description}) => description),
					executionType: actions.map(
						({executionType}) => executionType
					),
					name: actions.map(({name}) => name),
					priority: actions.map(({priority}) => priority),
					script: actions.map(({template}) => template),
				})),
				timerNotifications: serializebleSections.map(() => ({})),
			};
		}
		if (taskTimers) {
			setSelectedItem((previousItem) => ({
				...previousItem,
				data: {...previousItem.data, taskTimers},
			}));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerSections]);

	return timerSections.map(({actions, identifier}, index) => (
		<Timer
			{...props}
			actions={actions}
			key={`section-${identifier}`}
			sectionsLength={timerSections?.length}
			setTimerSections={setTimerSections}
			timerIdentifier={identifier}
			timersIndex={index}
		/>
	));
};

export default Timers;
