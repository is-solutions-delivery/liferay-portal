/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {MarketplaceModal} from '@liferay/marketplace-web';
import React from 'react';

import './style/index.scss';

const CommerceChannelAddPaymentMethod = () => (
	<MarketplaceModal
		properties={{settings: {productFilter: 'payments'}}}
		trigger={
			<div className="d-flex justify-content-end px-2 py-2">
				<ClayButton size="sm">
					<ClayIcon className="mr-2" symbol="marketplace" />

					{Liferay.Language.get('add')}
				</ClayButton>
			</div>
		}
	/>
);

export default CommerceChannelAddPaymentMethod;
