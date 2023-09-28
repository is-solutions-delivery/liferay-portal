/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {months} from './getMonths';

const MILLISECONDS_IN_30_DAYS = 30 * 24 * 60 * 60 * 1000;

export function calculateTrialTime() {
	const date = new Date();

	date.setTime(date.getTime() + MILLISECONDS_IN_30_DAYS);

	const endOfTrialDay = date.getDate();
	const endOfTrialMonth = months[date.getMonth()];

	return {
		endOfTrialDay,
		endOfTrialMonth,
	};
}
