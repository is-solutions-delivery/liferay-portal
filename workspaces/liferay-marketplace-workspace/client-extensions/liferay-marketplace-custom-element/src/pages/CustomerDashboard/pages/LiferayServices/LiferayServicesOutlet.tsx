/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { BaseOutlet } from '../Apps/App/AppOutlet';

import { NavbarProps } from '../../../../components/Navbar';
import useGetProductByOrderId from '../../../../hooks/useGetProductByOrderId';
import { orderTypeLabel, OrderTypes } from '../../../../enums/Order';
import i18n from '../../../../i18n';
import Button from '@clayui/button';
import { useMatch } from 'react-router-dom';

type ProductAndOrderPayload = NonNullable<
	ReturnType<typeof useGetProductByOrderId>['data']
>;

const getTabs = (data: ProductAndOrderPayload): NavbarProps['routes'] => {
	const orderType = data.placedOrder.orderType;

	const isDXP =
		orderType === orderTypeLabel[OrderTypes.DXP_APP] || orderType === orderTypeLabel[OrderTypes.DXP];

	return [
		{
			name: i18n.translate('details'),
			path: '',
			visible: !isDXP,
		},
		{
			name: 'Activation Keys',
			path: 'activation-key',
			visible: isDXP,
		},
		{
			name: 'Bundles',
			path: 'bundles',
			visible: isDXP,
		},
	];
};

const LiferayServicesOutlet = () => (
	<BaseOutlet
		actionButtons={
			<Button
				className="mt-6 new-license-button"
				onClick={() => { }}
				outline
			>
				{i18n.translate('new-activation-key')}
			</Button>
		}
		backTitle={i18n.translate('back-to-liferay-services')}
		backURL="../services"
		description='Manage your service by downloading software bundles, retrieving specific activation keys, and renewing your free plan directly when it nears expiration at no additional cost.'
		routes={getTabs}
		showActions={false}
	/>
);

export default LiferayServicesOutlet;