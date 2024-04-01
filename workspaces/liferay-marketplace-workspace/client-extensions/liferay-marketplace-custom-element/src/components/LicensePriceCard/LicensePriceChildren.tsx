/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import unitedStatesIcon from '../../assets/icons/united_states_icon.svg';
import {CurrencyAbbreviation} from '../../enums/CurrencyAbbreviation';
import {App} from '../../pages/ReviewAndSubmitAppPage/ReviewAndSubmitAppPageUtil';

export type TierPrices = {
	skuId: number;
	tierPrice: {
		currency: string;
		price: number;
		priceFormatted: string;
		quantity: number;
	}[];
};

type LicensePriceChildrenType = {
	app: App;
	isCloud: boolean;
	tierPrices: TierPrices[];
};

const LicensePriceChildren = ({
	app,
	isCloud,
	tierPrices,
}: LicensePriceChildrenType) => {
	const {skus} = app;

	const productSkus = tierPrices
		.map((sku) => {
			const {skuId, tierPrice} = sku;

			return {
				sku: skus.find(({id}) => id === skuId) as SKU,
				tierPrices: tierPrice,
			};
		})
		.filter(({sku}) => {
			if (!sku || sku.sku.endsWith('ts')) {
				return false;
			}

			if (
				sku.skuOptions.some(({value}) =>
					['yes', 'trial'].includes(value)
				)
			) {
				return false;
			}

			return true;
		});

	return (
		<div className="align-items-start d-flex flex-column justify-content-between license-container">
			{productSkus?.map(({sku, tierPrices: licenses}, index: number) => {
				return (
					<div
						className="align-items-baseline d-flex mb-5"
						key={index}
					>
						<div className="col-3 license-type p-0">
							<span className="text-capitalize">
								{` ${
									isCloud
										? 'Standard'
										: sku.skuOptions[0].value
								} Licenses`}
							</span>
						</div>
						<div className="align-items-start d-flex flex-column ml-5">
							{licenses?.map((license, indexLicense: number) => {
								const {
									currency,
									priceFormatted,
									quantity,
								} = license;

								const minPriceLicenseOption =
									indexLicense === licenses?.length - 1;

								const toLicenseQuantityValue =
									licenses[indexLicense + 1]?.quantity - 1;

								return (
									<div
										className="d-flex flex-row"
										key={indexLicense}
									>
										<div className="col-4">
											<span className="font-weight-bold text-muted">
												From
											</span>

											<span className="font-weight-bold ml-3 mr-3">
												{quantity}
											</span>

											<span className="font-weight-bold text-muted">
												To
											</span>

											<span className="font-weight-bold ml-4 mr-6">
												{minPriceLicenseOption ? (
													<span id="infinity-symbol">
														∞
													</span>
												) : (
													toLicenseQuantityValue
												)}
											</span>
										</div>

										<div className="mx-5">
											<span>-</span>
										</div>

										<div className="align-items-end d-flex">
											<div className="license-currency-icon">
												<img src={unitedStatesIcon} />
											</div>

											<span className="font-weight-bold mr-3">
												{currency === 'US Dollar'
													? CurrencyAbbreviation.USD
													: currency}
											</span>

											<span>{priceFormatted}</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default LicensePriceChildren;
