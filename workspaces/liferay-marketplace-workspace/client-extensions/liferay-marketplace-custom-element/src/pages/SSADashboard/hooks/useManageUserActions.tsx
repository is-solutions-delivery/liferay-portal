/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useMemo} from 'react';

import {useMarketplaceContext} from '../../../context/MarketplaceContext';
import useModalContext from '../../../hooks/useModalContext';
import i18n from '../../../i18n';
import {Action} from '../../../utils/constants';
import ManageUserModal from '../modals/ManageUserRolesModal';
import Button from '@clayui/button';
import HeaderWithTooltip from '../components/HeaderWithTooltip';
import HeadlessAdminUser from '../../../services/rest/HeadlessAdminUser';
import {Liferay} from '../../../liferay/liferay';

async function removeUser(user: UserAccount) {}

const useManageUserActions = () => {
	const {properties} = useMarketplaceContext();
	const modalContext = useModalContext();

	return useMemo(
		() =>
			[
				{
					name: i18n.translate('manage-roles'),
					onClick: (user: UserAccount, mutate) => {
						modalContext.onOpenModal({
							body: (
								<ManageUserModal
									accountERC={
										properties.accountExternalReferenceCode
									}
									mutate={mutate}
									onClose={modalContext.onClose}
									user={user}
								/>
							),
							header: (
								<HeaderWithTooltip
									title="Manage User Roles"
									tooltip="Set the user’s role: SSA Users can create trials, while SSA Admins can manage users, roles, and trials."
								/>
							),
							footer: [
								<Button
									displayType="secondary"
									onClick={modalContext.onClose}
								>
									{i18n.translate('cancel')}
								</Button>,
								null,
								<Button type="submit" form="manage-roles">
									{i18n.translate('apply')}
								</Button>,
							],
						});
					},
				},
				{
					name: i18n.translate('remove-user'),
					onClick: (user: UserAccount, mutate) => {
						modalContext.onOpenModal({
							body: (
								<div>
									You are about to remove this user from SSA.
									They will lose access to their account and
									all associated features, but don’t worry —
									you can invite them again later if needed.
								</div>
							),
							header: 'Remove User',
							status: 'warning',
							footer: [
								<Button
									onClick={modalContext.onClose}
									displayType="secondary"
								>
									{i18n.translate('cancel')}
								</Button>,
								null,
								<Button
									displayType="warning"
									onClick={async () => {
										removeUser(user);

										const userRoles =
											await HeadlessAdminUser.getRolesPage(
												new URLSearchParams({
													pageSize: '-1',
												})
											);

										const ssaUser = userRoles.items.find(
											(userRole) =>
												userRole.name === 'SSA User'
										);

										try {
											await HeadlessAdminUser.deleteRoleAccountUserAccount(
												`${ssaUser?.id}`,
												user.id
											);

											await HeadlessAdminUser.deleteAccountUserAccountByEmailAddress(
												properties.accountExternalReferenceCode,
												user.emailAddress
											);
										}
										catch {
											Liferay.Util.openToast({
												message:
													'Unable to remove user from account',
												type: 'danger',
											});
										}

										mutate(() => ({}), {revalidate: true});

										modalContext.onClose();
									}}
								>
									{i18n.translate('confirm')}
								</Button>,
							],
						});
					},
				},
			] as Action[],
		[modalContext]
	);
};

export default useManageUserActions;
