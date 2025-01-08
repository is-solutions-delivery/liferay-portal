/* eslint-disable @liferay/portal/no-localhost-reference */

/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useModal} from '@clayui/modal';
import {
	ConnectionWithMarketplaceNeededModal,
	useMarketplaceAuthorization,
} from '@liferay/marketplace-web';
import React from 'react';

import ManagementToolbar from './components/ManagementToolbar';
import MarketplaceAppsModal from './components/MarketplaceAppsModal';

import './style/index.scss';

type CommerceChannelAddPaymentMethodProps = {
	baseResourceURL: string;
};

export default function CommerceChannelAddPaymentMethod(
	props: CommerceChannelAddPaymentMethodProps
) {
	const {observer, onOpenChange, open} = useModal();
	const {data, hasAuthorization, loading} = useMarketplaceAuthorization(
		props.baseResourceURL
	);

	const Modal = hasAuthorization
		? MarketplaceAppsModal
		: ConnectionWithMarketplaceNeededModal;

	if (loading) {
		return Liferay.Language.get('loading');
	}

	return (
		<div className="commerce-channel-management-toolbar">
			<ManagementToolbar plusButtonAction={() => onOpenChange(true)} />

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
}
