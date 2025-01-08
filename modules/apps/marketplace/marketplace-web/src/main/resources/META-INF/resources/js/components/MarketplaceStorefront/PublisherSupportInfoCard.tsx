/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import React, {ReactNode} from 'react';

type PublisherSupportInfoCardProps = {
	symbol?: string;
	title?: string;
	urlImage?: string;
	value: ReactNode | string;
};

export default function PublisherSupportInfoCard({
	symbol = 'cog',
	title,
	urlImage,
	value,
}: PublisherSupportInfoCardProps) {
	if (!value) {
		return null;
	}

	const HeadingComponent = typeof value === 'string' ? 'h3' : React.Fragment;

	return (
		<div className="align-items-center d-flex flex-row mb-4">
			<span className="align-items-center d-flex justify-content-center modal-icon mr-3 rounded-circle">
				{urlImage ? (
					<img
						alt="Catalog Thumbnail"
						className="catalog-icon rounded-circle"
						draggable={false}
						src={urlImage}
					/>
				) : (
					<ClayIcon symbol={symbol} />
				)}
			</span>

			<div className="d-flex flex-column">
				{title && <span className="text-black-50">{title}</span>}

				<HeadingComponent>{value}</HeadingComponent>
			</div>
		</div>
	);
}
