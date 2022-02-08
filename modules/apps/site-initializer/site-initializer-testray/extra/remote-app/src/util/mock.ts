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

export type Assignee = {
	name: string;
	url: string;
};

export type Assigned = {
	name?: string;
	url?: string;
};

export type Tasks = {
	blocked?: number;
	failed?: number;
	incomplete?: number;
	passed?: number;
	test_fix?: number;
};

export type Subtask = {
	assignee: any;
	erro: string;
	name: string;
	score: number;
	status: string;
	tests: number;
};

export type Progress = {
	incomplete: number;
	other: number;
	self: number;
};

type Routine = {
	assigned?: any;
	buildName?: any;
	progress?: number;
	projectName?: any;
	routineName?: any;
	score: Progress;
	startDate?: any;
	status?: any;
	task?: any;
};
export enum status {
	inAnalysis = 0,
	open = 1,
	complete = 2,
}

const generateItems = <T>(item: T, total = 20): T[] => {
	return [...new Array(total)].map(() => item);
};

const assigned = generateItems<Assigned>(
	{
		name: 'John Doe',
	},
	20
);

export const assignee = generateItems<Assignee>(
	{
		name: 'Matheus Guimarães',
		url: 'https://picsum.photos/200',
	},
	20
);
export const tasks = generateItems<Tasks>(
	{
		blocked: 12,
		failed: 31,
		incomplete: 33,
		passed: 87,
		test_fix: 55,
	},
	20
);

export const subtask = generateItems<Subtask>(
	{
		assignee,
		erro: "java.lang.Exception: No results for path: $['users'][0]['id']",
		name: 'ST-1',
		score: 10,
		status: 'in analisys',
		tests: 5,
	},
	20
);

export const progress = generateItems<Progress>(
	{
		incomplete: 10,
		other: 0,
		self: 101,
	},
	20
);

export const routines = generateItems<Routine>(
	{
		assigned,
		buildName:
			'CE Package Tester - 7.4.3.10-ga10 - 3099 - 2022-01-31[08:44:04]',
		progress: 20,
		projectName: 'Liferay Portal 7.4',
		routineName: 'CE Package Tester',
		score: progress[0],
		startDate: 'a day ago',
		status: 'IN ANALYZES',
		task: 'CE Package Tester - 7.4.3.10-ga10 - 3099 - 2022-01-31[08:44:04]',
	},
	20
);
