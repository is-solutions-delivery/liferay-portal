/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useParams} from 'react-router-dom';

import {PageRenderer} from '../../../../../components/Page';
import {DetailedCard} from '../../../../../components/DetailedCard/DetailedCard';
import OrderDetailsHeader from '../../../components/Order/OrderDetailsHeader';
import Table from '../../../../../components/Table/Table';
import useGetAdminProductByOrderId from '../../../../../hooks/useGetAdminProductByOrderId';
import QATable, {Orientation} from '../../../../../components/QATable';
import PaymentStatus from '../../../components/Order/PaymentStatus/PaymentStatus';
import {Liferay} from '../../../../../liferay/liferay';
import {ProductSpecificationKey} from '../../../../../enums/Product';
import {safeJSONParse} from '../../../../../utils/util';

const paymentMethodLabels = {
	'paypal-integration': 'Paypal Integration',
}

function FallbackParagraph(content: string | undefined) {
	let paragraph = '-';

	if (content?.length && typeof content !== undefined) {
		paragraph = content;
	}

	return <p className="mt-1 mb-2">{paragraph}</p>;
}

function formatAddress(address: BillingAddress) {
	if (address) {
		if (!Object.keys(address).length) {
			return '-';
		}

		const locale = Liferay.ThemeDisplay.getDefaultLanguageId().replace(
			'_',
			'-'
		);

		const countryNames = new Intl.DisplayNames([locale], {type: 'region'});

		return `${address?.street1}, ${address?.city}, ${address?.regionISOCode} ${address?.zip} , ${countryNames.of(address?.countryISOCode)}`;
	}
	return '-';
}

const OrderDetails = () => {
	const {orderId} = useParams();

	const {data, error, isLoading} = useGetAdminProductByOrderId(
		orderId as string
	);

	const {order, product} = data || {};

	console.log(order);

	return (
		<PageRenderer
			className="app-details-header d-flex flex-column w-100"
			error={error}
			isLoading={isLoading}
		>
			<OrderDetailsHeader
				paymentStatusCode={order?.paymentStatusInfo.code as number}
				orderId={orderId as string}
			/>

			<div className="d-flex mt-5">
				<DetailedCard
					className="w-100 mr-5"
					cardIconAltText="order-form-pencil"
					cardTitle="Account Details"
					clayIcon="order-form-pencil"
				>
					<QATable
						items={[
							{
								title: 'Account Name',
								value: FallbackParagraph(order?.account?.name),
							},
							{
								title: 'Liferay User Email',
								value: FallbackParagraph(
									order?.creatorEmailAddress
								),
							},
							{
								title: 'Billing Email',
								value: '-',
							},
							{
								title: 'Project',
								value: FallbackParagraph(order?.projectName),
							},
							{
								title: 'Address',
								value: FallbackParagraph(
									formatAddress(
										order?.billingAddress as BillingAddress
									)
								),
							},
							{
								title: 'VAT Number',
								value: FallbackParagraph(order?.account?.taxId),
							},
						]}
						orientation={Orientation.VERTICAL}
					/>
				</DetailedCard>

				<DetailedCard
					className="w-100"
					cardIconAltText="change-list"
					cardTitle="Transaction Details"
					clayIcon="change-list"
				>
					<QATable
						items={[
							{
								title: 'Purchase Date',
								value: (
									<div className="d-flex flex-column justify-content-center">
										<p className="mb-0 pt-1">
											{new Date(
												order?.createDate || ''
											).toLocaleDateString('en-US', {
												day: 'numeric',
												month: 'short',
												year: 'numeric',
												hour: 'numeric',
												minute: '2-digit',
											})}
										</p>
									</div>
								),
							},
							{
								title: 'Payment Method',
								value: <p className="mt-1 mb-2 text-capitalize">{order?.paymentMethod || 'invoice'}</p>,
							},
							{
								title: 'Transaction ID',
								value: FallbackParagraph(order?.transactionId),
							},
							{title: 'Fullfilment Date', value: '-'},
							{
								title: 'Status',
								value: (
									<PaymentStatus
										paymentStatus={
											order?.paymentStatusInfo
												.code as number
										}
									/>
								),
							},
							{title: 'Paid Date', value: '-'},
						]}
						orientation={Orientation.VERTICAL}
					/>
				</DetailedCard>
			</div>

			<DetailedCard
				className="w-100 mt-5 pb-0"
				cardIconAltText="order-form"
				cardTitle="Order Details"
				clayIcon="order-form"
			>
				<Table
					hasHover={false}
					columns={[
						{
							bodyClass: 'order-item-display',
							key: 'options',
							title: 'App Name',
							render: (options) => {
								const [skuOption] = safeJSONParse(options, [
									{skuOptionValueKey: 'Standard'},
								]);

								return (
									<div className="d-flex alignt-items-center mt-2">
										<img
											alt="App Icon"
											className="order-details-app-icon mr-2 rounded"
											draggable={false}
											src={product?.thumbnail}
										/>
										<span>
											<strong>
												{product?.name.en_US}
											</strong>
											<p className="secondary-text text-capitalize">
												{skuOption.skuOptionValueKey}
											</p>
										</span>
									</div>
								);
							},
						},
						{
							bodyClass: 'order-item-display',
							key: 'id',
							title: 'Publisher',
							render: () =>
								FallbackParagraph(
									product?.productSpecifications?.find(
										(specification) =>
											specification.specificationKey ===
											ProductSpecificationKey.APP_DEVELOPER_NAME
									)?.value.en_US || ''
								),
						},
						{
							bodyClass: 'order-item-display',
							key: 'version',
							title: 'Quantity',
							render: () =>
								FallbackParagraph(
									`${order?.orderItems[0].quantity}`
								),
						},
						{
							bodyClass: 'order-item-display',
							key: 'version',
							title: 'Net Price',
							render: () =>
								FallbackParagraph(order?.subtotalFormatted),
						},
						{
							bodyClass: 'order-item-display',
							key: 'version',
							title: 'VAT',
							render: () =>
								FallbackParagraph(order?.taxAmountFormatted),
						},
						{
							key: 'version',
							title: 'Total',
							bodyClass: 'order-item-display',
							render: () =>
								FallbackParagraph(order?.totalFormatted),
						},
					]}
					rows={order?.orderItems || []}
				/>
			</DetailedCard>
		</PageRenderer>
	);
};

export default OrderDetails;
