/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const SEARCH_DELAY = 800;
const SEARCH_STORAGE_KEY = '@marketplace/search';

const categoriesListItems = document.querySelectorAll(
	'.search-dropdown-list-item'
);
const categoriesTrigger = document.querySelector('.categories-trigger');
let categorySelected = '';
const channelId = Liferay.CommerceContext.commerceChannelId;
const clearInputButton = document.querySelector('.clear-input-button');
let enterSelection;
let isDropdownExpanded = false;
let isResultsExpanded = false;
let isSearchExpanded = false;
const listSectionContainer = document.querySelectorAll(
	'.list-section-container'
);
const menu = document.querySelector('.marketplace-nav-menu-container');
const navContainerFull = document.querySelector('.search-nav-container-full');
const overlay = document.querySelector('.results-overlay');
const recentSearchesListContainer = document.querySelector(
	'.recent-searches-list-container'
);
const results = document.querySelector('.results');
let resultsItemsList = document.querySelectorAll('.results-items-list');
const search = document.querySelector('.search');
const searchContainer = document.querySelector('.marketplace-search-container');
const searchDropdownMenuContainer = document.querySelector(
	'.search-dropdown-menu-container'
);
const searchDropdownTrigger = document.querySelector(
	'.search-dropdown-trigger'
);

const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const searchResultsContainer = document.querySelector(
	'.search-results-container'
);

let searchTimeout = null;

const pathThemeImages = Liferay.ThemeDisplay.getPathThemeImages();
const spritemap = `${pathThemeImages}/clay/icons.svg`;

const searchStorage = {
	clearRecentSearchItems() {
		localStorage.removeItem(SEARCH_STORAGE_KEY);
	},

	deleteRecentSearch(search) {
		const searchItems = searchStorage
			.getRecentSearchItems()
			.filter((term) => term !== search);

		localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(searchItems));
	},

	getRecentSearchItems() {
		return JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEY)) || [];
	},

	saveSearchTerm(term) {
		term = term.trim();

		if (!term) {
			return;
		}

		const searchItems =
			JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEY)) || [];

		const searchItemsLimited = [
			term,
			...searchItems.filter(
				(item) => item.toLowerCase() !== term.toLowerCase()
			),
		].slice(0, 5);

		localStorage.setItem(
			SEARCH_STORAGE_KEY,
			JSON.stringify(searchItemsLimited)
		);
	},
};

const windowBehavior = {
	lockScroll() {
		const scrollBarWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = `${scrollBarWidth}px`;
		document.body.style.overflow = 'hidden';
	},

	unlockScroll() {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	},
};

function selectCategory(category) {
	const currentUrl = window.location.href;
	const url = new URL(currentUrl);

	categoriesListItems.forEach((item) => {
		item.classList.remove('selected');
	});

	categoriesListItems.forEach((item) => {
		if (item.dataset.category === category) {
			item.classList.add('selected');
		}
	});

	if (category === 'All Categories') {
		url.searchParams.delete('type');
		categoriesTrigger.textContent = 'All Categories';
		searchInput.focus();
		window.history.replaceState({}, '', url.toString());
		categorySelected = category;

		return;
	}

	if (category && category !== 'All Categories') {
		categoriesTrigger.textContent = category;
		url.searchParams.set('type', category);
	}
	else {
		url.searchParams.delete('type');
	}

	if (search.classList.contains('expanded')) {
		searchInput.focus();

		results.classList.add('expand');
		searchDropdownMenuContainer.classList.remove('expand');
		isDropdownExpanded = false;
		isResultsExpanded = true;
	}

	window.history.replaceState({}, '', url.toString());
	categorySelected = category;
}

function removeAllQueryParams(url) {
	const urlObj = new URL(url, window.location.origin);
	urlObj.search = '';

	return urlObj.toString();
}

function displayFeedbackAlert(text) {
	const searchInfoPanel = document.createElement('div');
	searchInfoPanel.className =
		'search-info-panel d-flex align-items-center justify-content-between p-4';

	searchInfoPanel.classList.add('expanded');

	const searchInfoPanelContainer = document.createElement('div');
	searchInfoPanelContainer.className =
		'container-fluid container-fluid-max-xl justify-content-between d-flex';

	const searchInfoPanelTextContainer = document.createElement('div');
	searchInfoPanelTextContainer.className = 'd-flex align-items-center';
	searchInfoPanelTextContainer.innerHTML = text;
	searchInfoPanelContainer.appendChild(searchInfoPanelTextContainer);

	const closeInfoButton = document.createElement('button');
	closeInfoButton.className = 'btn btn-sm border-0 bg-transparent text-muted';
	closeInfoButton.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-times" style="width:14px;height:14px;">
                <use href="${spritemap}#times"></use>
            </svg>
        `;
	closeInfoButton.style.cursor = 'pointer';

	closeInfoButton.addEventListener('click', (event) => {
		event.stopPropagation();
		const currentUrl = window.location.href;
		const url = new URL(currentUrl);
		const clearUrl = removeAllQueryParams(url);

		searchInfoPanel.classList.remove('expanded');
		navContainerFull.classList.remove('expanded');
		searchInput.value = '';
		window.history.replaceState({}, '', clearUrl);
	});

	searchInfoPanel.appendChild(searchInfoPanelContainer);
	searchInfoPanelContainer.appendChild(closeInfoButton);

	navContainerFull.appendChild(searchInfoPanel);
	navContainerFull.classList.add('expanded');
}

function expandSearchContainer() {
	isSearchExpanded = true;
	menu.classList.add('hidden');

	renderRecentSearches();

	windowBehavior.lockScroll();

	setTimeout(() => {
		searchIcon.classList.add('expanded');
		searchContainer.classList.add('expand');
		setTimeout(() => {
			results.classList.add('expand');
			overlay.classList.add('active');
			searchInput.focus();
		}, 300);
	}, 100);
}

function collapseSearchContainer() {
	isSearchExpanded = false;
	overlay.classList.remove('active');
	results.classList.remove('expand');

	setTimeout(() => {
		searchInput.value = '';
		searchDropdownMenuContainer.classList.remove('expand');
		searchContainer.classList.remove('expand');
		searchIcon.classList.remove('expanded');

		windowBehavior.unlockScroll();

		setTimeout(() => {
			menu.classList.remove('hidden');
		}, 300);
	}, 300);
}

async function getProducts(category, search) {
	const hasFilter = category && category !== 'All Categories';

	const searchParams = new URLSearchParams({
		...(hasFilter && {
			filter: `categoryNames/any(x:(x eq '${category}'))`,
		}),
		...(search && {
			search: encodeURIComponent(search),
		}),
		'accountId': '-1',
		'images.accountId': '-1',
		'nestedFields': 'categories,productSpecifications,images',
		'pageSize': 12,
	});

	const response = await Liferay.Util.fetch(
		`/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?${searchParams.toString()}`
	);

	return response.json();
}

async function fetchSearchResults(category, search) {
	const trimmedSearch = search.trim();

	if (!trimmedSearch) {
		searchResultsContainer.innerHTML = '';
		searchResultsContainer.style.display = 'none';

		return;
	}

	const response = await getProducts(category, trimmedSearch);

	const items = response.items || [];

	if (!items.length) {
		return noResultsFound(trimmedSearch);
	}

	searchStorage.saveSearchTerm(trimmedSearch);

	const resultsList = document.createElement('ul');
	resultsList.className = 'recent-searches-list w-100';

	const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');

	for (const product of items) {
		const highlightedName = product.name.replace(
			searchRegex,
			'<mark>$1</mark>'
		);

		const listItem = document.createElement('li');

		listItem.className = 'w-100 results-items-list';
		listItem.innerHTML = `
            <a class="border-radius-medium d-flex flex-row mb-0 text-dark text-decoration-none align-items-center"
                href="/web/marketplace/p/${product.slug}" target="_self">
                <div class="image-container mr-2 rounded">
                    <img alt="${
						product.name
					}" class="app-search-bar-image" draggable="false" height="56"
                        src="${
							product.urlImage
								? product.urlImage.replace(
										'https://',
										'http://'
									)
								: ''
						}" width="56" />
                </div>
                <div class="app-name font-weight-bold">${highlightedName}</div>
            </a>
        `;
		resultsList.appendChild(listItem);
	}

	listSectionContainer.forEach((container) =>
		container.classList.add('hidden')
	);

	searchResultsContainer.innerHTML = resultsList.outerHTML;
	searchResultsContainer.style.display = 'block';

	return response;
}

function noResultsFound(text) {
	const resultsList = document.createElement('ul');
	const listItem = document.createElement('li');

	resultsList.className = 'recent-searches-list w-100';

	listItem.className = 'w-100 results-items-list py-3';
	listItem.innerHTML = `
        <div class="d-flex align-items-center search-no-results-container">
            <svg class="lexicon-icon lexicon-icon-warning mr-2" style="width:16px;height:16px;">
                <use href="${spritemap}#warning"></use>
            </svg> 
            
            <span>Oops! We couldn't find any results for <strong>&quot;${text}&quot;</strong></span>
        </div>
    `.trim();

	listItem.style.pointerEvents = 'none';
	resultsList.appendChild(listItem);

	if (listSectionContainer.length) {
		listSectionContainer.forEach((container) =>
			container.classList.add('hidden')
		);
	}

	searchResultsContainer.innerHTML = resultsList.outerHTML;
	searchResultsContainer.style.display = 'block';
}

function renderRecentSearches() {
	const recentSearches = searchStorage.getRecentSearchItems();

	if (!recentSearches.length) {
		recentSearchesListContainer.style.display = 'none';

		return;
	}

	const clearAllLink = document.createElement('button');
	const divider = document.createElement('div');
	const title = document.createElement('h4');
	const titleContainer = document.createElement('div');

	recentSearchesListContainer.style.display = 'block';
	recentSearchesListContainer.innerHTML = '';

	titleContainer.className =
		'd-flex align-items-center justify-content-between w-100 results-title-container';

	title.className = 'text-black-50 m-0 text-nowrap';
	title.textContent = 'Recent Searches';
	titleContainer.appendChild(title);

	divider.className = 'divider-horizontal flex-grow-1 mx-3';
	titleContainer.appendChild(divider);

	clearAllLink.className =
		'btn section-action-button font-weight-bold text-nowrap p-0';
	clearAllLink.style.cursor = 'pointer';
	clearAllLink.textContent = 'Clear All';

	clearAllLink.addEventListener('click', () => {
		searchStorage.clearRecentSearchItems();

		renderRecentSearches();
	});

	titleContainer.appendChild(clearAllLink);

	recentSearchesListContainer.appendChild(titleContainer);

	const list = document.createElement('ul');

	list.className = 'results-list-container w-100';

	const visibleSearches = recentSearches.slice(0, 3);

	visibleSearches.forEach((term) => {
		const listItem = document.createElement('li');
		listItem.className = 'w-100 results-items-list';

		const termContainer = document.createElement('a');

		termContainer.setAttribute(
			'href',
			`/web/marketplace/applications?q=${term}`
		);

		termContainer.className =
			'd-flex flex-row mb-0 text-dark text-decoration-none align-items-center';

		termContainer.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-restore mr-2" style="width:16px;height:16px;">
                <use href="${spritemap}#restore"></use>
            </svg>
            <span class="font-weight-bold">${term}</span>
        `;

		termContainer.style.cursor = 'pointer';

		const deleteBtn = document.createElement('button');

		deleteBtn.className = 'btn btn-sm border-0 bg-transparent text-muted';
		deleteBtn.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-times" style="width:14px;height:14px;">
                <use href="${spritemap}#times"></use>
            </svg>
        `;

		deleteBtn.style.cursor = 'pointer';

		deleteBtn.addEventListener('click', (event) => {
			event.stopPropagation();
			searchStorage.deleteRecentSearch(term);
			renderRecentSearches();
		});

		listItem.appendChild(termContainer);
		listItem.appendChild(deleteBtn);
		list.appendChild(listItem);

		resultsItemsList = document.querySelectorAll('.results-items-list');
	});

	recentSearchesListContainer.appendChild(list);
}

function getTypeParam(param) {
	const params = new URLSearchParams(window.location.search);
	const URLParam = params.get(param);

	return URLParam ? decodeURIComponent(URLParam) : null;
}

function getFirstAvailableParam(...params) {
	const urlParams = new URLSearchParams(window.location.search);

	for (const param of params) {
		const value = urlParams.get(param);

		if (value) {
			return {key: param, value: decodeURIComponent(value)};
		}
	}

	return null;
}

async function main() {
	let selectedIndex = -1;

	renderRecentSearches();

	const categoryParam = getFirstAvailableParam('category');

	if (categoryParam) {
		categoriesTrigger.textContent = categoryParam.value;
		selectCategory(categoryParam.value);
	}
	else {
		categoriesTrigger.textContent = 'All Categories';
		selectCategory('All Categories');
	}

	const categoryURL = getTypeParam('type');

	const queryParamData = getFirstAvailableParam('q', 'n');

	const queryParam = queryParamData?.value;

	searchInput.value = queryParamData?.value || '';

	const data = queryParam
		? await getProducts(queryParam, categorySelected)
		: {items: []};

	if (queryParam) {
		if (data.items.length) {
			displayFeedbackAlert(
				`<strong class="mx-2">${data.totalCount}</strong> Search results for <strong class="mx-2">${queryParam}</strong>`
			);
		}
		else {
			displayFeedbackAlert(
				`Oops! We couldn't find any results for <strong class="mx-2">${queryParam}</strong>    -   Feel free to browse our full catalog below`
			);
		}

		if (categoryURL) {
			selectCategory(categoryURL);
		}
	}

	categoriesListItems.forEach((item) => {
		const typeParam = getTypeParam('type');

		if (item.dataset.category === 'All Categories' && !categoryURL) {
			item.classList.add('selected');
		}

		if (typeParam && item.dataset.category === typeParam) {
			item.classList.add('selected');
		}

		item.addEventListener('click', () => {
			const category = item.dataset.category;
			const typeParam = getTypeParam('type');

			categoriesListItems.forEach((element) => {
				if (typeParam && element.dataset.category === typeParam) {
					element.classList.add('selected');
				}
			});
			selectCategory(category);

			isDropdownExpanded = false;
			searchDropdownMenuContainer.classList.remove('expand');
		});
	});

	search.addEventListener('click', () => {
		if (isSearchExpanded) {
			if (!isResultsExpanded && isSearchExpanded) {
				results.classList.add('expand');
				searchDropdownMenuContainer.classList.remove('expand');
			}

			return;
		}

		expandSearchContainer();
	});

	overlay.addEventListener('click', () => {
		collapseSearchContainer();
	});

	searchDropdownTrigger.addEventListener('click', (event) => {
		event.stopPropagation();
		isResultsExpanded = false;
		isDropdownExpanded = true;
		results.classList.remove('expand');
		searchDropdownMenuContainer.classList.add('expand');
	});

	searchIcon.addEventListener('click', () => {
		if (!searchInput.value.trim()) {
			return;
		}

		searchStorage.saveSearchTerm(searchInput.value.trim());

		enterSelection = null;

		const queryParam = data.items.length ? 'q' : 'n';

		window.location.href = `/web/marketplace/applications?${queryParam}=${searchInput.value.trim()}${
			categorySelected
				? `&category=${encodeURIComponent(categorySelected)}`
				: ''
		}`;
	});

	navContainerFull.addEventListener('click', (event) => {
		if (!navContainerFull.contains(event.target)) {
			collapseSearchContainer();
		}
	});

	document.addEventListener('keydown', async (event) => {
		resultsItemsList = document.querySelectorAll('.results-items-list');

		const items = resultsItemsList;

		if (!items) {
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			if (selectedIndex >= 0) {
				items[selectedIndex].classList.remove('selected');
			}

			selectedIndex = (selectedIndex + 1) % items.length;

			items[selectedIndex].classList.add('selected');
			items[selectedIndex].scrollIntoView({block: 'nearest'});

			enterSelection = items[selectedIndex];
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();

			if (selectedIndex >= 0) {
				items[selectedIndex].classList.remove('selected');
			}

			selectedIndex = (selectedIndex - 1 + items.length) % items.length;

			items[selectedIndex].classList.add('selected');
			items[selectedIndex].scrollIntoView({block: 'nearest'});
			enterSelection = items[selectedIndex];
		}

		if (
			(event.ctrlKey || event.metaKey) &&
			event.key.toLowerCase() === 'k'
		) {
			event.preventDefault();
			expandSearchContainer();
		}

		if (event.key === 'Escape') {
			if (isDropdownExpanded) {
				isDropdownExpanded = false;
				searchDropdownMenuContainer.classList.remove('expand');
				results.classList.add('expand');
			}
			else if (isResultsExpanded) {
				isResultsExpanded = false;
				results.classList.remove('expand');
			}
			else if (isSearchExpanded) {
				collapseSearchContainer();
			}
		}

		if (event.key === 'Enter') {
			const listItems = Array.from(resultsItemsList);

			if (!listItems.length) {
				return;
			}

			const selectedItem = enterSelection;

			if (selectedItem && selectedItem.classList.contains('selected')) {
				const clickable =
					selectedItem.querySelector('[onclick]') ||
					selectedItem.querySelector(
						"button, a, div[role='button']"
					) ||
					selectedItem.firstElementChild;

				if (clickable) {
					clickable.click();
				}
				else if (typeof selectedItem.onclick === 'function') {
					selectedItem.onclick();
				}

				selectedItem.click();

				return;
			}

			if (searchInput.value.trim()) {
				searchStorage.saveSearchTerm(searchInput.value.trim());

				const data = await getProducts(
					searchInput.value.trim(),
					categorySelected
				);

				enterSelection = null;

				const queryParam = data.items.length ? 'q' : 'n';

				window.location.href = `/web/marketplace/applications?${queryParam}=${searchInput.value.trim()}${
					categorySelected
						? `&category=${encodeURIComponent(categorySelected)}`
						: ''
				}`;
			}
		}
	});

	navContainerFull.addEventListener('click', (event) => {
		if (!navContainerFull.contains(event.target)) {
			collapseSearchContainer();
		}
	});

	searchInput?.addEventListener('input', () => {
		clearTimeout(searchTimeout);
		if (searchInput.value.trim()) {
			clearInputButton.classList.add('visible');
		}
		else {
			clearInputButton.classList.remove('visible');
		}

		searchTimeout = setTimeout(() => {
			fetchSearchResults(categorySelected, searchInput.value.trim());

			if (!searchInput.value.trim().length) {
				listSectionContainer.forEach((container) =>
					container.classList.remove('hidden')
				);
			}
		}, SEARCH_DELAY);
	});

	clearInputButton?.addEventListener('click', () => {
		clearInputButton.classList.remove('visible');
		searchInput.value = '';
		searchInput.focus();
	});
}

main();
