/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';
import {useEffect, useState} from 'react';

type Authorization = {
	data: null | {
		accessToken: string;
		marketplaceSettings: {
			accountId: number;
			categoryReferences: {
				PAYMENT_METHOD: number;
			};
			channelId: number;
			siteId: number;
		};
		url: string;
	};
	hasAuthorization: boolean;
	loading: boolean;
};

export function useMarketplaceAuthorization() {
	const [authorization, setAuthorization] = useState<Authorization>({
		data: null,
		hasAuthorization: false,
		loading: true,
	});

	useEffect(() => {
		const getAuthorization = async () => {
			const response = await fetch(
				'/o/marketplace-rest/v1.0/authorization'
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

		getAuthorization();
	}, []);

	return authorization;
}
