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
import {useEffect, useState} from 'react';
import {useAppPropertiesContext} from '../../../../../../../../common/contexts/AppPropertiesContext';
import {getAnalyticsCloudWorkspace} from '../../../../../../../../common/services/liferay/graphql/queries';

export default function useGetAnalyticsCloudWorkspace(koroneikiAccount) {
	const [analyctsCloudGroupId, setAnalyctsCloudGroupId] = useState('');

	const {client} = useAppPropertiesContext();

	const activatedLinkAC = `https://analytics.liferay.com/workspace/${analyctsCloudGroupId}/sites`;
	useEffect(() => {
		const getAnalyticsCloudWorkspaces = async () => {
			const {data} = await client.query({
				query: getAnalyticsCloudWorkspace,
				variables: {
					filter: `accountKey eq '${koroneikiAccount.accountKey}'`,
					scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
				},
			});

			if (data) {
				const analyticsCloudWorkspacesGroupID =
					data?.c?.analyticsCloudWorkspaces?.items[0]
						?.workspaceGroupId;
				setAnalyctsCloudGroupId(analyticsCloudWorkspacesGroupID);
			}
		};
		getAnalyticsCloudWorkspaces();
	}, [client, koroneikiAccount.accountKey]);

	return activatedLinkAC;
}
