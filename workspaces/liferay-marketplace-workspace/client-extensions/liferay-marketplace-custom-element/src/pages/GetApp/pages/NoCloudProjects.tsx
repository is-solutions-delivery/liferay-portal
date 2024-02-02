/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import i18n from '../../../i18n';

const NoCloudProjects = () => (
	<div className="d-flex flex-column">
		<h1 className="my-4 text-center">
			{i18n.translate('no-cloud-projects-available')}
		</h1>

		<div className="my-6 text-justify">
			<p>
				You are attempting to Purchase a Cloud APP that is currently
				only available for Liferay SaaS and Liferay PaaS customers. You
				currently appear to not have access to any Cloud Projects.
				Please login as a user that has access to a project or contact
				your project administrator to add you to a project.
			</p>
		</div>
	</div>
);

export default NoCloudProjects;
