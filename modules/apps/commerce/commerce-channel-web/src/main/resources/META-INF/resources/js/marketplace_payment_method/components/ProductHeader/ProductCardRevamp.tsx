/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from "@clayui/icon";
import ClaySticker from "@clayui/sticker";
import React, { ReactNode } from "react";


type ProductCardPropsRevamp = {
    children?: ReactNode;
    icon: string;
    projectId: string,
    rightNode?: ReactNode;
    subsectionImageRight: string,
    subsectionTitleLeft: string,
    subsectionTitleRight: string,
    subsectionValueLeft: string,
    subtitle?: string | ReactNode;
    title: string;
};

const ProductCardRevamp = ({
    children,
    icon,
    projectId,
    rightNode,
    subsectionImageRight,
    subsectionTitleLeft,
    subsectionTitleRight,
    subsectionValueLeft,
    subtitle,
    title,
}: ProductCardPropsRevamp) => {
    const HeadingComponent = title.length > 30 ? 'h3' : 'h1';

    return (
        <div className="p-4 product-banner">
            <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-row">
                    <img
                        alt="App Icon"
                        className="object-fit-cover rounded"
                        height="64px"
                        src={icon}
                        width="64px"
                    />

                    <div className="align-items-center ml-4">
                        <HeadingComponent className="product-banner-title text-weight-bold">
                            {title}
                        </HeadingComponent>

                        <span className="sub-text">{subtitle}</span>
                    </div>
                </div>

                {rightNode}
            </div>

            {children}

            <hr />

            <div className="d-flex flex-row justify-content-between">
                <strong className="account-banner-title-text align-self-center">
                    {subsectionTitleLeft}
                </strong>

                {subsectionValueLeft}

                <div className="align-items-center d-flex">
                    <div className="account-banner-name-text align-items-end d-flex flex-column m-2">
                        <strong>{subsectionTitleRight}</strong>

                        <div className="account-banner-email-text">
                            {projectId}
                        </div>
                    </div>

                    <ClaySticker displayType="light" shape="circle" size="sm">
                        {subsectionImageRight ? (
                            <ClaySticker.Image
                                alt="placeholder"
                                height="24"
                                src={subsectionImageRight}
                                width="24"
                            />
                        ) : (
                            <ClayIcon symbol="picture" />
                        )}
                    </ClaySticker>
                </div>


            </div>
        </div>
    );
};
export default ProductCardRevamp