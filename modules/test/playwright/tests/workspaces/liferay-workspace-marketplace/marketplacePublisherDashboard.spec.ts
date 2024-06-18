/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataApiHelpersTest} from '../../../fixtures/dataApiHelpersTest';
import {clickAndExpectToBeVisible} from '../../../utils/clickAndExpectToBeVisible';
import {getRandomInt} from '../../../utils/getRandomInt';
import {marketplacePagesTest} from './fixtures/marketplacePages';
import {marketplaceSiteFixture} from './fixtures/marketplaceSite';
import {PublishProductPayload} from './types';
import {products, solutions} from './utils/constants';

export const test = mergeTests(
	dataApiHelpersTest,
	marketplaceSiteFixture,
	marketplacePagesTest
);

const ACCOUNT_NAME = `Supplier Account ${getRandomInt()}`;
const SOLUTION_PUBLISHER_ROLE = 'Solution Publisher';

test.describe('Can Publish and Manage Solutions', () => {
	let _appName;
	let _catalog;
	let _supplierAccount;

	test.beforeEach(
		async ({apiHelpers, marketplace, publisherSolutionPage}) => {
			const account = await apiHelpers.headlessAdminUser.postAccount({
				name: ACCOUNT_NAME,
				type: 'supplier',
			});

			_supplierAccount = account.id;

			const user =
				await apiHelpers.headlessAdminUser.getUserAccountByEmailAddress(
					'test@liferay.com'
				);

			await apiHelpers.headlessAdminUser.assignUserToAccountByEmailAddress(
				account.id,
				['test@liferay.com']
			);

			const rolesResponse =
				await apiHelpers.headlessAdminUser.getAccountRoles(account.id);

			const accountSupplierRole = rolesResponse?.items?.filter((role) => {
				return role.name === SOLUTION_PUBLISHER_ROLE;
			});

			await apiHelpers.headlessAdminUser.assignUserToAccountRole(
				account.id,
				accountSupplierRole[0].id,
				user.id
			);

			const catalog =
				await apiHelpers.headlessCommerceAdminCatalog.postCatalog({
					accountId: account.id,
				});

			_catalog = catalog.id;

			await publisherSolutionPage.goto(
				`web${marketplace.friendlyUrlPath}/publisher-dashboard#/solutions`
			);
		}
	);

	test.afterEach(async ({apiHelpers}) => {
		const getProductResponse =
			await apiHelpers.headlessCommerceAdminCatalog.getProducts(
				new URLSearchParams({
					filter: `name eq '${_appName}'`,
				})
			);

		await apiHelpers.headlessCommerceAdminCatalog.deleteProduct(
			getProductResponse.items[0]?.productId
		);

		await apiHelpers.headlessAdminUser.deleteAccount(_supplierAccount);

		await apiHelpers.headlessCommerceAdminCatalog.deleteCatalog(_catalog);
	});

	test('LPD-26707 New Solution Template button should be visible for Suppliers', async ({
		publisherSolutionPage,
	}) => {
		await expect(publisherSolutionPage.newSolutionButton).toBeEnabled();
	});

	for (const key of Object.keys(solutions)) {
		const solution = solutions[key as keyof typeof solutions];

		test(`LPD-26707 can publish solution "${solution.profile.name}" template`, async ({
			marketplace,
			page,
			publisherSolutionPage,
		}) => {
			_appName = solution.profile.name;

			await publisherSolutionPage.goto(
				`web${marketplace.friendlyUrlPath}/publisher-dashboard#/solutions`
			);
			await publisherSolutionPage.goToNewSolution();
			await publisherSolutionPage.goToDefineSolutionProfile();
			await publisherSolutionPage.fillDefineSolutionProfile(
				solution.profile
			);

			await expect(publisherSolutionPage.continueButton).toBeEnabled();

			await publisherSolutionPage.goToCustomizeSolutionHeader();
			await publisherSolutionPage.fillCustomizeSolutionHeader(
				solution.header
			);

			await expect(publisherSolutionPage.continueButton).toBeEnabled();

			await publisherSolutionPage.goToCustomizeSolutionDetails();
			await publisherSolutionPage.fillCustomizeSolutionDetails(
				solution.details
			);

			await expect(publisherSolutionPage.continueButton).toBeEnabled();
			await publisherSolutionPage.goToCompanyProfile();
			await publisherSolutionPage.fillCompanyProfile(
				solution.companyProfile
			);

			await expect(publisherSolutionPage.continueButton).toBeEnabled();
			await publisherSolutionPage.goToContactUs();
			await publisherSolutionPage.emailInput.fill('test@example.com');

			await expect(publisherSolutionPage.continueButton).toBeEnabled();

			await clickAndExpectToBeVisible({
				target: publisherSolutionPage.reviewAndSubmitTitle,
				trigger: publisherSolutionPage.continueButton,
			});

			await publisherSolutionPage.reviewAndSubmit();

			await page
				.getByText(`Solution ${solution.profile.name} submitted`)
				.waitFor({state: 'visible'});

			await expect(
				page.getByText(solution.profile.name).last()
			).toBeVisible();

			await expect(
				publisherSolutionPage.underReviewStatus.last()
			).toBeVisible();
		});
	}

	test.describe('Can Publish Marketplace Apps', () => {
		for (const key of Object.keys(products)) {
			const product = products[key as keyof typeof products];

			test(`can publish "${product.name}"`, async ({
				apiHelpers,
				page,
				publisherAppPage,
				publisherDashboardPage,
			}) => {
				_appName = product.name;

				publisherAppPage.setPublishProduct(
					product as unknown as PublishProductPayload
				);

				// Go to Publisher Dashboard

				await publisherDashboardPage.goto();

				await publisherDashboardPage.gotoNewAppPage();

				// Publish the app

				await publisherAppPage.checkHeader({
					accountName: ACCOUNT_NAME,
					appName: product.name,
				});
				await publisherAppPage.continue();
				await publisherAppPage.fillProfile();
				await publisherAppPage.fillBuild();

				const createdProduct =
					await apiHelpers.headlessCommerceAdminCatalog.getProducts(
						new URLSearchParams({
							filter: `name eq '${product.name}'`,
						})
					);

				const productId = createdProduct.items[0].productId;

				const productVirtualSettings =
					await apiHelpers.headlessCommerceAdminCatalog.getProductVirtualSettings(
						productId
					);

				expect(
					productVirtualSettings.productVirtualSettingsFileEntries[0]
						.version === product.dxpVersions[0]
				).toBeTruthy();

				await publisherAppPage.fillStoreFront();
				await publisherAppPage.fillVersion();
				await publisherAppPage.fillPricing();
				await publisherAppPage.fillSupport();
				await publisherAppPage.reviewAndSubmit();

				expect(page.getByText(product.name)).toBeTruthy();
			});
		}
	});
});
