/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLink from '@clayui/link';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import useSWR from 'swr';

import RadioCardList from '../../../components/RadioCardList/RadioCardList';
import {Liferay} from '../../../liferay/liferay';
import headlessCommerceAdminUser from '../../../services/rest/HeadlessCommerceAdminUser';
import LicenseTermsCheckbox from '../containers/LicenseTermsCheckbox';

const enabledAccountRoles = ['Account Administrator', 'Account Buyer'];

type AccountSelectionProps = {
	isFreeApp: boolean;
	onSelectAccount: (account: Account) => void;
	selectedAccount: Account | undefined;
	userAccount?: UserAccount;
};

const AccountSelection: React.FC<AccountSelectionProps> = ({
	isFreeApp,
	onSelectAccount,
	selectedAccount,
	userAccount,
}) => {
	const {data: accounts = [], isLoading} = useSWR(
		`/get-app/accounts/${Liferay.ThemeDisplay.getUserId()}`,
		async () => {
			const accountBriefs = userAccount?.accountBriefs ?? [];

			const accountsInfo = await Promise.all(
				accountBriefs.map((accountBrief) =>
					headlessCommerceAdminUser.getAccountInfo(accountBrief.id)
				)
			);

			return accountsInfo.map((accountInfo, index) => {
				const accountBrief = accountBriefs[index];
				let displayAccount = accountInfo.type === 'person';

				if (accountBrief.roleBriefs.length) {
					displayAccount = accountBriefs[
						index
					].roleBriefs.some((roleBrief) =>
						enabledAccountRoles.includes(roleBrief.name)
					);
				}

				return {
					displayAccount,
					id: accountBrief.id,
					imageURL: accountInfo.logoURL,
					selected:
						selectedAccount?.externalReferenceCode ===
						accountInfo.externalReferenceCode,
					title: accountInfo.name,
					value: accountInfo,
				};
			});
		},
		{revalidateIfStale: true}
	);

	const handleSelectAccount = (radioOption: RadioOption<Account>) => {
		if (radioOption.value.id !== selectedAccount?.id) {
			onSelectAccount(radioOption.value);
		}
	};

	const accountsFiltered = accounts.filter(
		({displayAccount}) => displayAccount
	);

	return (
		<div>
			<p className="mb-4 secondary-text">
				{`Accounts available for `}

				<strong>{userAccount?.emailAddress}</strong>

				{` (you)`}
			</p>

			{isLoading ? (
				<ClayLoadingIndicator />
			) : accountsFiltered.length ? (
				<RadioCardList
					contentList={accountsFiltered.map((account) => ({
						...account,
						selected: selectedAccount?.id === account?.id,
						title: <h5>{account.title}</h5>,
					}))}
					leftRadio
					onSelect={handleSelectAccount}
					showImage
				/>
			) : (
				<p className="font-weight-bold my-5">No accounts available</p>
			)}

			{isFreeApp ? (
				<LicenseTermsCheckbox />
			) : (
				<>
					<span className="mr-1 secondary-text">
						Not seeing a specific Account?
					</span>

					<ClayLink
						className="font-weight-bold"
						href="http://help.liferay.com/"
					>
						Contact Support
					</ClayLink>
				</>
			)}
		</div>
	);
};

export default AccountSelection;
