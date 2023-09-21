/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import LicenseSectorCard from '../LicenseCard/index';

import './index.scss';

interface PaidTimelineProps {
	product?: Product;
}

const mock = {
	licensetiers: [
		{quantity: 1, value: '$979.99'},
		{quantity: 3, value: '$900.00'},
	],
};

export function PaidTimeline({product}: PaidTimelineProps) {
	const skus = product?.skus;

	const purchasebleSkus = skus?.filter((sku) => sku.purchasable === true);

	return (
		<div className="paid-timeline">
			<div>
				<div>
					<span className="mt-3">
						<p>Need help with license calculations?</p>
					</span>

					{purchasebleSkus?.map((sku) => {
						const skuDescription = sku.customFields?.filter(
							(customFields: any) =>
								customFields.name === 'Version Description'
						)[0].customValue.data;

						return (
							<div className="mb-5" key={sku.sku}>
								<LicenseSectorCard
									licenseDescription={skuDescription}
									licensetiers={mock.licensetiers}
									lisenceType={sku.sku}
								/>
							</div>
						);
					})}
				</div>
			</div>
			<h1>{product?.id}</h1>
		</div>
	);
}
