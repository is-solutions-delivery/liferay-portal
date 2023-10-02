/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import {useCallback, useEffect, useState} from 'react';

import {CardButton} from '../../../../components/CardButton/CardButton';

import './index.scss';

import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { getAppProps } from '../../GetAppPage';
import { PaidTimeline } from './components/PaidTimeline';
import { TrialTimeline } from './components/TrialTimeline';

interface LicenseSelectorProps {
	cart: any;
	form: {
		getValues: UseFormGetValues<getAppProps>;
		setValue: UseFormSetValue<getAppProps>;
	};
	onSelectLicense: (sku?: SKU) => void;
	selectedProduct?: Product;
	setLicenseSelected: (licenseSelected: boolean) => void;
	sku: SKU
}

export function LicenseSelector({
	cart,
	form,
	onSelectLicense,
	selectedProduct,
	setLicenseSelected,
	sku,
}: LicenseSelectorProps) {
	const [selectedTimeline, setSelectedTimeline] = useState('');
	const [trialSKU, setTrialSKU] = useState<SKU>();

	const hasTrialSkuVerification = useCallback(() => {
			sku.skuOptions.forEach((option) => {
				if (option.key === 'trial' && option.value === 'yes') {
					setTrialSKU(sku);
				}
		});
	}, [sku]);

	useEffect(() => {
		hasTrialSkuVerification();
	}, [hasTrialSkuVerification]);

	const handleLicenseSelect = (licenseSelected: boolean) => {
		if (licenseSelected) {
			onSelectLicense(trialSKU);
			setLicenseSelected(true);
		}
	};

	return (
		<div className="license-selector-timeline">
			<div className="license-selector mb-6">
				<CardButton
					description="Try now. Pay Later"
					disabled={!trialSKU}
					icon={
						<span className="license-icon">
							<ClayIcon symbol="check-circle" />
						</span>
					}
					onClick={
						trialSKU ? () => setSelectedTimeline('trial') : () => {}
					}
					selected={selectedTimeline === 'trial'}
					title={
						selectedTimeline === 'trial' ? '30-day Trial' : 'Trial'
					}
				/>
				<CardButton
					description="Pay Today"
					disabled={false}
					icon={
						<span className="license-icon">
							<ClayIcon symbol="credit-card" />
						</span>
					}
					onClick={() => setSelectedTimeline('paid')}
					selected={selectedTimeline === 'paid'}
					title="Paid"
				/>
			</div>

			{selectedTimeline && (
				<div className="timeline-container">
					{selectedTimeline === 'trial' ? (
						<TrialTimeline setLicenseSelected={handleLicenseSelect}/>
					) : (
						<PaidTimeline cart={cart} form={form} product={selectedProduct} />

					)}
				</div>
			)}
		</div>
	);
}