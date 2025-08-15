/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

(function () {
	function onElementReady(CSSselector, callbackFunction) {
		const elementSelector = document.querySelector(CSSselector);

		if (elementSelector) {
			return callbackFunction(elementSelector);
		}

		const mutationObserver = new MutationObserver(() => {
			const foundElement = document.querySelector(CSSselector);

			if (foundElement) {
				mutationObserver.disconnect();
				callbackFunction(foundElement);
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

			const buildUrl = () => {
				const inputValue = input.value.trim();

				if (!inputValue) {
					return null;
				}

				const params = new URLSearchParams();

				params.set('q', inputValue);
				params.append('resource-type', '35456023');
				params.append('resource-type', '35458322');
				params.append('resource-type', '35456026');

				return `/search?${params.toString()}`;
			};

			const navigate = (url) => {
				if (!url) {
					return;
				}

				if (searchButton) {
					searchButton.href = url;
					searchButton.click();

					return;
				}

				if (window.Liferay?.SPA?.app) {
					window.Liferay.SPA.app.navigate(url);
				}
				else {
					window.location.href = url;
				}
			};

			const syncHref = () => {
				if (searchButton) {
					searchButton.href = buildUrl() || '#';
				}
			};
			input.addEventListener('input', syncHref);
			syncHref();

			const form = input.closest('form');

			if (form) {
				form.addEventListener(
					'submit',
					(event) => {
						event.preventDefault();
						event.stopPropagation();
						event.stopImmediatePropagation();
						navigate(buildUrl());

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
						navigate(buildUrl());
					}
				},
				true
			);
		});
	});
})();
