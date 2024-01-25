/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useMemo} from 'react';

import RadioCardList from '../../../../components/RadioCardList/RadioCardList';
import {
	ConsoleProjectsUsage,
	ConsoleUserProject,
} from '../../../../services/oauth/MarketplaceSpringBootOAuth2';

type ProjectSelectionProps = {
	onSelectProject: (project: ConsoleUserProject) => void;
	resourceRequest?: ConsoleProjectsUsage;
	selectedProject: string | undefined;
	userAccount?: UserAccount;
};

const ProjectSelection: React.FC<ProjectSelectionProps> = ({
	onSelectProject,
	resourceRequest,
	selectedProject,
	userAccount,
}) => {
	const userProjects = useMemo(() => resourceRequest?.userProjects ?? [], [
		resourceRequest?.userProjects,
	]);

	return (
		<>
			<div className="mb-4">
				{`Accounts available for `}

				<strong>{userAccount?.emailAddress}</strong>

				{` (you)`}
			</div>

			<RadioCardList
				contentList={
					(resourceRequest?.userProjects ?? []).map(
						(project, index) => ({
							selected:
								userProjects[index].rootProjectId ===
								selectedProject,
							title: (
								<>
									<h5 className="m-0">
										{project.rootProjectId.toUpperCase()}
									</h5>
									<p className="m-0">{`${project.environments.length} Enviroments, ${project.rootProjectPlanUsage.cpu.used} CPU, ${project.rootProjectPlanUsage.memory.used} GB Ram`}</p>
								</>
							),
							value: project.rootProjectId,
						})
					) as any
				}
				leftRadio
				onSelect={(radioOption: RadioOption<ConsoleUserProject>) =>
					onSelectProject(radioOption.value)
				}
				showImage={false}
			/>
		</>
	);
};

export default ProjectSelection;
