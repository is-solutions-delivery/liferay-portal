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

import ClayForm from '@clayui/form';
import i18n from '../../../../I18n';
import {Input} from '../../../../components';
import useBannedDomains from '../../../../hooks/useBannedDomains';
import {isValidEmail} from '../../../../utils/validations.form';

const ProjectsAdminContact = ({admin}) => {
	const bannedDomains = useBannedDomains(admin.email);

	return (
		<ClayForm>
			<Input
				groupStyle="pt-1"
				label={i18n.translate('Project Admin’s First and Last Name')}
				name="activations.projectsAdminContact.name"
				placeholder="User Name"
				required
				type="text"
			/>

			<Input
				groupStyle="pb-1"
				helper={i18n.translate(
					'Please enter an individual email ID. Group email IDs are not allowed.'
				)}
				label={i18n.translate('Project Admin’s Email Address')}
				name="activations.projectsAdminContact.email"
				placeholder="user@mycompany.com"
				required
				type="email"
				validations={[(value) => isValidEmail(value, bannedDomains)]}
			/>

			<Input
				groupStyle="pb-1"
				helper={i18n.translate(
					'Please, provide the username that appears in your profile e.g. https://github.com/bchandotcom. The initial template for your project will be shared with this user.'
				)}
				label={i18n.translate('Project Admin’s GitHub Username')}
				name="activations.projectsAdminContact.github"
				placeholder="Username"
				required
				type="text"
			/>
		</ClayForm>
	);
};

export default ProjectsAdminContact;
