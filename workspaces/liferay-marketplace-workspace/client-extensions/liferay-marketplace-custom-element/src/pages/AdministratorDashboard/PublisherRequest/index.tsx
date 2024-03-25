/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLoadingIndicator from '@clayui/loading-indicator';
import useSWR from 'swr';

import {DashboardPage} from '../../../components/DashBoardPage/DashboardPage';
import i18n from '../../../i18n';
import fetcher from '../../../services/fetcher';
import PublisherRequestTable from './PublisherRequestTable';

const PublisherRequest = () => {
	const {data: publisherRequests, mutate} = useSWR<
		APIResponse<PublisherRequestInfo>
	>('requestpublisheraccounts', async () => {
		const requestPublisherResponse = await fetcher(
			'o/c/requestpublisheraccounts'
		);

		return requestPublisherResponse;
	});

	if (!publisherRequests) {
		return (
			<ClayLoadingIndicator
				displayType="primary"
				shape="squares"
				size="lg"
			/>
		);
	}

	return (
		<DashboardPage
			messages={{
				description: i18n.translate(
					'users-requests-to-become-a-publisher'
				),
				title: i18n.translate('publisher-requests'),
			}}
		>
			<PublisherRequestTable
				items={publisherRequests?.items}
				mutate={mutate}
			/>
		</DashboardPage>
	);
};

export default PublisherRequest;
