/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import yupSchema from '../../schema/yup';
import Rest from './Rest';
import {testrayTaskUsersImpl} from './TestrayTaskUsers';
import {APIResponse, TestrayTask} from './types';

const nestedFieldsParam =
	'nestedFields=build.project,build.routine&nestedFieldsDepth=2';

const tasksResource = `/tasks?${nestedFieldsParam}`;

const getTaskQuery = (taskId: number | string | undefined) =>
	`/tasks/${taskId}?${nestedFieldsParam}`;

const getTaskTransformData = (testrayTask: TestrayTask): TestrayTask => ({
	...testrayTask,
	build: testrayTask.r_buildToTasks_c_build
		? {
				...testrayTask.r_buildToTasks_c_build,
				productVersion:
					testrayTask.r_buildToTasks_c_build
						.r_productVersionToBuilds_c_productVersion,
				project:
					testrayTask.r_buildToTasks_c_build
						.r_projectToBuilds_c_project,
				routine:
					testrayTask.r_buildToTasks_c_build
						.r_routineToBuilds_c_routine,
		  }
		: undefined,
	userToTask: testrayTask?.userToTask,
});

const getTasksTransformData = (response: APIResponse<TestrayTask>) => ({
	...response,
	items: response?.items?.map(getTaskTransformData),
});

export {
	tasksResource,
	getTaskQuery,
	getTaskTransformData,
	getTasksTransformData,
};

type Task = typeof yupSchema.task.__outputType & {projectId: number};

class TestrayTaskRest extends Rest<Task, TestrayTask> {
	constructor() {
		super({
			adapter: ({
				build: r_buildToTasks_c_buildId,
				caseTypes: taskToTasksCaseTypes,
				dueStatus,
				name,
				userToTasks,
			}) => ({
				dueStatus,
				name,
				r_buildToTasks_c_buildId,
				taskToTasksCaseTypes,
				userToTasks,
			}),
			nestedFields: '',
			transformData: (TestrayTaskId) => ({
				...TestrayTaskId,
				buildTaskId: TestrayTaskId?.r_buildToTasks_c_build,
			}),
			uri: 'tasks',
		});
	}

	public async create(data: Task): Promise<any> {
		const task = await super.create(data);

		if (data.userToTasks?.length) {
			for (const userIds of data.userToTasks) {
				await testrayTaskUsersImpl.create({
					name: JSON.stringify(task.id),
					projectId: 0,
					taskId: task.id,
					userId: userIds,
				});
			}
		}
	}

	public async createBatch(data: Task[]): Promise<void> {
		if (data.length >= 20) {
			return this.fetcher.post(
				`/${this.uri}/batch`,
				data.map((item) => this.adapter(item))
			);
		}

		await Promise.allSettled(data.map((item) => this.create(item)));
	}
}
export const testRayTaskRest = new TestrayTaskRest();
