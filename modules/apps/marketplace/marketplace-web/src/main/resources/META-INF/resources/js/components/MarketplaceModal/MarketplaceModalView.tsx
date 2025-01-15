/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal from '@clayui/modal';
import {Observer} from '@clayui/modal/lib/types';
import React, {useEffect, useState} from 'react';

import {MarketplaceModalAppsView} from './MarketplaceModalAppsView';

export enum Step {
	INSTALLATION,
	STOREFRONT,
	PRODUCT_LIST_VIEW,
}

type MarketplaceModalViewProps = {
	observer: Observer;
	open: boolean;
};

function MarketplaceModalView({observer, open}: MarketplaceModalViewProps) {
	const [step, setStep] = useState(Step.PRODUCT_LIST_VIEW);

	useEffect(() => {
		if (!open) {
			setStep(Step.PRODUCT_LIST_VIEW);
		}
	}, [open]);

	if (!open) {
		return null;
	}

	return (
		<ClayModal
			center
			className="marketplace-modal"
			observer={observer}
			size={step === Step.INSTALLATION ? 'lg' : 'full-screen'}
		>
			<ClayModal.Header>
				{Liferay.Language.get('add-from-marketplace')}
			</ClayModal.Header>

			<ClayModal.Body className="m-0 p-0">
				<MarketplaceModalAppsView setStep={setStep} step={step} />
			</ClayModal.Body>
		</ClayModal>
	);
}

export default MarketplaceModalView;
