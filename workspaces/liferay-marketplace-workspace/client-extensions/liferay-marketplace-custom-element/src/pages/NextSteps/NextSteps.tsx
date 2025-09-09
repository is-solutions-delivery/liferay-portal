/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';

import checkCircleIcon from '../../assets/icons/check_circle_icon.svg';
import paymentPendingIcon from '../../assets/icons/payment_pending_icon.svg';
import {AccountAndAppCard} from '../../components/Card/AccountAndAppCard';
import {Header} from '../../components/Header/Header';
import {PaymentStatus} from '../../enums/Order';
import withProviders from '../../hoc/withProviders';
import i18n from '../../i18n';
import {Liferay} from '../../liferay/liferay';
import {baseURL} from '../../utils/api';
import {
	getAccountImage,
	getThumbnailByProductAttachment,
	showAppImage,
} from '../../utils/util';
import useNextSteps from './useNextSteps';

import './NextSteps.scss';
import {getSiteURL} from '../../utils/site';

export function NextSteps() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const orderId = urlParams.get('orderId');

	const {accountCommerce, firstPlacedOrder, isLoading, placedOrder, product} =
		useNextSteps(orderId as string);

	const {name: appName = ''} = firstPlacedOrder ?? {};

	const isTrial = placedOrder?.placedOrderItems?.some(
		(item: any) =>
			item.sku.endsWith('ts') || item.sku.toLowerCase().includes('trial')
	);

	const appIcon = getThumbnailByProductAttachment(product?.images);

	const appLogo = showAppImage(appIcon as string).replace(
		(appIcon as string)?.split('/o')[0],
		baseURL
	);

	const paymentStatus = placedOrder?.paymentStatus;

	const nextStepBody = {
		[PaymentStatus.FAILED]: (
			<Header
				description={
					<>
						<p>
							We were unable to process the payment for{' '}
							<strong>{appName}</strong>.
						</p>

						<p>
							If you need help or believe this is an error,
							contact our support team.
						</p>

						<p>
							Your Order ID is: <strong>{orderId}</strong>
						</p>
					</>
				}
				title="Payment Failed"
			/>
		),

		[PaymentStatus.PAID]: (
			<Header
				description={
					<span>
						<p className="mb-4 text-center">
							Congratulations on the purchase of{' '}
							<strong>{appName}</strong>. Your payment has been
							successfully processed via PayPal. You will now need
							to install the app by clicking on the &quot;Continue
							to Install&quot; button below.
						</p>

						<p className="align-items-end d-flex justify-content-center mb-0">
							Your Order ID is: &nbsp;
							<a
								className="next-step-page-text-bold"
								href={`${getSiteURL()}/customer-dashboard#/order/${orderId}`}
							>
								<h2 className="mb-0 next-step-page-order next-step-page-text-bold">
									{orderId}
								</h2>
							</a>
						</p>
					</span>
				}
				icon={
					<span className="d-flex justify-content-center">
						<img alt="check circle icon" src={checkCircleIcon} />
					</span>
				}
				title={
					<span className="d-flex justify-content-center mb-5 next-step-page-title">
						Payment completed!
					</span>
				}
			/>
		),
		[PaymentStatus.PENDING]: (
			<Header
				description={
					<span>
						<p className="text-center">
							Thank you for your order. We have registered your
							request and will send you the invoice by email with
							all the details to complete your payment. Check your
							Spam or Promotions folder if you don't see it in
							your inbox. Your order is currently{' '}
							<strong>pending payment</strong>.
						</p>
						<p className="d-flex justify-content-center m-0 next-step-page-text-bold">
							Need help?&nbsp;{' '}
							<a href="mailto:support@liferay.com">
								support@liferay.com
							</a>
						</p>
					</span>
				}
				icon={
					<span className="d-flex justify-content-center mb-4">
						<img
							alt="payment pending icon"
							src={paymentPendingIcon}
						/>
					</span>
				}
				title={
					<h1 className="d-flex justify-content-center mb-5 text-body">
						Order received!
					</h1>
				}
			/>
		),
	};

	if (isLoading) {
		return <ClayLoadingIndicator />;
	}

	return (
		<div className="next-step-page-container">
			<div className="next-step-page-content">
				<div className="next-step-page-cards">
					<AccountAndAppCard
						category="Application"
						logo={appLogo || 'catalog'}
						title={appName}
					/>

					<ClayIcon
						className="m-0 next-step-page-icon"
						symbol="arrow-right-full"
					/>

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
						{(nextStepBody as any)[String(paymentStatus) || '']}
					</div>
				</div>

				<div className="d-flex justify-content-center mt-4 next-step-page-footer-button-container">
					<ClayButton
						className="mr-3 next-step-page-footer-button-back"
						displayType="secondary"
						onClick={() => {
							Liferay.Util.navigate(
								`${getSiteURL()}/customer-dashboard`
							);
						}}
					>
						{i18n.translate('go-to-my-apps')}
					</ClayButton>

					<ClayButton
						className="next-step-page-footer-button-continue"
						displayType="primary"
						onClick={() => {
							const url =
								paymentStatus === PaymentStatus.PAID
									? `${getSiteURL()}/customer-dashboard#/order/${orderId}`
									: getSiteURL();
							Liferay.Util.navigate(url);
						}}
					>
						{i18n.translate(
							paymentStatus === PaymentStatus.PAID
								? 'continue-to-install'
								: 'go-to-the-catalog'
						)}
					</ClayButton>
				</div>

				{paymentStatus === PaymentStatus.FAILED && (
					<div className="d-flex justify-content-center">
						<a href="#">
							<ins>Contact Support</ins>
						</a>
					</div>
				)}

				{(paymentStatus === PaymentStatus.PAID || isTrial) && (
					<div className="d-flex justify-content-center next-step-page-learn-more">
						<a href="https://learn.liferay.com/w/dxp/development/marketplace">
							Learn more about App Configuration
						</a>
					</div>
				)}
			</div>
		</div>
	);
}

export default withProviders(NextSteps);
