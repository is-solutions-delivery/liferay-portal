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

import fetcher from '../fetcher';
import {Liferay} from '../liferay';
import {TestrayRequirement} from './types';

class JiraClientExtensionRest {
	public fetcher = fetcher;
	public headers = {'liferay-user-id': Liferay.ThemeDisplay.getUserId()};

	public async resyncWith(requirements: TestrayRequirement): Promise<any> {
		return requirements;
	}

	public async issueUpdate(issues: string[]): Promise<void> {
		fetcher('/jira/ticket', {
			body: JSON.stringify({tickets: issues}),
			headers: this.headers,
			method: 'PUT',
		});
	}
}

export const JiraClientExtensionRestImpl = new JiraClientExtensionRest();
