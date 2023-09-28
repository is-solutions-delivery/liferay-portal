/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable react/no-unescaped-entities */

interface TrialTimelineProps {
	sku?: SKU[];
}

export function TrialTimeline({ sku }: TrialTimelineProps) {
	return (
		<div className="trial-timeline">
			<p className="mb-2 trial-info">
				Need help with license calculations?
				<span className="info-button">More Info</span>
			</p>
		</div>
	);
}
