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

import i18n from '../../../../../../../common/I18n';
import ManageProductButton from './components/ManageProductButton';
import useGetAnalyticsCloudWorkspace from './hooks/useGetAnalyticsCloudWorkspaces';
import useGetDxpCloudEnvimentProjectId from './hooks/useGetDxpCloudEnvimentProjectId';
import getActiveStatusAC from './utils/getActiveStatusAC';
import getActivateStatusDXPC from './utils/getActiveStatusDXPC';

const ManageProductUser = ({koroneikiAccount, subscriptionGroups}) => {
	const {activatedLinkAC} = useGetAnalyticsCloudWorkspace(koroneikiAccount);

	const activatedLinkDXPC = useGetDxpCloudEnvimentProjectId(koroneikiAccount);

	const isActiveStatusDXPC = getActivateStatusDXPC(subscriptionGroups);

	const isActiveStatusAC = getActiveStatusAC(subscriptionGroups);

	return (
		<>
			{(isActiveStatusDXPC || isActiveStatusAC) && (
				<div className="bg-brand-primary-lighten-6 border-0 card card-flat cp-manager-product-container mt-5">
					<div className="p-4">
						<p className="h4">
							{i18n.translate('manage-product-users')}
						</p>

						<p className="mt-2 text-neutral-7 text-paragraph-sm">
							{i18n.translate(
								'manage-roles-and-permissions-of-users-within-each-product'
							)}
						</p>

						<div className="d-flex">
							{isActiveStatusDXPC && (
								<ManageProductButton
									activatedLink={activatedLinkDXPC}
									activatedTitle={i18n.translate(
										'manage-dxp-cloud-users'
									)}
								/>
							)}

							{isActiveStatusAC && (
								<ManageProductButton
									activatedLink={activatedLinkAC}
									activatedTitle={i18n.translate(
										'manage-analytics-cloud-users'
									)}
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default ManageProductUser;
