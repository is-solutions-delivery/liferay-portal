/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { PageRenderer } from "../../../components/Page";
import { DetailedCard } from '../../../components/DetailedCard/DetailedCard';
import i18n from '../../../i18n';
import useGetProductByOrderId from '../../../hooks/useGetProductByOrderId';
import OrderDetailsHeader from '../../CustomerDashboard/components/OrderDetailsHeader';
import AppDropdownActions from '../../CustomerDashboard/pages/Apps/App/AppDropdownActions/AppDropdownActions';
import DropDown from '@clayui/drop-down';
import { getProductPriceModel, getProductSpecificationValue, isCloudProduct } from '../../../utils/productUtils';
import { ProductSpecificationKey } from '../../../enums/Product';
import QATable, { Orientation } from '../../../components/QATable';
import usePlacedOrder from '../hooks/usePlacedOrder';
import { formatDate } from '../../../utils/date';

const SSADetails = () => {
    const navigate = useNavigate()
    const { orderId } = useParams()
    const outletContext = useOutletContext();
    const { data, error, isLoading } = useGetProductByOrderId(orderId as string);

    const placedOrderItems = data?.placedOrder.placedOrderItems ?? [];
    const productCreatorAccountName = data?.product?.catalogName || '';

    const { product } = useOutletContext<any>();

    const { placedOrder } = usePlacedOrder(orderId as string);
    // console.log("🚀 ~ SSADetails ~ placedOrder:", placedOrder)

    const licenseType = getProductSpecificationValue(
        ProductSpecificationKey.APP_LICENSING_TYPE,
        product
    );
    console.log("PLACEDORDER", placedOrder?.customFields["trial-start-date"])

    const isCloud = isCloudProduct(product);
    const { isPaidApp } = getProductPriceModel(product);

    return (
        <>
            <PageRenderer
                className="app-details-header d-flex flex-column w-100"
                error={error}
                isLoading={isLoading}
            >
                <Link
                    className="align-items-center d-flex text-dark"
                    onClick={() => navigate('..')}
                    to={"../"}
                >
                    <ClayIcon className="mr-2" symbol="order-arrow-left" />

                    <span className="h5 mt-1">Back to the list</span>
                </Link>

                <div className="d-flex justify-content-between">
                    <OrderDetailsHeader
                        className="d-flex flex-row justify-content-between pb-3 pt-5"
                        hasOrderDetails
                        image={placedOrderItems[0]?.thumbnail}
                        name={placedOrderItems[0]?.name}
                        order={data?.placedOrder as unknown as Cart}
                        productOwner={productCreatorAccountName}
                    />

                    <DropDown
                        className="align-items-center cursor-pointer d-flex h-100"
                        trigger={
                            <ClayButton displayType="secondary">
                                {i18n.translate('manage-trial')}

                                <ClayIcon
                                    className="ml-2"
                                    symbol="angle-down-small"
                                />
                            </ClayButton>
                        }
                    >
                        {data?.placedOrder && (
                            <AppDropdownActions placedOrder={data.placedOrder} />
                        )}
                    </DropDown>
                </div>

                <div className="app-details-page-container mt-6">
                    <div className="app-details-body-container d-flex justify-content-between">
                        <div className='col-6'>
                            <DetailedCard
                                cardIconAltText="Profile Icon"
                                cardTitle={i18n.translate('details')}
                                clayIcon="order-form-tag"
                            >
                                <span>
                                    <h5 className='mt-4'>General Info</h5>
                                    <hr className='my-0' />


                                    <QATable
                                        orientation={Orientation.VERTICAL}
                                        items={[
                                            {
                                                title: i18n.translate('account-name'),
                                                value: placedOrder?.account,
                                            }, {
                                                title: i18n.translate('created-by'),
                                                value: placedOrder?.author,
                                            }, {
                                                title: i18n.translate('license-type'),
                                                value: placedOrder?.orderType,
                                            },
                                        ]}
                                    />
                                </span>

                                <span>
                                    <h5 className='mt-4'>General Info</h5>
                                    <hr className='my-0' />

                                    <QATable
                                        orientation={Orientation.VERTICAL}
                                        items={[
                                            {
                                                title: i18n.translate('order-id'),
                                                value: placedOrder?.id
                                            }, {
                                                title: i18n.translate('order-date'),
                                                value: placedOrder && formatDate(placedOrder?.createDate as string),
                                            },
                                        ]}
                                    />
                                </span>
                            </DetailedCard>
                        </div>

                        <div className='col-6'>
                            <DetailedCard
                                cardIconAltText="Profile Icon"
                                cardTitle={i18n.translate('ssa-trial-summary')}
                                clayIcon="order-form-tag"
                            >
                                <span>
                                    <h5 className='mt-4'>Trial Info</h5>
                                    <hr className='my-0' />

                                    <QATable
                                        orientation={Orientation.VERTICAL}
                                        items={[
                                            {
                                                title: i18n.translate('trial-start-date'),
                                                value: placedOrder && formatDate(placedOrder?.customFields["trial-start-date"] as string),
                                            },
                                            {
                                                title: i18n.translate('trial-end-date'),
                                                value: placedOrder && formatDate(placedOrder?.customFields["trial-end-date"] as string),
                                            },
                                            {
                                                title: i18n.translate('trial-status'),
                                                value: '',
                                            },
                                            {
                                                title: i18n.translate('extension-status'),
                                                value: '',
                                            },
                                        ]}
                                    />
                                </span>

                                <span>
                                    <h5 className='mt-4'>{i18n.translate("trial-description")}</h5>
                                    <hr className='my-0' />


                                    <h5 className='mt-4'>{i18n.translate("description")}</h5>

                                </span>
                            </DetailedCard>
                        </div>
                    </div>
                </div>


            </PageRenderer>
        </>
    );
}
export default SSADetails;