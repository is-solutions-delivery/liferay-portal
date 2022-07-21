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
import {getDXPCloudEnvironment} from '../../../../../../../../common/services/liferay/graphql/queries';

export default function useGetDxpCloudEnvimentProjectId(koroneikiAccount) {
	const [dxpCloudProjectId, setDxpCloudProjectId] = useState('');

	const activatedLinkDXPC = `https://console.liferay.cloud/projects/${dxpCloudProjectId}/overview`;

	const {client} = useAppPropertiesContext();

	useEffect(() => {
		const getDxpCloudEnvimentProjectId = async () => {
			const {data} = await client.query({
				query: getDXPCloudEnvironment,
				variables: {
					filter: `accountKey eq '${koroneikiAccount.accountKey}'`,
					scopeKey: Liferay.ThemeDisplay.getScopeGroupId(),
				},
			});

			if (data) {
				const dxpProjectId =
					data.c?.dXPCloudEnvironments?.items[0]?.projectId;
				setDxpCloudProjectId(dxpProjectId);
			}
		};
		getDxpCloudEnvimentProjectId();
	}, [client, koroneikiAccount.accountKey]);

	return activatedLinkDXPC;
}
