/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import ClayModal, { useModal } from '@clayui/modal';
import React from 'react';

import { Product } from '../types';
import { getProductSpecification } from '../util';


type PublisherSupportModalProps = {
    onClose: () => void;
    product: Product;
};

const PublisherSupportModal = ({
    onClose,
    product,
}: PublisherSupportModalProps) => {

    const publisherWebsiteUrl = getProductSpecification(
        product,
        'publisherwebsiteurl'
    );

    const supportemailaddress = getProductSpecification(
        product,
        'supportemailaddress'
    );

    const supportphone = getProductSpecification(product, 'supportphone');

    const { observer } = useModal({ onClose });

    return (
        <ClayModal center observer={observer} size="lg">
            <ClayModal.Header>
                {Liferay.Language.get('publisher-support-contact-info')}
            </ClayModal.Header>

            <ClayModal.Body>
                <div className="p-3">
                    {product.catalogName && (
                        <div className="align-items-center d-flex flex-row mb-4">
                            <span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
                                {product.urlImage ? (
                                    <img
                                        alt="Catalog Thumbnail"
                                        className="catalog-icon rounded-circle"
                                        draggable={false}
                                        src={product.urlImage}
                                    />
                                ) : (
                                    <ClayIcon symbol="picture" />
                                )}
                            </span>

                            <div className="d-flex flex-column">
                                <h3>{product.catalogName}</h3>
                            </div>
                        </div>
                    )}

                    {publisherWebsiteUrl?.value && (
                        <div className="align-items-center d-flex flex-row mb-4">
                            <span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
                                <ClayIcon symbol="globe" />
                            </span>

                            <div className="d-flex flex-column">
                                <span className="text-black-50">
                                    {Liferay.Language.get(
                                        'publisher-support-url'
                                    )}
                                </span>

                                <a
                                    className="modal-link"
                                    href={publisherWebsiteUrl?.value}
                                    target="_blank"
                                >
                                    {publisherWebsiteUrl?.value}
                                </a>
                            </div>
                        </div>
                    )}


                    {supportemailaddress?.value && (
                        <div className="align-items-center d-flex flex-row mb-4">
                            <span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
                                <ClayIcon symbol="envelope-closed" />
                            </span>

                            <div className="d-flex flex-column">
                                <span className="text-black-50">
                                    {Liferay.Language.get('support-email')}
                                </span>

                                <a
                                    className="modal-link"
                                    href={`mailto:${supportemailaddress?.value}`}
                                    target="_blank"
                                >
                                    {supportemailaddress?.value}
                                </a>
                            </div>
                        </div>
                    )}


                    {supportphone?.value && (
                        <div className="align-items-center d-flex flex-row mb-4">
                            <span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
                                <ClayIcon symbol="phone" />
                            </span>

                            <div className="d-flex flex-column">
                                <span className="text-black-50">
                                    {Liferay.Language.get('phone')}
                                </span>

                                <a
                                    className="modal-link"
                                    href={`tel:${supportphone.value}`}
                                    target="_blank"
                                >
                                    {supportphone.value}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </ClayModal.Body>
        </ClayModal>
    );
};

export default PublisherSupportModal