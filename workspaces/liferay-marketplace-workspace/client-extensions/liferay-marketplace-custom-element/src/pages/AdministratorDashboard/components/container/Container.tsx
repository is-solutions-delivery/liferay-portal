/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Icon from "@clayui/icon";
import { Link } from "react-router-dom";
import i18n from "../../../../i18n";

const Container = ({
    children,
    link = {path: '', visible: true},
    title,
}: {
    children: React.ReactNode;
    link: {path: string; visible?: boolean};
    title: string;
}) => (
    <>
        <div className="d-flex justify-content-between">
            <h3>{title}</h3>

            {link.visible && (
                <Link to={link.path}>
                    <span className="font-weight-bold">
                        {i18n.translate('view-all')}
                    </span>

                    <Icon className="ml-2" symbol="order-arrow-right" />
                </Link>
            )}
        </div>
        <div className="border mb-8 py-2 rounded-lg">{children}</div>
    </>
);

export default Container