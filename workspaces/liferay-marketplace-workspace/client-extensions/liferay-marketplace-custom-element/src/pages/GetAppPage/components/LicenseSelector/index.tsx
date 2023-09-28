/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import {useCallback, useEffect, useState} from 'react';

import {CardButton} from '../../../../components/CardButton/CardButton';
import {TrialTimeline} from '../../components/TrialTimeline';
import {PaidTimeline} from '../PaidTimeline';

import './index.scss';

interface LicenseSelectorProps {
	onSelectLicense: (licenseSelected: boolean, sku?: SKU) => void;
	selectedProduct?: Product;
}

export function LicenseSelector({
	onSelectLicense,
	selectedProduct,
}: LicenseSelectorProps) {
	const [selectedTimeline, setSelectedTimeline] = useState('');
	const [trialSKU, setTrialSKU] = useState<SKU>();

	const hasTrialSkuVerification = useCallback(() => {
		selectedProduct?.skus?.forEach((sku) => {
			sku.skuOptions.forEach((options) => {
				if (options.key === 'trial' && options.value === 'yes') {
					setTrialSKU(sku);
				}
			});
		});
	}, [selectedProduct]);

	useEffect(() => {
		hasTrialSkuVerification();
	}, [hasTrialSkuVerification]);

	const handleLicenseSelect = (selectedLicense: boolean) => {
		if (selectedLicense) {
			onSelectLicense(true, trialSKU);
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
						<TrialTimeline onSelectLicense={handleLicenseSelect} />
					) : (
						<PaidTimeline />
					)}
				</div>
			)}
		</div>
	);
}
