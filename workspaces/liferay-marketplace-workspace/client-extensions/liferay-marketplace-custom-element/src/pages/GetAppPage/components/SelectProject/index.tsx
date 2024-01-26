/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {useContext, useMemo} from 'react';

import './ProjectSelection.scss';
import RadioCardList from '../../../../components/RadioCardList/RadioCardList';
import {MarketplaceContext} from '../../../../context/MarketplaceContext';
import i18n from '../../../../i18n';
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
	const {properties} = useContext(MarketplaceContext);
	const userProjects = useMemo(() => resourceRequest?.userProjects ?? [], [
		resourceRequest?.userProjects,
	]);

	if (!resourceRequest) {
		return <ClayLoadingIndicator />;
	}

	return (
		<>
			<div className="mb-4 project-selection-page">
				{`Accounts available for `}

				<strong>{userAccount?.emailAddress}</strong>

				{` (you)`}
			</div>

			<RadioCardList
				contentList={
					(resourceRequest?.userProjects ?? []).map(
						(project, index) => ({
							fullTitle: true,
							selected:
								userProjects[index].rootProjectId ===
								selectedProject,
							title: (
								<div className="d-flex">
									<div className="">
										<h5 className="m-0 project-selection-page-title-text">
											{project.rootProjectId.toUpperCase()}
										</h5>

										<p className="m-0 project-selection-page-description-text">{`${project.environments.length} Enviroments, ${project.rootProjectPlanUsage.cpu.used} CPU, ${project.rootProjectPlanUsage.memory.used} GB Ram`}</p>
									</div>
									<div className="d-flex justify-content-end w-100">
										<ClayButton
											aria-label=""
											className="project-selection-page-info-button"
										>
											<ClayIcon
												className="project-selection-page-info-button-icon"
												symbol="question-circle"
											/>
										</ClayButton>
									</div>
								</div>
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

			<div>
				<p>
					{`${i18n.translate('not-seeing-a-specific-project')} `}
					<a
						className="project-selection-page-link"
						href={properties.contactSupportUrl}
					>
						{i18n.translate('contact-support')}
					</a>
				</p>
			</div>
		</>
	);
};

export default ProjectSelection;
