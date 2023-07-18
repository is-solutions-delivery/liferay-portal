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

import i18n from '../../../../../common/I18n';
import {useGetLiferayExperienceCloudEnvironments} from '../../../../../common/services/liferay/graphql/liferay-experience-cloud-environments/';
import OptionsColumn from './components/TeamMembersTable/components/columns/OptionsColumn/OptionsColumn';

const TeamMemberFooter = ({
	accountSubscriptionGroupsNames,
	koroneikiAccount,
}) => {
	const {data} = useGetLiferayExperienceCloudEnvironments({
		filter: `accountKey eq '${koroneikiAccount?.accountKey}'`,
	});

	const teste = {
		produtos: [
			{
				categoria_id: 1,
				contacto: 5555555555,
				descricao: 'Aline Pereira',
				nome: 'alinepereira@gmail.com',
			},

			{
				categoria_id: 1,
				contacto: 5555555555,
				descricao: 'Francisco da Silva',
				nome: 'franciscosilva@liferay.com',
			},
			{
				categoria_id: 1,
				contacto: 5555555555,
				descricao: 'Paulo Albuquerque',
				nome: 'paulo.albuquerque@liferay.com',
			},
		],
	};

	const adminInfo = teste.produtos.map(({contacto, descricao, nome}) => {
		const projectAdminEmailBody = (
			<div>
				<div className="customer-portal-card-lexicon d-flex">
					<h4>{descricao}</h4>

					<OptionsColumn />
				</div>

				<h5>{nome}</h5>

				<h5>{contacto}</h5>

				<br></br>
			</div>
		);

		return projectAdminEmailBody;
	});

	return (
		<div
			className={`customer-portal-card-footer ${
				accountSubscriptionGroupsNames?.includes(
					'Liferay Experience Cloud'
				)
					? 'customer-portal-card-footer-style-lxc'
					: 'customer-portal-card-footer-style-ac'
			}`}
		>
			<div className="customer-portal-card-footer-title">
				<h1>{i18n.translate('incident-contacts')}</h1>
			</div>

			<div className="customer-portal-card-footer-description">
				<p>
					{i18n.translate(
						'team-members-who-can-be-contacted-with-high-priority-messages'
					)}
				</p>
			</div>

			<div className="customer-portal-card-title">
				<div className="customer-portal-card-description">
					<h3>{i18n.translate('critical-incident-contacts')}</h3>

					<div className="customer-portal-card-description-scroll">
						{adminInfo}
					</div>
				</div>

				{accountSubscriptionGroupsNames?.includes(
					'Liferay Experience Cloud'
				) && (
					<>
						<div className="customer-portal-card-description">
							<h3>{i18n.translate('security-breach')}</h3>

							<h4>Name</h4>

							<h5>Email</h5>

							<h5>Contact</h5>
						</div>

						<div className="customer-portal-card-description">
							<h3>{i18n.translate('privacy-breach')}</h3>

							{data?.c?.liferayExperienceCloudEnvironments?.items?.map(
								(item, index) => (
									<div key={index}>
										<h4>
											{item.incidentManagementFullName}
										</h4>

										<h5>
											{
												item.incidentManagementEmailAddress
											}
										</h5>
									</div>
								)
							)}

							<h5>Contact</h5>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default TeamMemberFooter;
