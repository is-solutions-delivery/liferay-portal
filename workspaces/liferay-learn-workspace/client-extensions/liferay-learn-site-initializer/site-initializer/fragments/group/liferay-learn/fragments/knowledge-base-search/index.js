/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

(async function () {
	async function fetchTaxonomyCategoryIds() {
		const taxonomyCategoriesIds = [];
		try {
			const {id: taxonomyVocabularyId} = await Liferay.Util.fetch(
				`/o/headless-admin-taxonomy/v1.0/sites/${Liferay.ThemeDisplay.getCompanyId()}/taxonomy-vocabularies/by-external-reference-code/RESOURCE_TYPE?fields=id`
			).then((response) => response.json());

			const {items = []} = await Liferay.Util.fetch(
				`/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies/${taxonomyVocabularyId}/taxonomy-categories?fields=id%2CexternalReferenceCode`,
				'Failed to fetch categories'
			).then((response) => response.json());

			items.forEach((item) => {
				if (item.externalReferenceCode !== 'OFFICIAL_DOCUMENTATION') {
					taxonomyCategoriesIds.push(item.id);
				}
			});

			return taxonomyCategoriesIds;
		}
		catch (error) {
			console.error(error);

			return [];
		}
	}

	function onElementReady(selector, callbackFunction) {
		let element = document.querySelector(selector);

		if (element) {
			return callbackFunction(element);
		}

		const mutationObserver = new MutationObserver(() => {
			element = document.querySelector(selector);

			if (element) {
				mutationObserver.disconnect();
				callbackFunction(element);
			}
		});
		mutationObserver.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	}

	document.addEventListener('DOMContentLoaded', () => {
		const searchButton = document.querySelector('.search-button');

		onElementReady('.search-bar-keywords-input', (input) => {
			if (searchButton) {
				searchButton.classList.remove('hide');
			}

			const buildSearchURL = async () => {
				const categoryIds = await fetchTaxonomyCategoryIds();
				const searchInputValue = input.value.trim();
				const URLParams = new URLSearchParams();

				if (!searchInputValue) {
					return null;
				}
				URLParams.set('q', searchInputValue);
				categoryIds.forEach((id) =>
					URLParams.append('resource-type', id)
				);

				return `/search?${URLParams.toString()}`;
			};

			const navigateToSearchResults = async (urlPromise) => {
				const url = await urlPromise;

				if (searchButton) {
					searchButton.href = url;
					searchButton.click();

					return;
				}

				if (window.Liferay?.SPA?.app) {
					window.Liferay.SPA.app.navigateToSearchResults(url);
				}
				else {
					window.location.href = url;
				}
			};

			const updateSearchButtonUrl = async () => {
				if (searchButton) {
					searchButton.href = (await buildSearchURL()) || '#';
				}
			};

			input.addEventListener('input', updateSearchButtonUrl);
			updateSearchButtonUrl();

			const form = input.closest('form');
			if (form) {
				form.addEventListener(
					'submit',
					(event) => {
						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();
						navigateToSearchResults(buildSearchURL());

						return false;
					},
					true
				);
			}

			input.addEventListener(
				'keydown',
				(event) => {
					if (event.key === 'Enter' || event.keyCode === 13) {
						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();
						navigateToSearchResults(buildSearchURL());
					}
				},
				true
			);
		});
	});
})();
