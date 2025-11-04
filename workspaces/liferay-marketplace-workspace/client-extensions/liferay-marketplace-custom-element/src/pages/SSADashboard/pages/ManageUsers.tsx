/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Button from '@clayui/button';

import {formatDate} from '../../../utils/date';
import {ssaRoles} from '../constants';
import {useMarketplaceContext} from '../../../context/MarketplaceContext';
import i18n from '../../../i18n';
import InviteUserModal from '../modals/InviteUserModal';
import ListView from '../../../components/ListView';
import Page from '../../../components/Page';
import useModalContext from '../../../hooks/useModalContext';
import useManageUserActions from '../hooks/useManageUserActions';
import HeaderWithTooltip from '../components/HeaderWithTooltip';

export default function ManageUsers() {
	const {properties} = useMarketplaceContext();
	const modalContext = useModalContext();

	const actions = useManageUserActions();

	return (
		<Page
			description="Manage SSA users"
			pageRendererProps={{className: 'border py-2 rounded'}}
			rightButton={
				<Button
					onClick={() => {
						modalContext.onOpenModal({
							body: (
								<InviteUserModal
									onClose={modalContext.onClose}
								/>
							),
							header: (
								<HeaderWithTooltip
									title="Inivte User"
									tooltip="Invite a new SSA user or admin by providing their email address as their account ID and assigning a role."
								/>
							),
							footer: [
								<Button
									onClick={modalContext.onClose}
									displayType="secondary"
								>
									{i18n.translate('close')}
								</Button>,
								null,
								<Button type="submit" form="invite-form">
									{i18n.translate('invite')}
								</Button>,
							],
						});
					}}
				>
					{i18n.translate('invite-new-user')}
				</Button>
			}
			title="Manage Users"
		>
			<ListView<UserAccount>
				id="manage-ssa-users"
				managementToolbarProps={{
					visible: true,
					searchVisible: true,
				}}
				resource={`o/headless-admin-user/v1.0/accounts/by-external-reference-code/${properties.accountExternalReferenceCode}/user-accounts?sort=name:asc`}
				tableProps={{
					actions,
					columns: [
						{
							id: 'name',
							name: 'Name',
							sortable: true,
						},
						{
							id: 'emailAddress',
							name: 'Email Address',
						},
						{
							id: 'accountBriefs',
							name: 'Roles',
							render: (accountBriefs) => {
								const ssaAccount = accountBriefs.find(
									(accountBrief) =>
										accountBrief.externalReferenceCode ===
										properties.accountExternalReferenceCode
								);

								const filteredRoles =
									ssaAccount?.roleBriefs.filter((item2) =>
										ssaRoles.some(
											(item1) =>
												item1.value === item2.name
										)
									);

								return (
									<div className="d-flex flex-column">
										{filteredRoles?.map((role, index) => {
											return (
												<p
													className="mx-0 my-0"
													key={index}
												>
													{role.name}
												</p>
											);
										})}
									</div>
								);
							},
						},
						{
							id: 'lastLoginDate',
							name: 'Last Login',
							render: (lastLoginDate) =>
								formatDate(lastLoginDate),
						},
					],
				}}
			/>
		</Page>
	);
}
