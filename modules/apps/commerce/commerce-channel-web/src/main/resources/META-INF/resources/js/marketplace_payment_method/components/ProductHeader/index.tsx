/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from "react";

import { getProductSpecification, getRequiredLabel } from "../../util";
import ProductCardRevamp from "./ProductCardRevamp";

type ProductHeaderProps = {
    product: any;
    projectId: string
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
    product,
    projectId,
}) => {

    const productCreatorAccountName = product?.catalogName || '';

    const latestVersion = getProductSpecification(
        product,
        'latest-version'
    );

    return (
        <ProductCardRevamp
            icon={product?.urlImage}
            projectId={projectId}
            rightNode={
                <div className="align-items-end d-flex flex-column price-text">
                    <strong className="mr-1">Price</strong>

                    <div className="license-tag px-2">
                        {getRequiredLabel(product)}
                    </div>
                </div>
            }
            subsectionImageRight=""
            subsectionTitleLeft="Project Selection"
            subsectionTitleRight={product?.catalogName}
            subsectionValueLeft=""
            subtitle={
                latestVersion
                    ? `${latestVersion} by ${productCreatorAccountName} `
                    : productCreatorAccountName
            }
            title={product.name} />
    );
};

export default ProductHeader;
