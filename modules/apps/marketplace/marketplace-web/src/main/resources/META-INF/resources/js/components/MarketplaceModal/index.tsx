/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {
	MarketplaceContextProvider,
	MarketplaceContextProviderProps,
} from '../../MarketplaceContext';
import {MarketplaceRest} from '../../core/MarketplaceRest';
import MarketplaceModalTrigger from './MarketplaceModalTrigger';

type MarketplaceModalProps = {
	properties?: Partial<MarketplaceContextProviderProps>;
	trigger: React.ReactElement;
};

export function MarketplaceModal({properties, trigger}: MarketplaceModalProps) {
	return (
		<MarketplaceContextProvider
			{...(properties as MarketplaceContextProviderProps)}
			baseResourceURL={MarketplaceRest.getBaseResourceURL()}
		>
			<MarketplaceModalTrigger trigger={trigger} />
		</MarketplaceContextProvider>
	);
}
