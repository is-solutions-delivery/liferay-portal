/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import { useModal } from '@clayui/modal';
import { ClayTooltipProvider } from '@clayui/tooltip';
import classNames from 'classnames';
import { format, isBefore, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import useSWR from 'swr';

import { DashboardEmptyTable } from '../../../../../components/DashboardTable/DashboardEmptyTable';
import Modal from '../../../../../components/Modal';
import StatusCell from '../../../../../components/Table/StatusCell';
import Table from '../../../../../components/Table/Table';
import { useMarketplaceContext } from '../../../../../context/MarketplaceContext';
import useGetProductByOrderId from '../../../../../hooks/useGetProductByOrderId';
import i18n from '../../../../../i18n';
import provisioningOAuth2 from '../../../../../services/oauth/Provisioning';
import { LicenseKey } from '../../../../../services/oauth/types';
import DeactivateKeysModal from '../../../components/DeactivateKeysModal/DeactivateKeysModal';
import LicenseDetailsModalHeader from '../../../components/LicenseDetailsModalHeader';
import LicenceKeyModalContent from '../../../components/LicenseModalContent';
import TitleSubtitleHeader from '../../../components/TitleSubtitleHeader';
import useLicenseActions from './useLicensesActions';

import './Licenses.scss';
import { OrderStatus, OrderTypes } from '../../../../../enums/Order';
import ActivationKeyAlert from '../LicenseAlert';
import LicenseTitleHeader from './LicenseTitleHeader';

type OutletContext = ReturnType<typeof useGetProductByOrderId>;

const PAGE_SIZES = [
    { label: 5 },
    { label: 10 },
    { label: 20 },
    { label: 30 },
    { label: 50 },
];

const isLicenseExpired = (expirationDate: string) =>
    !isBefore(new Date(), new Date(expirationDate));

const LiferayServiceLicenses = () => {
    const [modalData, setModalData] = useState<LicenseKey>();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { myUserAccount } = useMarketplaceContext();
    const { orderId } = useParams();
    const deactivateLicenseModal = useModal();
    const licenseKeyModal = useModal();
    const outletContext = useOutletContext<OutletContext['data']>();

    const placedOrder = outletContext?.placedOrder;
    const product = outletContext?.product;

    const keyType =
        placedOrder?.orderTypeExternalReferenceCode === OrderTypes.DXP_APP
            ? 'On-Premise'
            : 'Cloud';

    const {
        data: licenseKeysResponse,
        isLoading,
        mutate,
    } = useSWR(
        `/order-license-keys/${orderId}/${page}/${pageSize}`,
        async () => {
            try {
                return provisioningOAuth2.getOrderLicenseKeys(
                    orderId as string,
                    new URLSearchParams({
                        page: page.toString(),
                        pageSize: pageSize.toString(),
                    })
                );
            }
            catch {
                return {
                    items: [],
                    totalCount: 0,
                };
            }
        }
    );

    const isRenewalAvailable = (expirationDate?: string | null) => {
        if (!expirationDate) {
            return false;
        }

        const expiration = new Date(expirationDate);
        const renewalStart = subMonths(expiration, 3);

        return isBefore(renewalStart, new Date());
    };

    const orderStatusIsNotCompleted =
        placedOrder?.orderStatusInfo?.label !== OrderStatus.COMPLETED;

    const { onDeativateLicenseKey, onDownload, onViewLicenseKey } =
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

    const mockRows = [
        {
            id: '1',
            isNewActivationKey: true,
            licenseType: 'PROD',
            domain: 'prod.liferay.internal',
            startDate: '2025-01-01T00:00:00Z',
            expirationDate: '2027-01-01T00:00:00Z',
            active: true,
            keyType: 'Server',
        },
        {
            id: '2',
            isNewActivationKey: false,
            licenseType: 'QA',
            domain: 'qa.liferay.internal',
            startDate: '2024-01-01T00:00:00Z',
            expirationDate: '2025-01-01T00:00:00Z',
            active: false,
            keyType: 'Server',
        },
        {
            id: '3',
            isNewActivationKey: true,
            licenseType: 'DEV',
            domain: '',
            startDate: '2025-06-15T00:00:00Z',
            expirationDate: null,
            active: true,
            keyType: 'Developer',
        },
    ];

    const USE_MOCK = true;

    const rows = USE_MOCK
        ? mockRows
        : (licenseKeysResponse?.items ?? []);

    return (
        <div className='mt-5'>
            <ActivationKeyAlert className='.license-alert' />
            <div className="licenses mb-9 mt-4">
                {rows.length ? (
                    <Table
                        hasHover={false}
                        Actions={({ row }) => {
                            const expired =
                                !row.expirationDate ||
                                isLicenseExpired(row.expirationDate);
                            const renewalAvailable = isRenewalAvailable(row.expirationDate);

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
                                            onClick={() => { }}
                                        >
                                            {i18n.translate('renew')}
                                        </ClayButton>


                                        <ClayButton
                                            displayType="secondary"
                                            className="px-3 rounded license-download-btn"
                                            disabled={expired}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onDownload(row);
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
                                key: 'isNewActivationKey',
                                noWrap: true,
                                render: (
                                    isNewActivationKey,
                                    { licenseType }: { licenseType: string }
                                ) => (
                                    <LicenseTitleHeader
                                        isNewActivationKey={isNewActivationKey}
                                        title={licenseType.toLowerCase()}
                                    />
                                ),
                                title: (
                                    <TitleSubtitleHeader
                                        title="Activation Key"
                                    />
                                ),
                            },
                            {
                                bodyClass: 'border-0 cursor-pointer',
                                key: 'domain',
                                render: (domain) => (
                                    <TitleSubtitleHeader
                                        subtitle={domain || '-'}
                                        title={keyType}
                                    />
                                ),
                                title: (
                                    <TitleSubtitleHeader
                                        title="Domain"
                                    />
                                ),
                            },
                            {
                                bodyClass: 'border-0 cursor-pointer',
                                key: 'startDate',
                                render: (startDate, { expirationDate }) => (
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
                                                    new Date(expirationDate),
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
                                render: (_, { active, expirationDate }) => {
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
                            onDeltaChange: (pageSize: number) => setPageSize(pageSize),
                            onPageChange: (page: number) => setPage(page),
                            totalItems: rows.length,
                        }}
                        rows={rows}
                    />
                ) : (
                    <DashboardEmptyTable
                        description1={i18n.translate(
                            'create-new-licenses-and-they-will-show-up-here'
                        )}
                        icon="bookmarks"
                        title={i18n.translate('no-licenses-yet')}
                    >
                        <ClayTooltipProvider>
                            <Link
                                className={classNames('btn btn-primary mt-4', {
                                    disabled: orderStatusIsNotCompleted,
                                })}
                                data-tooltip-align="bottom"
                                title={
                                    orderStatusIsNotCompleted
                                        ? i18n.translate(
                                            'the-order-must-be-completed-before-licensing-this-app.'
                                        )
                                        : undefined
                                }
                                to={`/order/${orderId}/create-license`}
                            >
                                {i18n.translate('create-license-key')}
                            </Link>
                        </ClayTooltipProvider>
                    </DashboardEmptyTable>
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
