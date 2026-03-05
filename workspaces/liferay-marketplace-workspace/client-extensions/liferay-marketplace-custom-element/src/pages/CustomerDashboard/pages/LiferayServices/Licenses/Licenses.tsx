/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {useModal} from '@clayui/modal';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {differenceInDays, format, isBefore, subMonths} from 'date-fns';
import {useEffect, useMemo, useState} from 'react';
import {useLocation, useOutletContext, useParams} from 'react-router-dom';
import useSWR from 'swr';

import Modal from '../../../../../components/Modal';
import StatusCell from '../../../../../components/Table/StatusCell';
import Table from '../../../../../components/Table/Table';
import {useMarketplaceContext} from '../../../../../context/MarketplaceContext';
import useGetProductByOrderId from '../../../../../hooks/useGetProductByOrderId';
import i18n from '../../../../../i18n';
import provisioningOAuth2 from '../../../../../services/oauth/Provisioning';
import {LicenseKey} from '../../../../../services/oauth/types';
import DeactivateKeysModal from '../../../components/DeactivateKeysModal/DeactivateKeysModal';
import LicenseDetailsModalHeader from '../../../components/LicenseDetailsModalHeader';
import LicenceKeyModalContent from '../../../components/LicenseModalContent';
import TitleSubtitleHeader from '../../../components/TitleSubtitleHeader';
import useLicenseActions from './useLicensesActions';

import './Licenses.scss';
import {OrderTypes} from '../../../../../enums/Order';
import ActivationKeyAlert from './LicenseAlert';
import LicenseTitleHeader from './LicenseTitleHeader';
import {breadcrumbStore} from '../../../../../components/Breadcrumb/BreadcrumbStore';

type OutletContext = ReturnType<typeof useGetProductByOrderId>;

const PAGE_SIZES = [
	{label: 5},
	{label: 10},
	{label: 20},
	{label: 30},
	{label: 50},
];

const isLicenseExpired = (expirationDate: string) =>
	!isBefore(new Date(), new Date(expirationDate));

const LiferayServiceLicenses = () => {
	const [modalData, setModalData] = useState<LicenseKey>();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const {myUserAccount} = useMarketplaceContext();
	const {orderId} = useParams();
	const deactivateLicenseModal = useModal();
	const licenseKeyModal = useModal();
	const outletContext = useOutletContext<OutletContext['data']>();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);

	const placedOrder = outletContext?.placedOrder;
	const product = outletContext?.product;

	useEffect(() => {
		breadcrumbStore.send({
			replacements: {[orderId as string]: product?.name || ''},
			type: 'setReplacements',
		});
	}, [orderId, product?.name]);

	const keyType =
		placedOrder?.orderTypeExternalReferenceCode === OrderTypes.DXP
			? 'On-Premise'
			: 'Cloud';

	const {
		data: licenseKeysResponse,
		isLoading,
		mutate,
	} = useSWR<LicenseKey[]>(
		`/order-free-dxp-license-keys/${orderId}`,
		async (): Promise<LicenseKey[]> => {
			try {
				return provisioningOAuth2.getOrderFreeDXPLicenseKeys(
					orderId as string
				);
			}
			catch {
				return [];
			}
		}
	);

	const isNewActivationKey = ({createDate}: LicenseKey) => {
		if (!createDate) {
			return false;
		}

		const created = new Date(createDate);
		const today = new Date();

		const daysSinceCreation = differenceInDays(today, created);

		return daysSinceCreation <= 15;
	};

	const isRenewalAvailable = (licenseKey: LicenseKey) => {
		const {active, expirationDate} = licenseKey;

		if (!active || !expirationDate) {
			return false;
		}

		const expiration = new Date(expirationDate);
		const renewalStart = subMonths(expiration, 3);

		return isBefore(renewalStart, new Date());
	};

	const {onDeativateLicenseKey, onDownload, onViewLicenseKey} =
		useLicenseActions({
			deactivateLicenseModal,
			keyType,
			licenseKeyModal,
			mutate,
			product,
			setModal: setModalData,
		});

	const buttonsInfo = useMemo(
		() => ({
			first: (
				<ClayButton
					className="ml-4"
					displayType="unstyled"
					onClick={licenseKeyModal.onClose}
				>
					{i18n.translate('cancel')}
				</ClayButton>
			),
			last: (
				<>
					<ClayButton
						className="border-danger text-danger"
						displayType="secondary"
						onClick={() => {
							licenseKeyModal.onClose();

							deactivateLicenseModal.onOpenChange(true);
						}}
					>
						{i18n.translate('deactivate')}
					</ClayButton>

					<ClayButton
						className="ml-4 mr-1"
						disabled={isLicenseExpired(
							modalData?.expirationDate as string
						)}
						displayType="primary"
						onClick={() => {
							onDownload(modalData as LicenseKey);
						}}
						title={
							isLicenseExpired(
								modalData?.expirationDate as string
							)
								? i18n.translate(
										'this-key-is-expired-and-cannot-be-downloaded'
									)
								: ''
						}
					>
						<ClayIcon symbol="download" />
						{i18n.translate('download-key')}
					</ClayButton>
				</>
			),
		}),
		[licenseKeyModal, modalData, deactivateLicenseModal, onDownload]
	);

	if (isLoading) {
		return <ClayLoadingIndicator />;
	}

	const rows = licenseKeysResponse ?? [];

	return (
		<div className="mt-5">
			{searchParams.has('next-steps') && (
				<ActivationKeyAlert
					className="license-alert"
					symbol="check-circle"
					title="Your free activation key has been generated!"
				>
					Thanks for choosing Liferay DXP! Download your activation
					key below and, if needed, the software bundle to get
					started.
				</ActivationKeyAlert>
			)}

			<div className="licenses mb-9">
				{rows.length && (
					<Table
						hasHover={false}
						Actions={({row}) => {
							const expired =
								!row.expirationDate ||
								isLicenseExpired(row.expirationDate);
							const renewalAvailable = isRenewalAvailable(row);
							const licenseKey = row.id;

							return (
								<ClayTooltipProvider>
									<div className="license-actions d-flex align-items-center">
										<ClayButton
											displayType="unstyled"
											className="mr-3 renew-link"
											disabled={!renewalAvailable}
											title={
												!renewalAvailable
													? i18n.translate(
															'you-can-renew-your-activation-key-starting-3-months-before-it-expires'
														)
													: undefined
											}
											onClick={async () => {
												await provisioningOAuth2.licenseKeysRenew(
													licenseKey
												);
											}}
										>
											{i18n.translate('renew')}
										</ClayButton>

										<ClayButton
											displayType="secondary"
											className="px-3 rounded license-download-btn"
											disabled={expired}
											onClick={() => {
												provisioningOAuth2.downloadLicenseKey(
													licenseKey
												);
											}}
										>
											{i18n.translate('download')}
										</ClayButton>
									</div>
								</ClayTooltipProvider>
							);
						}}
						columns={[
							{
								bodyClass:
									'border-0 cursor-pointer text-capitalize',
								expanded: true,
								key: 'licenseType',
								noWrap: true,
								render: (_, row) => (
									<LicenseTitleHeader
										isNewActivationKey={isNewActivationKey(
											row
										)}
										isToBeRenewed={isRenewalAvailable(row)}
										title={row.productName}
									/>
								),
								title: (
									<TitleSubtitleHeader title="Activation Key" />
								),
							},
							{
								bodyClass: 'border-0 cursor-pointer',
								key: 'ipAddresses',
								render: (ipAddresses) => (
									<TitleSubtitleHeader
										title={ipAddresses || '-'}
									/>
								),
								title: <TitleSubtitleHeader title="Domain" />,
							},
							{
								bodyClass: 'border-0 cursor-pointer',
								key: 'startDate',
								render: (startDate, {expirationDate}) => (
									<div className="date-cell">
										<p className="m-0">
											{format(
												new Date(startDate),
												'MMM dd, yyyy'
											)}{' '}
											-
										</p>

										<p className="m-0">
											{expirationDate
												? format(
														new Date(
															expirationDate
														),
														'MMM dd, yyyy'
													)
												: 'DNE'}
										</p>
									</div>
								),
								title: (
									<TitleSubtitleHeader
										title={
											<span>
												Start Date -<br />
												Exp. Date
											</span>
										}
									/>
								),
							},
							{
								bodyClass: 'border-0 cursor-pointer',
								key: 'status',
								render: (_, {active, expirationDate}) => {
									const isActive =
										active &&
										isBefore(
											new Date(),
											new Date(expirationDate)
										);

									return (
										<StatusCell
											icon="circle"
											iconClassName={
												isActive ? 'active' : 'expired'
											}
										>
											{isActive ? 'Active' : 'Expired'}
										</StatusCell>
									);
								},
								title: <TitleSubtitleHeader title="Status" />,
							},
						]}
						hasKebabButton
						hasPagination
						kebabClassName="border-0"
						onClickRow={onViewLicenseKey}
						paginationProps={{
							activeDelta: pageSize,
							activePage: page,
							deltas: PAGE_SIZES,
							onDeltaChange: (pageSize: number) =>
								setPageSize(pageSize),
							onPageChange: (page: number) => setPage(page),
							totalItems: rows.length,
						}}
						rows={rows}
					/>
				)}

				{licenseKeyModal.open && (
					<Modal
						first={buttonsInfo.first}
						last={buttonsInfo.last}
						observer={licenseKeyModal.observer}
						size="lg"
						visible={true}
					>
						<LicenceKeyModalContent
							Header={
								<LicenseDetailsModalHeader
									modalData={modalData}
									myUserAccount={myUserAccount}
									product={product as DeliveryProduct}
								/>
							}
							modalData={modalData as LicenseKey}
						/>
					</Modal>
				)}

				{deactivateLicenseModal.open && (
					<DeactivateKeysModal
						{...deactivateLicenseModal}
						onConfirm={() =>
							onDeativateLicenseKey(modalData as LicenseKey)
						}
					/>
				)}
			</div>
		</div>
	);
};

export default LiferayServiceLicenses;
