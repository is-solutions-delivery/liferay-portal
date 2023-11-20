/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import './DashboardEmptyTable.scss';

import ClayButton from '@clayui/button';
import {useNavigate} from 'react-router-dom';

export function DashboardEmptyTable({
	button,
	buttonName,
	description1,
	description2,
	icon,
	orderId,
	title,
}: {
	button?: boolean;
	buttonName?: string;
	description1: string;
	description2?: string;
	icon: string;
	orderId?: string;
	title: string;
}) {
	const navigate = useNavigate();

	return (
		<div className="dashboard-empty-state py-6">
			<div className="dashboard-empty-state-background">
				<img
					alt={title}
					className="dashboard-empty-state-image"
					src={icon}
				/>
			</div>

			<div className="dashboard-empty-state-title">{title}</div>

			<div className="dashboard-empty-state-description">
				{description1 && (
					<span className="dashboard-empty-state-description-first">
						{description1}
					</span>
				)}

				{description2 && <span> {description2}</span>}
			</div>
			<div>
				{button && (
					<ClayButton
						className="dashboard-empty-state-button mt-3"
						onClick={() => {
							navigate(`/order/${orderId}/create-license`);
						}}
					>
						{buttonName}
					</ClayButton>
				)}
			</div>
		</div>
	);
}
