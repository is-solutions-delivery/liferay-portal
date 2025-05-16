/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

import {useMarketplaceContext} from '../../context/MarketplaceContext';
import {Analytics} from '../../core/Analytics';
import useCart from '../../hooks/useCart';
import useCommerceRegions from '../../hooks/useCommerceRegions';
import useGetAddresses from '../../hooks/useGetAddresses';
import i18n from '../../i18n';
import {Liferay} from '../../liferay/liferay';
import CommerceSelectAccount from '../../services/rest/CommerceSelectAccount';
import HeadlessAdminUser from '../../services/rest/HeadlessAdminUser';
import {Region} from '../../services/rest/HeadlessCommerceAdminAddress';
import {
	getCurrentCurrency,
	getPaymentMethodURL,
	postCheckoutCart,
	postEmailAppInformation,
} from '../../utils/api';
import {useGetAppContext} from './GetAppContextProvider';
import ProductHeader from './containers/ProductHeader';
import ProductStepWizard from './containers/ProductStepWizard';
import {PaymentMethod} from './enums/paymentMethod';
import buildNewCart from './utils/buildNewCart';
import {getProductOrderTypes} from './utils/getProductOrderTypes';
import getProductPriceModel from './utils/getProductPriceModel';
import {getProductSpecificationValues} from './utils/getProductSpecificationValues';
import getReplaceCurrentURL from './utils/getReplaceCurrentURL';
import {postCartByPaymentMethod} from './utils/postCartByPaymentMethod';

import './styles/index.scss';
import {SkuOptions} from '../../enums/Product';
import {getPrices} from './utils/getPrices';

const getProductBasePriceAndTrial = async (
	product: DeliveryProduct,
	isCloudApp: boolean
) => {
	const baseValue = {
		basePrice: 0,
		firstSku: undefined,
		isTrial: false,
		trialSku: undefined,
		standardSku: undefined,
		prices: undefined,
	};

	if (!product) {
		return baseValue;
	}

	const {isFreeApp} = getProductPriceModel(product);

	const skus = (product.skus as unknown as DeliverySKU[])?.filter(
		({purchasable}) => purchasable
	);

	if (isFreeApp) {
		return {
			...baseValue,
			firstSku: skus.find((sku) => sku.price.price === 0) ?? skus[0],
		};
	}

	let basePrice: any;
	let developerSku: DeliverySKU | undefined;
	let standardSku: DeliverySKU | undefined;
	let regionalPrices: any;
	let trialSku: DeliverySKU | undefined;

	if (isCloudApp) {
		trialSku = skus.find(({skuOptions}) =>
			skuOptions.find(
				(skuOption) =>
					skuOption.skuOptionKey === SkuOptions.TRIAL &&
					skuOption.skuOptionValueKey === 'yes'
			)
		);

		standardSku = skus.find(({skuOptions}) =>
			skuOptions.find(
				(skuOption) =>
					skuOption.skuOptionKey === SkuOptions.TRIAL &&
					skuOption.skuOptionValueKey === 'no'
			)
		);
	} else {
		const skusLicenseUsageTypes = skus
			.map((sku) => {
				const match = sku.skuOptions.find((skuOption) =>
					[SkuOptions.STANDARD, SkuOptions.TRIAL, SkuOptions.DEVELOPER].includes(
						skuOption.skuOptionValueKey as SkuOptions
					)
				);
				return match ? { ...sku, matchedOption: match } : null;
			})
			.filter(Boolean) as (DeliverySKU & { matchedOption: SkuOption })[];

		standardSku = skusLicenseUsageTypes.find(
			({ matchedOption }) => matchedOption.skuOptionValueKey === SkuOptions.STANDARD
		);

		developerSku = skusLicenseUsageTypes.find(
			({ matchedOption }) => matchedOption.skuOptionValueKey === SkuOptions.DEVELOPER
		);

		trialSku = skusLicenseUsageTypes.find(
			({ matchedOption }) => matchedOption.skuOptionValueKey === SkuOptions.TRIAL
		);

		const standardSkuId = standardSku?.id as number;
		const developerSkuId = developerSku?.id as number;

		const currency = await getCurrentCurrency();
		regionalPrices = await getPrices(product, standardSkuId , developerSkuId);

		if (currency) {
			basePrice = regionalPrices?.standard.entries[0].price ?? (standardSku?.price?.price ?? 0) * currency.rate;
		} else {
			basePrice = standardSku?.price?.price 
		}
	}

	return {
		basePrice,
		firstSku: skus[0],
		standardSku,
		trialSku,
		isTrial: !!trialSku,
		prices: regionalPrices
	};
	
};

const GetAppOutlet = () => {
	const [
		{
			account,
			isCloudApp,
			license: {selectedSKU, type},
			payment: {
				billingAddress,
				invoice: {email, purchaseOrderNumber},
				method: paymentMethod,
			},
			product,
			project = '',
		},
	] = useGetAppContext();

	const [loading, setLoading] = useState(false);
	const {addresses} = useGetAddresses(account?.id);
	const {channel} = useMarketplaceContext();
	const location = useLocation();

	const {data: regionsResponse} = useCommerceRegions();
	const regions = regionsResponse?.items ?? [];

	const navigate = useNavigate();

	const productBasePriceAndTrial = getProductBasePriceAndTrial(
		product as unknown as DeliveryProduct,
		isCloudApp
	);

	let firstSku: DeliverySKU | undefined;
	let trialSku: DeliverySKU | undefined;

	useEffect(() => {
		(async () => {
			const result = await productBasePriceAndTrial;
			firstSku = result.firstSku;
			trialSku = result.trialSku;

		})();
	}, [productBasePriceAndTrial]);

	const sku = trialSku ?? firstSku;

	const productSpecificationValues = getProductSpecificationValues(
		product?.productSpecifications || []
	);

	const cartUtil = useCart({
		accountId: account?.id as number,
		orderType: getProductOrderTypes(productSpecificationValues),
		product: product as DeliveryProduct,
	});

	const {isFreeApp, priceModel} = getProductPriceModel(product);

	const getCountryNameByCode = (regions: Region[], countryCode?: string) => {
		const country = regions.find((region) => region.a2 === countryCode);

		return (
			country?.title_i18n[Liferay.ThemeDisplay.getLanguageId()] ||
			country?.title_i18n[Liferay.ThemeDisplay.getDefaultLanguageId()] ||
			country?.name
		);
	};

	const getRegionByCountryCode = (
		regions: Region[],
		regionISOCode?: string,
		countryCode?: string
	) => {
		const country = regions.find((region) => region.a2 === countryCode);
		const addressRegion = country?.regions.find(
			(region) => region.regionCode === regionISOCode
		);

		return addressRegion?.name;
	};

	async function handleGetApp(orderId = cartUtil?.cart?.id) {
		setLoading(true);

		if (billingAddress.saveAddress) {
			await HeadlessAdminUser.postAddress(account?.id as number, {
				addressCountry: getCountryNameByCode(
					regions,
					billingAddress?.country
				),
				addressLocality: billingAddress.city,
				addressRegion: getRegionByCountryCode(
					regions,
					billingAddress.regionISOCode,
					billingAddress?.country
				),
				addressType: 'billing-and-shipping',
				name: billingAddress.name,
				phoneNumber: billingAddress.phoneNumber,
				postalCode: billingAddress.zip,
				primary: false,
				streetAddressLine1: billingAddress.street1,
				streetAddressLine2: billingAddress.street2,
			});
		}

		const productSpecificationValues = getProductSpecificationValues(
			product?.productSpecifications || []
		);

		const orderType = getProductOrderTypes(productSpecificationValues);

		delete billingAddress.saveAddress;

		try {
			const cart = buildNewCart({
				billingAddress,
				channel,
				email,
				isFreeApp,
				orderType,
				product,
				project,
				purchaseOrderNumber,
				selectedAccount: account,
				selectedPaymentMethod:
					type.toLowerCase() === PaymentMethod.TRIAL && selectedSKU
						? 'trial'
						: paymentMethod,
				selectedSKU,
				sku: sku as any,
			});
			console.log('cart', cart);
			const cartResponse = orderId
				? await cartUtil.updateCart(orderId, {
						...cart,
						cartItems: cartUtil.cartItems,
					})
				: await postCartByPaymentMethod(cart, channel.id);

			await postCheckoutCart({cartId: cartResponse.id});

			Analytics.track('APP_PURCHASE', {
				isFreeApp,
				paymentMethod,
				productName: product.name,
			});

			await postEmailAppInformation({
				dashboardLink: getReplaceCurrentURL(
					'get-app',
					'customer-dashboard'
				),
				orderID: cartResponse.id,
				priceModel,
				productName: product?.name,
				productType: productSpecificationValues,
			});

			const nextStepsCallbackURL = getReplaceCurrentURL(
				'get-app',
				'next-steps',
				`${encodeURIComponent(cartResponse.id)}`
			);

			const paymentMethodURL = await getPaymentMethodURL(
				cartResponse.id,
				nextStepsCallbackURL
			);

			await CommerceSelectAccount.selectAccount(account?.id as number);

			window.location.href = paymentMethodURL || nextStepsCallbackURL;
		}
		catch (error) {
			console.error('Unable to handleGetApp', error);

			Liferay.Util.openToast({
				message: i18n.translate('an-unexpected-error-occurred'),
				type: 'danger',
			});
		}

		setLoading(false);
	}

	useEffect(() => {
		if (location.pathname !== '/' && !account) {
			navigate('/');
		}
	}, [account, location.pathname, navigate]);

	if (!product) {
		return null;
	}

	return (
		<div>
			<ProductHeader
				productBasePriceAndTrial={productBasePriceAndTrial}
			/>

			<div className="border d-flex flex-column mt-7 p-5 rounded">
				<main>
					<div className="d-flex flex-column">
						{!isFreeApp && <ProductStepWizard />}

						<Outlet
							context={{
								account,
								addresses,
								cartUtil,
								handleGetApp,
								isFreeApp,
								loading,
								productBasePriceAndTrial,
								selectedPaymentMethod: paymentMethod,
							}}
						/>
					</div>
				</main>
			</div>
		</div>
	);
};

export type GetAppOutletContext = {
	addresses: BillingAddress[];
	cartUtil: ReturnType<typeof useCart>;
	handleGetApp: (orderId?: number) => void;
	isFreeApp: boolean;
	loading: boolean;
	productBasePriceAndTrial: ReturnType<typeof getProductBasePriceAndTrial>;
	selectedPaymentMethod: PaymentMethod;
};

export {getProductBasePriceAndTrial};

export default GetAppOutlet;
