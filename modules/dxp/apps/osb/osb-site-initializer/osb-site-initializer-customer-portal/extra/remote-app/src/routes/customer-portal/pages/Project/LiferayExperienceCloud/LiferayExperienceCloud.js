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

import {useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import {Liferay} from '../../../../../common/services/liferay';
import {useGetLiferayExperienceCloudEnvironments} from '../../../../../common/services/liferay/graphql/liferay-experience-cloud-environments/queries/useGetLiferayExperienceCloudEnvironments';
import ActivationStatus from '../../../components/ActivationStatus';

import {useCustomerPortal} from '../../../context';
import {PRODUCT_TYPES} from '../../../utils/constants';

const LiferayExperienceCloud = () => {
	const {setHasQuickLinksPanel, setHasSideMenu} = useOutletContext();
	const [{project, subscriptionGroups, userAccount}] = useCustomerPortal();

	useEffect(() => {
		setHasQuickLinksPanel(true);
		setHasSideMenu(true);
	}, [setHasSideMenu, setHasQuickLinksPanel]);

	const {data} = useGetLiferayExperienceCloudEnvironments(
		Liferay.ThemeDisplay.getScopeGroupId(),
		{
			filter: `accountKey eq '${project.accountKey}'`,
		}
	);

	const lxcEnvironment = data.c?.liferayExperienceCloudEnvironments?.items[0];

	const subscriptionGroupLXC = subscriptionGroups.find(
		(subscriptionGroup) =>
			subscriptionGroup.name === PRODUCT_TYPES.liferayExperienceCloud
	);

	return (
		<div className="mr-4">
			<ActivationStatus.ActivationStatusLXC
				lxcEnvironment={lxcEnvironment}
				project={project}
				subscriptionGroupLXC={subscriptionGroupLXC}
				userAccount={userAccount}
			/>
		</div>
	);
};

export default LiferayExperienceCloud;
