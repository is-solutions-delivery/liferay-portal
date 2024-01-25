/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect, useState} from 'react';

import RadioCardList from '../../../../components/RadioCardList/RadioCardList';
import {
	ConsoleProjectsUsage,
	ConsoleUserProject,
} from '../../../../services/oauth/MarketplaceSpringBootOAuth2';

interface ProjectSelectionProps {
	onSelectProject: (project: ConsoleUserProject) => void;
	resourceRequest?: ConsoleProjectsUsage;
	selectedProject: string | undefined;
	userAccount?: UserAccount;
}

const ProjectSelection: React.FC<ProjectSelectionProps> = ({
	onSelectProject,
	resourceRequest,
	selectedProject,
	userAccount,
}) => {
	const [project, setProject] = useState<any>([]);

	const projectList = resourceRequest?.userProjects;

	useEffect(() => {
		setProject(
			projectList?.map((project, index) => ({
				selected: projectList[index].rootProjectId === selectedProject,
				title: (
					<>
						<h5 className="m-0">
							{project.rootProjectId.toUpperCase()}
						</h5>
						<p className="m-0">{`${project.environments.length} Enviroments, ${project.rootProjectPlanUsage.cpu.used} CPU, ${project.rootProjectPlanUsage.memory.used} GB Ram`}</p>
					</>
				),
				value: project.rootProjectId,
			}))
		);
	}, [projectList, selectedProject]);

	const handleSelectProject = (
		radioOption: RadioOption<ConsoleUserProject>
	) => {
		onSelectProject(radioOption.value);

		setProject((previousValue: ConsoleUserProject[]) => {
			return previousValue.map((project, index) => {
				return {
					...project,
					selected: index === radioOption.index,
				};
			});
		});
	};

	return (
		<div>
			<div className="mb-4">
				{`Accounts available for `}

				<strong>{userAccount?.emailAddress}</strong>

				{` (you)`}
			</div>

			<RadioCardList
				contentList={project}
				leftRadio
				onSelect={handleSelectProject}
				showImage={false}
			/>
		</div>
	);
};

export default ProjectSelection;
