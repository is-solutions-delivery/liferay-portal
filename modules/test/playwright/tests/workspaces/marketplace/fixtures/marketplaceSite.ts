/* eslint-disable no-console */
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../../../fixtures/apiHelpersTest';
import {loginTest} from '../../../../fixtures/loginTest';

export const test = mergeTests(apiHelpersTest, loginTest({screenName: 'test'}));

export interface Marketplace {
	marketplace: Site;
}

const SITE_EXTERNAL_REFERENCE_CODE = 'marketplace-site-initializer';
const TEMPLATE_KEY = 'com.liferay.site.initializer.liferay.marketplace';
const SITE_NAME = 'Marketplace';

export const marketplaceSiteFixture = test.extend<Marketplace>({
	marketplace: [
		async ({apiHelpers, page}, use) => {
			let site = await apiHelpers.headlessSite.getSiteByERC(
				SITE_EXTERNAL_REFERENCE_CODE
			);

			console.log(1, 'Site', site);

			if ((site as any).status === 'NOT_FOUND') {
				await page.goto(
					'/group/guest/~/control_panel/manage/-/sites/sites'
				);

				await page.getByRole('link', {name: 'Add Site'}).click();

				await page.waitForLoadState('networkidle');

				await page
					.getByRole('button', {
						name: 'Select Template: Liferay Marketplace',
					})
					.click();

				await page.waitForTimeout(1000);

				await page
					.frameLocator('iframe[title="Add Site"]')
					.getByLabel('Name\n\n\t\t\t\n\t\t\t\t\n\n\t\t\t\tRequired')
					.fill('Marketplace');

				await page
					.frameLocator('iframe[title="Add Site"]')
					.getByRole('button', {name: 'Add'})
					.click();

				await page.waitForTimeout(120000);

				// site = await apiHelpers.headlessSite.createSite(SITE_NAME, {
				// 	externalReferenceCode: SITE_EXTERNAL_REFERENCE_CODE,
				// 	templateKey: TEMPLATE_KEY,
				// 	templateType: 'site-initializer',
				// });
			}

			console.log(2, 'Site', site);

			// expect(site.name).toBe(SITE_NAME);
			// expect(site.id).toBeGreaterThan(0);

			// await page.goto(`web${site.friendlyUrlPath}`);

			use(site);
		},
		{auto: true},
	],
});
