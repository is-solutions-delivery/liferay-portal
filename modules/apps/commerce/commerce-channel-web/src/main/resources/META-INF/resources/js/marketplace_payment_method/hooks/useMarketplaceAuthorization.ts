/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {createResourceURL, fetch} from 'frontend-js-web';
import {useEffect, useState} from 'react';

type Authorization = {
	data: null | {
		accessToken: string;
		settings: {
			accountId: number;
			categoryReferences: {
				PAYMENT_METHOD: string;
			};
			channelId: number;
			siteId: number;
		};
		url: string;
	};
	hasAuthorization: boolean;
	loading: boolean;
};

export function useMarketplaceAuthorization(baseResourceURL: string) {
	const [authorization, setAuthorization] = useState<Authorization>({
		data: {
			accessToken: 'AA',
			settings: {
				accountId: 34415342,
				categoryReferences: {
					PAYMENT_METHOD: 'Experience Management',
				},
				channelId: 20515281,
				siteId: 20506817,
			},
			url: 'https://marketplace-uat.liferay.com',
		},
		hasAuthorization: true,
		loading: false,
	});

	useEffect(() => {
		const getAuthorization = async () => {
			const response = await fetch(
				createResourceURL(baseResourceURL, {
					p_p_resource_id: '/marketplace_settings/get_authorization',
				}).toString()
			);

			if (response.ok) {
				return setAuthorization({
					data: await response.json(),
					hasAuthorization: true,
					loading: false,
				});
			}

			setAuthorization((prevAuthorization) => ({
				...prevAuthorization,
				loading: false,
			}));
		};

		// getAuthorization();/

	}, [baseResourceURL]);

	return authorization;
}
