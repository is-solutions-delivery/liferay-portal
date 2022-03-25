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

const Timers = ({setErrors}) => {
	const {selectedItem, setSelectedItem} = useContext(DiagramBuilderContext);
	const [timerSections, setTimerSections] = useState([
		{identifier: `${Date.now()}-0`},
	]);

	useEffect(() => {
		const serializebleSections = timerSections.filter(
			(section) =>
				section.duration &&
				section.durationScale &&
				section.timerActions
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
				reassignments: serializebleSections.map(({timerActions}) => {
					const filteredTimerActions = timerActions.filter(
						({actionType}) => actionType === 'reassignments'
					);
					if (filteredTimerActions.length) {
						const reassignments = {};

						reassignments.assignmentType = filteredTimerActions.map(
							({assignmentType}) => assignmentType
						);

						if (
							reassignments.assignmentType[0] ===
							'resourceActions'
						) {
							reassignments.resourceAction = filteredTimerActions.map(
								({resourceAction}) => resourceAction
							);
						}
						else if (
							reassignments.assignmentType[0] === 'roleId'
						) {
							reassignments.roleId = filteredTimerActions.map(
								({roleId}) => roleId
							);
						}
						else if (
							reassignments.assignmentType[0] === 'user' &&
							Object.keys(filteredTimerActions[0]).includes(
								'users'
							)
						) {
							reassignments.emailAddress = filteredTimerActions[0].users.map(
								({emailAddress}) => emailAddress
							);
						}

						return reassignments;
					}

					return {};
				}),
				timerActions: serializebleSections.map(({timerActions}) => {
					const filteredTimerActions = timerActions.filter(
						({actionType}) => actionType === 'timerActions'
					);

					if (filteredTimerActions.length) {
						return {
							description: filteredTimerActions.map(
								({description}) => description
							),
							executionType: filteredTimerActions.map(
								({executionType}) => executionType
							),
							name: filteredTimerActions.map(({name}) => name),
							priority: filteredTimerActions.map(
								({priority}) => priority
							),
							script: filteredTimerActions.map(
								({template}) => template
							),
						};
					}

					return {};
				}),

				timerNotifications: serializebleSections.map(() => ({})),
			};
		}
		else {
			taskTimers = null;
		}

		setSelectedItem((previousItem) => ({
			...previousItem,
			data: {...previousItem.data, taskTimers},
		}));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timerSections]);

	const getAllTimerActions = (index) => {
		const allTimerActions = {
			reassignments: Object.entries(
				selectedItem.data.taskTimers.reassignments[index]
			),
			timerActions: Object.entries(
				selectedItem.data.taskTimers.timerActions[index]
			),
			timerNotifications: Object.entries(
				selectedItem.data.taskTimers.timerNotifications[index]
			),
		};
		const sections = [];

		if (allTimerActions.reassignments.length) {
			const data = allTimerActions.reassignments;
			for (let index = 0; index < data[0][1].length; index++) {
				const section = {};

				section.actionType = 'reassignments';
				section.identifier = `${Date.now()}-${index}`;
				section.assignmentType = data.find(
					(entry) => entry[0] === 'assignmentType'
				)[1][index];
				if (section.assignmentType === `resourceActions`) {
					section.resourceAction = data.find(
						(entry) => entry[0] === 'resourceAction'
					)[1];
				}
				else if (section.assignmentType === 'roleId') {
					section.roleId = data.find(
						(entry) => entry[0] === 'roleId'
					)[1];
				}
				else if (
					section.assignmentType === 'user' &&
					data.some((entry) => entry[0] === 'emailAddress')
				) {
					section.users = data
						.find((entry) => entry[0] === 'emailAddress')[1]
						.map((email, index) => ({
							emailAddress: email,
							identifier: `${Date.now()}-${index}`,
						}));
				}
				else {
					section.assignmentType = 'assetCreator';
				}

				sections.push(section);
			}
		}
		const reassignmentsLength = sections.length;

		if (allTimerActions.timerActions.length) {
			const data = allTimerActions.timerActions;
			for (let index = 0; index < data[0][1].length; index++) {
				const section = {};

				section.actionType = 'timerActions';
				section.description = data.find(
					(entry) => entry[0] === 'description'
				)[1][index];
				section.executionType = data.find(
					(entry) => entry[0] === 'executionType'
				)[1][index];
				section.identifier = `${Date.now()}-${
					index + reassignmentsLength
				}`;
				section.name = data.find((entry) => entry[0] === 'name')[1][
					index
				];
				section.priority = data.find(
					(entry) => entry[0] === 'priority'
				)[1][index];
				section.template = data.find(
					(entry) => entry[0] === 'script'
				)[1][index];
				sections.push(section);
			}
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
					description:
						selectedItem.data.taskTimers.description[index],
					duration:
						selectedItem.data.taskTimers.delay[index].duration[0],
					durationScale:
						selectedItem.data.taskTimers.delay[index].scale[0],
					identifier: `${Date.now()}-${index}`,
					name: selectedItem.data.taskTimers.name[index],
					timerActions: getAllTimerActions(index),
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

	return timerSections.map((timerData, index) => (
		<Timer
			description={timerData.description}
			duration={timerData.duration}
			durationScale={timerData.durationScale}
			key={`section-${timerData.identifier}`}
			name={timerData.name}
			recurrence={timerData.recurrence}
			recurrenceScale={timerData.recurrenceScale}
			sectionsLength={timerSections?.length}
			setErrors={setErrors}
			setTimerSections={setTimerSections}
			timerActions={timerData.timerActions}
			timerIdentifier={timerData.identifier}
			timersIndex={index}
		/>
	));
};

export default Timers;
