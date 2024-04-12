/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

interface IAnalytics {
	track: (key: string, data: unknown) => void;
}

declare global {
	interface Window {
		Analytics: IAnalytics;
	}
}

export const LiferayAnalytics = window.Analytics || {
	// eslint-disable-next-line no-console
	track: (key, data) => console.debug(`Track Event '${key}'`, data),
};

export class Analytics {
	public static track(key: string, data: unknown) {
		LiferayAnalytics.track(key, data);
	}
}
