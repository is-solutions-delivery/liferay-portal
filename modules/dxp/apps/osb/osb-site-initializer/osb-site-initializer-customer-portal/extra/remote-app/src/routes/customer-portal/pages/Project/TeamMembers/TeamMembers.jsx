/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import i18n from '../../../../../common/I18n';
import useCurrentKoroneikiAccount from '../../../../../common/hooks/useCurrentKoroneikiAccount';
import {getAccountSubscriptionGroups} from '../../../../../common/services/liferay/graphql/queries';
import TeamMemberFooter from '../../../components/IncidentContactCard/TeamMemberFooter';
import ManageProductUsers from './components/ManageProductUsers/ManageProductUsers';
import TeamMembersTable from './components/TeamMembersTable/TeamMembersTable';

const TeamMembers = () => {
	const {setHasQuickLinksPanel, setHasSideMenu} = useOutletContext();
	const {data, loading} = useCurrentKoroneikiAccount();
	const koroneikiAccount = data?.koroneikiAccountByExternalReferenceCode;

	const {data: dataSubscriptionGroups} = useQuery(
		getAccountSubscriptionGroups,
		{
			variables: {
				filter: `accountKey eq '${koroneikiAccount?.accountKey}' and hasActivation eq true`,
			},
		}
	);

	const accountSubscriptionGroups =
		dataSubscriptionGroups?.c.accountSubscriptionGroups?.items;

	const accountSubscriptionGroupsNames = accountSubscriptionGroups?.map(
		(group) => group.name
	);

	useEffect(() => {
		setHasQuickLinksPanel(false);
		setHasSideMenu(true);
	}, [setHasSideMenu, setHasQuickLinksPanel]);

	return (
		<>
			<h1>{i18n.translate('team-members')}</h1>

			<p className="text-neutral-7 text-paragraph-sm">
				{i18n.translate(
					'team-members-have-access-to-this-project-in-customer-portal'
				)}
			</p>

			<div className="mt-4">
				<TeamMembersTable
					koroneikiAccount={koroneikiAccount}
					loading={loading}
				/>

				<ManageProductUsers
					koroneikiAccount={koroneikiAccount}
					loading={loading}
				/>

				{(accountSubscriptionGroupsNames?.includes('Analytics Cloud') ||
					accountSubscriptionGroupsNames?.includes(
						'Liferay Experience Cloud'
					) ||
					accountSubscriptionGroupsNames?.includes('LXC - SM')) && (
					<TeamMemberFooter
						accountSubscriptionGroupsNames={
							accountSubscriptionGroupsNames
						}
						koroneikiAccount={koroneikiAccount}
						loading={loading}
					/>
				)}
			</div>
		</>
	);
};

export default TeamMembers;
