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

import {useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import i18n from '../../../../../common/I18n';
import useCurrentKoroneikiAccount from '../../../../../common/hooks/useCurrentKoroneikiAccount';
import {getAccountSubscriptionGroups} from '../../../../../common/services/liferay/graphql/queries';
import TeamMemberFooter from './TeamMemberFooter';
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
