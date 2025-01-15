/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayCard from '@clayui/card';
import classNames from 'classnames';
import React, {ReactNode} from 'react';

type StorefrontDetailsProps = {
	children: ReactNode;
	highlight?: boolean;
	title: string;
};

const StorefrontDetails: React.FC<StorefrontDetailsProps> = ({
	children,
	highlight,
	title,
}) => (
	<ClayCard className="mb-2 px-3">
		<ClayCard.Body>
			<ClayCard.Description
				className={classNames('text-uppercase', {
					'card-title-description pb-1': highlight,
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
				{children}
			</ClayCard.Description>
		</ClayCard.Body>
	</ClayCard>
);

export default StorefrontDetails;
