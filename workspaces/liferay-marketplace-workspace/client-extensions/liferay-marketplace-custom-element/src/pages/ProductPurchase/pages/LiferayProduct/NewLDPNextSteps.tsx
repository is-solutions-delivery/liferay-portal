/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import useSWR from 'swr';

import checkCircleIcon from '../../../../assets/icons/check_circle_icon.svg';
import {AccountAndAppCard} from '../../../../components/Card/AccountAndAppCard';
import {Header} from '../../../../components/Header/Header';
import {PageRenderer} from '../../../../components/Page';
import {ProductSpecificationKey} from '../../../../enums/Product';
import useGetProductByOrderId from '../../../../hooks/useGetProductByOrderId';
import i18n from '../../../../i18n';
import {Liferay} from '../../../../liferay/liferay';
import HeadlessAdminUser from '../../../../services/rest/HeadlessAdminUser';
import {getSiteURL} from '../../../../utils/site';
import {getAccountImage} from '../../../../utils/util';
import { getProductSpecificationValue } from '../../../../utils/productUtils';

type NewLDPNextStepsProps = {
	data: ReturnType<typeof useGetProductByOrderId>['data'];
	error: ReturnType<typeof useGetProductByOrderId>['error'];
	isLoading: ReturnType<typeof useGetProductByOrderId>['isLoading'];
};

const NewLDPNextSteps: React.FC<NewLDPNextStepsProps> = ({
	data,
	error,
	isLoading,
}: NewLDPNextStepsProps) => {
	const placedOrder = data?.placedOrder;
	const product = data?.product;

	const accountId = placedOrder?.accountId;
	const productName = product?.name || '';

	const {data: accountCommerce} = useSWR(
		accountId ? `/next-steps/account-commerce/${accountId}` : null,
		() => HeadlessAdminUser.getAccount(accountId as unknown as string)
	);

	const appBeta = getProductSpecificationValue(ProductSpecificationKey.APP_BETA, product as DeliveryProduct)

	return (
		<PageRenderer
			className="next-step-page-container"
			error={error}
			isLoading={isLoading}
		>
			<div className="next-step-page-content">
				<div className="next-step-page-cards">
					<AccountAndAppCard
						appBeta={appBeta}
						category={product?.catalogName as string}
						logo={
							data?.marketplaceDeliveryOrder?.productThumbnail ||
							'catalog'
						}
						title={
							<div className="align-items-center d-flex">
								{productName}{' '}
							</div>
						}
					/>

					<div className="mx-4">
						<ClayIcon
							className="liferay-ldp-form-next-step-page-icon m-0 next-step-page-icon"
							symbol="arrow-right-full"
						/>
					</div>

					<AccountAndAppCard
						category="Account"
						logo={getAccountImage(
							accountCommerce?.logoURL as string
						)}
						title={accountCommerce?.name ?? ''}
					/>
				</div>

				<div className="next-step-page-text">
					<div className="next-step-page-text">
						<Header
							description={
								<span className="text-center">
									<p className="mb-1 next-step-page-description">

										Your request has been successfully received. 
										You will shortly receive an email with all the details required to configure{' '} 
										<strong>your Liferay Data Platform environment.</strong> Please follow the instructions provided 
										to complete your setup. If the email does not appear in your inbox within a 
										few minutes, kindly check your spam folder.
									</p>
								</span>
							}
							icon={
								<span className="d-flex justify-content-center mb-4">
									<img
										alt="payment pending icon"
										draggable="false"
										src={checkCircleIcon}
									/>
								</span>
							}
							title={
								<span className="d-flex justify-content-center mb-5 next-step-page-title text-center">
									{i18n.translate(
										'thank-you-for-your-purchase'
									)}
								</span>
							}
						/>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-4 next-step-page-footer-button-container">
					<ClayButton
						className="mr-3 next-step-page-footer-button-secondary"
						displayType="secondary"
						onClick={() => {
							Liferay.Util.navigate(
								`${getSiteURL()}/customer-dashboard/#/products`
							);
						}}
					>
						{i18n.translate('go-to-dashboard')}
					</ClayButton>
				</div>
			</div>
		</PageRenderer>
	);
};

export default NewLDPNextSteps;
