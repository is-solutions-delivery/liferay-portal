/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useCallback, useEffect, useState} from 'react';

import {CardButton} from '../../../../components/CardButton/CardButton';
import {GetClayIcon} from '../../../../components/GetClayIcon/GetClayIcon';
import {PaidTimeline} from '../PaidTimeline/index';
import {TrialTimeline} from '../TrialTimeline/index';

import './index.scss';

interface LicenseSelectorProps {
	onSelectLicense: (licenseSelected: boolean, sku: SKU | undefined) => void;
	selectedProduct?: Product;
}

export function LicenseSelector({
	onSelectLicense,
	selectedProduct,
}: LicenseSelectorProps) {
	const [selectedTimeline, setSelectedTimeline] = useState('');
	const [trialSKU, setTrialSKU] = useState<SKU>();

	const hasTrialSkuVerification = useCallback(() => {
		selectedProduct?.skus?.some((sku) => {
			sku.skuOptions.some((options) => {
				if (options.key === 'trial' && options.value === 'yes') {
					setTrialSKU(sku);
				}
			});
		});
	}, [selectedProduct]);

	useEffect(() => {
		hasTrialSkuVerification();
	}, [hasTrialSkuVerification]);

	const handleTimelineSelect = (timeline: string) => {
		setSelectedTimeline(timeline);
	};

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
					disabled={trialSKU ? false : true}
					icon={
						<GetClayIcon
							className="license-icon"
							icon="check-circle"
						/>
					}
					onClick={() => handleTimelineSelect('trial')}
					selected={selectedTimeline === 'trial' ? true : false}
					title={
						selectedTimeline === 'trial' ? '30-day Trial' : 'Trial'
					}
				/>
				<CardButton
					description="Pay Today"
					disabled={false}
					icon={
						<GetClayIcon
							className="license-icon"
							icon="credit-card"
						/>
					}
					onClick={() => handleTimelineSelect('paid')}
					selected={selectedTimeline === 'paid' ? true : false}
					title="Paid"
				/>
			</div>

			{selectedTimeline ? (
				<div className="timeline-container">
					{selectedTimeline === 'trial' ? (
						<TrialTimeline onSelectLicense={handleLicenseSelect} />
					) : (
						<PaidTimeline product={selectedProduct} />
					)}
				</div>
			) : null}
		</div>
	);
}
