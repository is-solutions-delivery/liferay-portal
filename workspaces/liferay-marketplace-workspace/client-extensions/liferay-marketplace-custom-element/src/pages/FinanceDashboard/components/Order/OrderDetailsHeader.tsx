/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Button from '@clayui/button';
import BackLink from '../../../../components/BackLink';
import i18n from '../../../../i18n';
import {PaymentStatus as PaymentStatusCode} from '../../../../enums/Order';
import PaymentStatus from './PaymentStatus/PaymentStatus';

type OrderDetailsHeaderProps = {
	orderId: string;
	paymentStatusCode: number;
};

const OrderDetailsHeader = ({
	orderId,
	paymentStatusCode,
}: OrderDetailsHeaderProps) => {
	return (
		<div className="d-flex justify-content-between align-items-center">
			<div>
				<BackLink>
					{i18n.translate('back-to-last-transaction')}
				</BackLink>

				<h2>{orderId}</h2>

				{<PaymentStatus paymentStatus={paymentStatusCode} />}
			</div>

			{(paymentStatusCode === PaymentStatusCode.PAYMENT_PENDING ||
				paymentStatusCode === PaymentStatusCode.PENDING) && (
				<Button displayType="secondary">
					{i18n.translate('mark-as-paid')}
				</Button>
			)}
		</div>
	);
};

export default OrderDetailsHeader;
