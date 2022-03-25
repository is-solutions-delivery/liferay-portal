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

import EdgeInformation from './EdgeInformation';
import NodeInformation from './NodeInformation';
import Actions from './actions/Actions';
import ActionsSummary from './actions/ActionsSummary';
import Assignments from './assignments/Assignments';
import AssignmentsSummary from './assignments/AssignmentsSummary';
import SourceCode from './assignments/SourceCode';
import Notifications from './notifications/Notifications';
import NotificationsSummary from './notifications/NotificationsSummary';
import TimerSourceCode from './timers/TimerSourceCode';
import Timers from './timers/Timers';
import TimersSummary from './timers/TimersSummary';

const sectionComponents = {
	actions: Actions,
	actionsSummary: ActionsSummary,
	assignments: Assignments,
	assignmentsSummary: AssignmentsSummary,
	edgeInformation: EdgeInformation,
	nodeInformation: NodeInformation,
	notifications: Notifications,
	notificationsSummary: NotificationsSummary,
	sourceCode: SourceCode,
	timerSourceCode: TimerSourceCode,
	timers: Timers,
	timersSummary: TimersSummary,
};

export default sectionComponents;
