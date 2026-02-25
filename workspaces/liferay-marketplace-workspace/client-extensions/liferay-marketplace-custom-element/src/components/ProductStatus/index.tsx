/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';

import './OrderStatus.scss';

type ProductStatus = {
    productStatus: string;
};

const ProdutctStatus = ({ productStatus }: ProductStatus) => {

    return (
        <>
            <ClayIcon
                className={classNames(
                    'mr-2 order-status-icon',
                    productStatus
                )}
                symbol="circle"
            />

            <span className="order-status-text text-captalize">{productStatus}</span>
        </>
    );
};

export default ProdutctStatus;
