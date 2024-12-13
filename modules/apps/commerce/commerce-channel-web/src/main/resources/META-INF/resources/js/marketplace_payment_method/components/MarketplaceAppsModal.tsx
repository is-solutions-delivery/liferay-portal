/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {Observer} from '@clayui/modal/lib/types';
import React, {useEffect, useState} from 'react';

import {useMarketplaceAuthorization} from '../hooks/useMarketplaceAuthorization';
import useProducts from '../hooks/useProducts';
import {Product} from '../types';
import AppDetails from './AppDetails';
import InstallPaymentMethodModalBody from './InstallPaymentModalBody';

export const PAYMENT_VIEW = {
	details: 'DETAILS',
	list: 'LIST',
};

type MarketplaceAppsModalProps = {
	data: NonNullable<ReturnType<typeof useMarketplaceAuthorization>['data']>;
	observer: Observer;
	open: boolean;
};

const MarketplaceAppsModal: React.FC<MarketplaceAppsModalProps> = ({
	data,
	observer,
	open,
}) => {
	const [step, setStep] = useState<string>(PAYMENT_VIEW.list);
	const [selectedApp, setSelectedApp] = useState<Product>();

	const {loading, pagination, productsResponse, search, sort} =
		useProducts(data);

	const items = productsResponse?.items;

	useEffect(() => {
		if (!open) {
			setStep(PAYMENT_VIEW.list);
		}
	}, [open]);

	if (!open) {
		return null;
	}

	return (
		<ClayModal center observer={observer} size="full-screen">
			<ClayModal.Header>
				{Liferay.Language.get('add-from-marketplace')}
			</ClayModal.Header>

			<ClayModal.Body className="m-0 p-0">
				{step === PAYMENT_VIEW.list && (
					<InstallPaymentMethodModalBody
						loading={loading}
						pagination={pagination}
						products={items}
						searchQuery={search.searchQuery}
						setSearchQuery={search.setSearchQuery}
						setSelectedApp={setSelectedApp}
						setStep={setStep}
						sort={sort}
					/>
				)}

				{step === PAYMENT_VIEW.details && selectedApp && (
					<AppDetails
						backToList={setStep}
						data={data}
						product={selectedApp}
					/>
				)}
			</ClayModal.Body>
		</ClayModal>
	);
};

export default MarketplaceAppsModal;
