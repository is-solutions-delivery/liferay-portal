/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useForm} from 'react-hook-form';

import {Input} from '../../../components/Input/Input';
import zodSchema, {z, zodResolver} from '../../../schema/zod';
import MultiSelect from '../../../components/MultiSelect/MultiSelect';
import {ssaRoles} from '../constants';
import {useState} from 'react';
import i18n from '../../../i18n';
import {getFilteredItems} from '../utils';
import {Label} from '../../../components/MarketplaceForm/Label';
import HeadlessAdminUser from '../../../services/rest/HeadlessAdminUser';
import {useMarketplaceContext} from '../../../context/MarketplaceContext';
import {Liferay} from '../../../liferay/liferay';
import marketplaceOAuth2 from '../../../services/oauth/Marketplace';

export type Item = {
	key: string;
	value: string;
	label: string;
};

type ModalForm = {
	emailAddress: string;
	roles: Item[];
};

const InviteUserModal = ({onClose}: {onClose: () => void}) => {
	const {properties} = useMarketplaceContext();
	const {formState, setValue, register, handleSubmit} = useForm<ModalForm>({
		resolver: zodResolver(zodSchema.ssaInviteUsers),
	});

	const [selectedItems, setSelectedItems] = useState<Item[]>([]);

	const onSubmit = async (formData: ModalForm) => {
		try {
			const user = await HeadlessAdminUser.getUserEmailAddress(
				formData.emailAddress
			);

			const ssaAccount = user.accountBriefs.find(
				(accountBrief) =>
					accountBrief.externalReferenceCode ===
					properties.accountExternalReferenceCode
			);

			if (ssaAccount) {
				Liferay.Util.openToast({
					message: 'This user already exists in this account',
					title: 'User Already Exists',
					type: 'danger',
				});

				return;
			}
		}
		catch {
			Liferay.Util.openToast({
				message: 'No user exists with that email.',
				title: 'User Not Found',
				type: 'danger',
			});

			return;
		}

		onClose();

		const [accountRoles, user, userRoles] = await Promise.all([
			HeadlessAdminUser.getAccountRoles(
				properties.accountExternalReferenceCode
			),
			HeadlessAdminUser.postAccountUserAccountByEmailAddress(
				properties.accountExternalReferenceCode,
				formData.emailAddress
			),
			HeadlessAdminUser.getRolesPage(
				new URLSearchParams({pageSize: '-1'})
			),
		]);

		const ssaUser = userRoles.items.find(
			(userRole) => userRole.name === 'SSA User'
		);

		const roles = formData.roles.map((role) =>
			accountRoles.items.find(
				(accountRole) => accountRole.name === role.value
			)
		);

		try {
			await Promise.all([
				HeadlessAdminUser.sendRoleAccountUserAccount(
					`${ssaUser?.id}`,
					user.id
				),
				roles.map((role) =>
					HeadlessAdminUser.sendRoleAccountUser(
						Number(Liferay.CommerceContext.account?.accountId),
						role?.id as number,
						user.id
					)
				),
				marketplaceOAuth2.postAssignRoleUserAccount(
					ssaUser?.id as number,
					user.id
				),
			]);
		}
		catch {
			Liferay.Util.openToast({
				message: 'Error',
				title: 'Unable to assign roles',
				type: 'danger',
			});

			return;
		}

		Liferay.Util.openToast({
			message: 'Your request was completed successfully.',
			title: 'Success',
			type: 'success',
		});

		return;
	};

	return (
		<form id="invite-form" onSubmit={handleSubmit(onSubmit)}>
			<p>
				{i18n.translate(
					'use-their-email-address-to-invite-them-as-an-ssa-user-or-admin-and-define-their-access-level'
				)}
			</p>

			<Label>{i18n.translate('email')}</Label>

			<Input
				{...register('emailAddress')}
				required
				placeholder="Email"
				errorMessage={formState.errors.emailAddress?.message}
			/>
			<Label>{i18n.translate('roles')}</Label>

			<MultiSelect
				disabledClearAll
				errorMessage={formState.errors.roles?.message}
				inputName="roles"
				multiselectKey={`area-${
					getFilteredItems(selectedItems, ssaRoles).length
				}`}
				onItemsChange={(roles: Item[]) => {
					const filteredRoles = roles.filter((role) =>
						ssaRoles.some((ssaRole) => ssaRole.key === role.key)
					);

					setSelectedItems(filteredRoles);
					setValue('roles', roles);
				}}
				required
				selectedItems={selectedItems}
				sourceItems={getFilteredItems(selectedItems, ssaRoles)}
			/>
		</form>
	);
};

export default InviteUserModal;
