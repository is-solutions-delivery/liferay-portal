/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React from "react";



type CardProps = {
    buttons?: {
        href?: string;
        leftIcon?: string;
        onClick?: () => void;
        rightIcon?: string;
        text: string;
    }[];
    description?: any;
    isCommentCard?: boolean;
    title: string;
};

const DetailsCard: React.FC<CardProps> = ({
    buttons,
    description,
    isCommentCard,
    title,
}) => (
    <ClayCard className="mb-2 px-3">
        <ClayCard.Body>
            <ClayCard.Description
                className={classNames('text-uppercase', {
                    'card-title-description pb-1': isCommentCard,
                })}
                displayType="title"
            >
                {title}
            </ClayCard.Description>

            <ClayCard.Description
                className="mt-3"
                displayType="text"
                truncate={false}
            >
                {description}
            </ClayCard.Description>

            {buttons && (
                <div className="d-flex flex-wrap mt-2">
                    {buttons.map((button, index) => (
                        <div
                            className="align-items-center card-buttons d-flex w-100"
                            key={index}
                        >
                            {button.leftIcon && (
                                <ClayIcon
                                    className="mr-2"
                                    symbol={button.leftIcon}
                                />
                            )}

                            <a
                                className="align-items-center d-flex justify-content-between text-decoration-none text-reset w-100"
                                href={button.href}
                                onClick={button.onClick}
                                target="_blank"
                            >
                                <span className="text-truncate">
                                    {button.text}
                                </span>

                                {button.rightIcon && (
                                    <ClayIcon
                                        className="ml-2"
                                        symbol={button.rightIcon}
                                    />
                                )}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </ClayCard.Body>
    </ClayCard>
);

export default DetailsCard