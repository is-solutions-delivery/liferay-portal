/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from "@clayui/loading-indicator";
import React from "react";

import usePurchase from '../hooks/usePurchase';
import { CartItems, Product } from "../types";
import { AppView } from './MarketplaceAppsModal';
import ProductHeader from "./ProductHeader";

type InstallationProsp = {
    marketplaceConfigData: any
    product: Product;
    projectId: string;
    setStep: React.Dispatch<number>;
}

type InstallationContentProps = { installationContent: any; }

const InstallationContent: React.FC<InstallationContentProps> = ({ installationContent }) => {
    return (
        <div className="align-items-center d-flex flex-column justify-content-center" >
            <span className="h1 mb-5">
                {installationContent.title}
            </span>

            {installationContent.bodyContent}

            {installationContent.footer}
        </div>
    )
}

const Installation: React.FC<InstallationProsp> = ({
    marketplaceConfigData,
    product,
    projectId,
    setStep,
}) => {

    const cartItem: CartItems = [{
        productId: product.productId,
        quantity: 1,
        skuId: product.skus[0]?.id
    }]

    const { createCart, loading } = usePurchase({
        accountId: marketplaceConfigData.accountId,
        marketplaceConfigData,
    })

    const installationContent = {
        insuficientResources: {
            bodyContent: (
                <p>
                    Klabindw project does not meet the necessary resource requirements for this app. Please contact sales support to request additional resources.
                </p>
            ),
            footer: (
                <div className='d-flex justify-content-between w-100'>
                    <ClayButton borderless displayType="unstyled" onClick={
                        () => setStep(AppView.LIST)
                    }>
                        Cancel
                    </ClayButton>

                    <ClayButton borderless>
                        Contact Support
                    </ClayButton>
                </div>
            ),
            title: "Insufficient Resources"
        },
        loading: {
            bodyContent: (
                <div className="align-items-center d-flex flex-column pt-4">
                    {loading ? (
                        <>
                            <ClayLoadingIndicator
                                displayType="primary"
                                shape="squares"
                                size="lg"
                            />

                            <p className="mt-5 text-center">
                                The installation process is ongoing and may take some time.... Navigating to other sections will not cancel the process.
                            </p>
                        </>
                    ) : (
                        <div className='align-items-center d-flex flex-column justify-content-center'>
                            <div className='mb-6'>
                                {product?.urlImage ? (
                                    <img
                                        alt="App Icon"
                                        className="object-fit-cover rounded"
                                        height="84px"
                                        src={product?.urlImage}
                                        width="84px"
                                    />
                                ) : (
                                    <ClayIcon symbol="picture" />
                                )}
                            </div>

                            <p className='mb-4'>Click the install button to confirm the installation of the app.</p>
                        </div>
                    )
                    }
                </div>
            ),
            footer: (
                <div className='d-flex justify-content-between w-100'>
                    <ClayButton borderless displayType="unstyled" onClick={
                        () => setStep(AppView.LIST)
                    }>
                        Cancel
                    </ClayButton>

                    {!loading && (

                        <ClayButton displayType="primary" onClick={() => createCart(cartItem)}>
                            Confirm Installation
                        </ClayButton>
                    )}
                </div>
            ),
            title: "Installation in Progress",
        },
        noProject: {
            bodyContent: (
                <p className='text-red'>
                    You currently do not have access to any Cloud Projects. Please login as a user that has access to a project or contact your project administrator to add you to a project.
                </p>
            ),
            footer: (
                <div className='d-flex justify-content-between w-100'>
                    <ClayButton borderless displayType="unstyled" onClick={
                        () => setStep(AppView.LIST)
                    }>
                        Cancel
                    </ClayButton>

                    <ClayButton borderless>
                        Contact Support
                    </ClayButton>
                </div>
            ),
            title: "No Cloud Project Available",
        },
    }

    return (
        <>
            <div className="bg-light border d-flex flex-column m-4 rounded-lg">
                <ProductHeader product={product} projectId={projectId} />
            </div>

            <div className="installation-modal-content m-4 p-5 rounded-lg">
                <InstallationContent installationContent={installationContent["loading"]} />
            </div>
        </>
    )
}


export default Installation