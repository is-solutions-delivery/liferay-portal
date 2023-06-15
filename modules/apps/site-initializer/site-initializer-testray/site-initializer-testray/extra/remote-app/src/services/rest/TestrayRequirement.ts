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

import Rest from '~/core/Rest';

import yupSchema from '../../schema/yup';
import {JiraClientExtensionRestImpl} from './JiraClientExtension';
import {TestrayRequirement} from './types';

type Requirement = typeof yupSchema.requirement.__outputType & {
	components: string;
	projectId: number;
};

class TestrayRequirementsImpl extends Rest<Requirement, TestrayRequirement> {
	constructor() {
		super({
			adapter: ({
				componentId: r_componentToRequirements_c_componentId,
				components,
				description,
				descriptionType,
				key,
				linkTitle,
				linkURL,
				projectId: r_projectToRequirements_c_projectId,
				summary,
			}) => ({
				components,
				description,
				descriptionType,
				key,
				linkTitle,
				linkURL,
				r_componentToRequirements_c_componentId,
				r_projectToRequirements_c_projectId,
				summary,
			}),
			nestedFields:
				'component, team, componentToRequirements.teamToComponents',
			transformData: (testrayRequirement) => ({
				...testrayRequirement,
				component: testrayRequirement.r_componentToRequirements_c_component
					? {
							...testrayRequirement.r_componentToRequirements_c_component,
							team:
								testrayRequirement
									.r_componentToRequirements_c_component
									.r_teamToComponents_c_team,
					  }
					: undefined,
			}),
			uri: 'requirements',
		});
	}
	public async importJiraIssue(form: any) {
		const importedIssues = await JiraClientExtensionRestImpl.importIssues(
			form.issues.map((issue: any) => issue.label)
		);

		const errors = [];
		const createdIssues = [];

		for (const ticket in importedIssues) {
			if (importedIssues[ticket] !== null) {
				if (!form.id) {
					form.key = `R-${Math.ceil(Math.random() * 1000)}`;
				}

				const formData = {
					components: importedIssues[ticket]?.jiraComponents.join(
						', '
					),
					description: importedIssues[ticket]?.description,
					descriptionType: 'markdown',
					key: form?.key,
					linkTitle: importedIssues[ticket]?.key,
					linkURL: `${form?.jiraBaseURL}/${importedIssues[ticket]?.key}`,
					projectId: form?.projectId,
					summary: importedIssues[ticket]?.summary,
				};

				createdIssues.push(ticket);
				await this.create(formData as any);
			}

			if (importedIssues[ticket] === null) {
				errors.push(ticket);
			}
		}

		return {createdIssues, errors};
	}
}

const testrayRequirementsImpl = new TestrayRequirementsImpl();

export {testrayRequirementsImpl};
