/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useModal} from '@clayui/modal';
import React from 'react';

import ConnectionWithMarketplaceNeededModal from './components/ConnectionWithMarketplaceNeededModal';
import ManagementToolbar from './components/ManagementToolbar';
import MarketplaceAppsModal from './components/MarketplaceAppsModal';
import {useMarketplaceAuthorization} from './hooks/useMarketplaceAuthorization';

import './style/index.scss';

const CommerceChannelAddPaymentMethod = () => {
	const {observer, onOpenChange, open} = useModal();
	const {data, hasAuthorization, loading} = useMarketplaceAuthorization();

	const Modal = hasAuthorization
		? MarketplaceAppsModal
		: ConnectionWithMarketplaceNeededModal;

	if (loading) {
		return 'Loading...';
	}

	return (
		<div className="commerce-channer-management-tool-bar">
			<ManagementToolbar PlusButtonAction={() => onOpenChange(true)} />

			<Modal
				data={
					data as NonNullable<
						ReturnType<typeof useMarketplaceAuthorization>['data']
					>
				}
				observer={observer}
				open={open}
			/>
		</div>
	);
};

export default CommerceChannelAddPaymentMethod;
