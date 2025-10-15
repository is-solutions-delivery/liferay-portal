const SEARCH_DELAY = 1000;
const PAGE_SIZE = 20;

const channelId = configuration.channelId

let accountMenu,
    categoriesListItems,
    clearInputButton,
    enterSelection,
    listSectionContainer,
    menu,
    navContainerFull,
    overlay,
    recentSearchesListContainer,
    results,
    resultsItemsList,
    search,
    searchContainer,
    searchDropdownMenuContainer,
    searchDropdownTrigger,
    searchIcon,
    searchInput,
    searchResultsContainer,
    searchValue,
    categorySelected,
    categoriesTrigger;

let isDropdownExpanded = false;
let isResultsExpanded = false;
let isSearchExpanded = false;
let searchTimeout = null;

const pathThemeImages = Liferay.ThemeDisplay.getPathThemeImages();
const spritemap = `${pathThemeImages}/clay/icons.svg`;

function initializeElements() {
    accountMenu = document.querySelector(".meuElemento");
    categoriesListItems = document.querySelectorAll(
        ".search-dropdown-list-item"
    );
    categorySelected = "";
    clearInputButton = document.querySelector(".clear-input-button");
    listSectionContainer = document.querySelectorAll(".list-section-container");
    menu = document.querySelector(".marketplace-nav-menu-container");
    navContainerFull = document.querySelector(".search-nav-container-full");
    overlay = document.querySelector(".results-overlay");
    recentSearchesListContainer = document.querySelector(
        ".recent-searches-list-container"
    );
    results = document.querySelector(".results");
    resultsItemsList = document.querySelectorAll(".results-items-list");
    search = document.querySelector(".search");
    searchContainer = document.querySelector(".marketplace-search-container");
    searchDropdownMenuContainer = document.querySelector(
        ".search-dropdown-menu-container"
    );
    searchDropdownTrigger = document.querySelector(".search-dropdown-trigger");
    searchIcon = document.querySelector(".search-icon");
    searchInput = document.querySelector(".search-input");
    searchResultsContainer = document.querySelector(
        ".search-results-container"
    );
    searchValue = "";
    categoriesTrigger = document.querySelector(".categories-trigger");
}

function buildPath(search, categoryFilter) {
    const basePath = `/o/headless-commerce-delivery-catalog/v1.0/channels/${channelId}/products?accountId=-1&images.accountId=-1&nestedFields=categories,productSpecifications,images&pageSize=${PAGE_SIZE}`;

    const filters = [];

    if (categoryFilter && categoryFilter !== "All Categories") {
        filters.push(`categoryNames/any(x:(x eq '${categoryFilter}'))`);
    }

    const params = [];

    if (search) {
        params.push(`search='${encodeURIComponent(search)}'`);
    }

    if (filters.length > 0) {
        params.push(`filter=${filters.join(" and ")}`);
    }

    return `${basePath}${params.length > 0 ? "&" + params.join("&") : ""}`;
}

function selectCategory(category) {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);

    categoriesListItems.forEach((item) => {
        item.classList.remove("selected");
    });

    categoriesListItems.forEach((item) => {
        if (item.getAttribute("data-category") === category) {
            item.classList.add("selected");
        }
    });

    if (category === "All Categories") {
        url.searchParams.delete("type");
        categoriesTrigger.textContent = "All Categories";
        searchInput.focus();
        window.history.replaceState({}, "", url.toString());
        categorySelected = category;
        return;
    }

    if (category && category !== "All Categories") {
        categoriesTrigger.textContent = category;
        url.searchParams.set("type", category);
    } else {
        url.searchParams.delete("type");
    }

    if (search.classList.contains("expanded")) {
        searchInput.focus();

        results.classList.add("expand");
        searchDropdownMenuContainer.classList.remove("expand");
        isDropdownExpanded = false;
        isResultsExpanded = true;
    }

    window.history.replaceState({}, "", url.toString());
    categorySelected = category;
}

function removeAllQueryParams(url) {
    const urlObj = new URL(url, window.location.origin);
    urlObj.search = "";
    return urlObj.toString();
}

function navContainerInfo(text) {
    const searchInfoPanel = document.createElement("div");
    searchInfoPanel.className =
        "search-info-panel d-flex align-items-center justify-content-between p-4";

    searchInfoPanel.classList.add("expanded");

    const searchInfoPanelContainer = document.createElement("div");
    searchInfoPanelContainer.className =
        "container-fluid container-fluid-max-xl justify-content-between d-flex";

    const searchInfoPanelTextContainer = document.createElement("div");
    searchInfoPanelTextContainer.className = "d-flex align-items-center";
    searchInfoPanelTextContainer.innerHTML = text;
    searchInfoPanelContainer.appendChild(searchInfoPanelTextContainer);

    const closeInfoButton = document.createElement("button");
    closeInfoButton.className = "btn btn-sm border-0 bg-transparent text-muted";
    closeInfoButton.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-times" style="width:14px;height:14px;">
                <use href="${spritemap}#times"></use>
            </svg>
        `;
    closeInfoButton.style.cursor = "pointer";

    closeInfoButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const clearUrl = removeAllQueryParams(url);

        searchInfoPanel.classList.remove("expanded");
        navContainerFull.classList.remove("expanded");
        searchInput.value = "";
        window.history.replaceState({}, "", clearUrl);
    });

    searchInfoPanel.appendChild(searchInfoPanelContainer);
    searchInfoPanelContainer.appendChild(closeInfoButton);

    navContainerFull.appendChild(searchInfoPanel);
    navContainerFull.classList.add("expanded");
}

function lockScroll() {
    const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    document.body.style.overflow = "hidden";
}

function unlockScroll() {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
}

function expandSearchContainer() {
    isSearchExpanded = true;
    menu.classList.add("hidden");
    renderRecentSearches();

    lockScroll();
    setTimeout(() => {
        searchIcon.classList.add("expanded");
        searchContainer.classList.add("expand");
        search.classList.add("expandido");
        setTimeout(() => {
            results.classList.add("expand");
            overlay.classList.add("active");
            searchInput.focus();
        }, 300);
    }, 100);
}

function collapseSearchContainer() {
    isSearchExpanded = false;
    overlay.classList.remove("active");
    results.classList.remove("expand");

    setTimeout(() => {
        searchInput.value = "";
        searchDropdownMenuContainer.classList.remove("expand");
        search.classList.remove("expandido");
        searchContainer.classList.remove("expand");
        searchIcon.classList.remove("expanded");

        unlockScroll();

        setTimeout(() => {
            menu.classList.remove("hidden");
        }, 300);
    }, 300);
}

function saveSearchTerm(term) {
    const trimmed = term.trim();
    if (!trimmed) return;

    const key = "recentSearches";
    const stored = JSON.parse(localStorage.getItem(key)) || [];

    const updated = [
        trimmed,
        ...stored.filter(
            (item) => item.toLowerCase() !== trimmed.toLowerCase()
        ),
    ];

    const limited = updated.slice(0, 5);

    localStorage.setItem(key, JSON.stringify(limited));
}

function getRecentSearches() {
    return JSON.parse(localStorage.getItem("recentSearches")) || [];
}

function clearRecentSearches() {
    localStorage.removeItem("recentSearches");
}

async function getProductsURL(trimmedSearch, category) {
    const url = buildPath(trimmedSearch, category);
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function fetchSearchResults(search, category) {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
        searchResultsContainer.innerHTML = "";
        searchResultsContainer.style.display = "none";
        return;
    }

    const response = await getProductsURL(trimmedSearch, category);

    const items = response.items || [];

    if (!items.length) {
        noResultsFound(trimmedSearch);

        return;
    }

    saveSearchTerm(trimmedSearch);

    const resultsList = document.createElement("ul");
    resultsList.className = "recent-searches-list w-100";

    const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(`(${escapedSearch})`, "gi");

    for (const product of items) {
        const highlightedName = product.name.replace(
            searchRegex,
            "<mark>$1</mark>"
        );

        const listItem = document.createElement("li");
        listItem.className = "w-100 results-items-list";
        listItem.innerHTML = `
            <a class="border-radius-medium d-flex flex-row mb-0 text-dark text-decoration-none align-items-center"
                href="/web/marketplace/p/${product.slug}" target="_self">
                <div class="image-container mr-2 rounded">
                    <img alt="${product.name
            }" class="app-search-bar-image" draggable="false" height="56"
                        src="${product.urlImage
                ? product.urlImage.replace(
                    "https://",
                    "http://"
                )
                : ""
            }" width="56" />
                </div>
                <div class="app-name font-weight-bold">${highlightedName}</div>
            </a>
        `;
        resultsList.appendChild(listItem);
    }

    listSectionContainer.forEach((container) =>
        container.classList.add("hidden")
    );

    searchResultsContainer.innerHTML = resultsList.outerHTML;
    searchResultsContainer.style.display = "block";
    return response;
}

function noResultsFound(text) {
    const resultsList = document.createElement("ul");
    const listItem = document.createElement("li");

    resultsList.className = "recent-searches-list w-100";

    listItem.className = "w-100 results-items-list py-3";
    listItem.innerHTML = `
        <div class="d-flex align-items-center search-no-results-container">
            <svg class="lexicon-icon lexicon-icon-warning mr-2" style="width:16px;height:16px;">
                <use href="${spritemap}#warning"></use>
            </svg> 
            
            <span>Oops! We couldn't find any results for <strong>&quot;${text}&quot;</strong></span>
        </div>
    `;

    listItem.style.pointerEvents = "none";
    resultsList.appendChild(listItem);

    if (listSectionContainer.length) {
        listSectionContainer.forEach((container) =>
            container.classList.add("hidden")
        );
    }

    searchResultsContainer.innerHTML = resultsList.outerHTML;
    searchResultsContainer.style.display = "block";
}

function renderRecentSearches() {
    const recentSearches = getRecentSearches();

    if (recentSearches.length === 0) {
        recentSearchesListContainer.style.display = "none";
        return;
    }

    recentSearchesListContainer.style.display = "block";
    recentSearchesListContainer.innerHTML = "";

    const titleContainer = document.createElement("div");
    titleContainer.className =
        "d-flex align-items-center justify-content-between w-100 results-title-container";

    const title = document.createElement("h4");
    title.className = "text-black-50 m-0 text-nowrap";
    title.textContent = "Recent Searches";
    titleContainer.appendChild(title);

    const divider = document.createElement("div");
    divider.className = "divider-horizontal flex-grow-1 mx-3";
    titleContainer.appendChild(divider);

    const clearAllLink = document.createElement("button");
    clearAllLink.className =
        "btn section-action-button font-weight-bold text-nowrap p-0";
    clearAllLink.style.cursor = "pointer";
    clearAllLink.textContent = "Clear All";
    clearAllLink.addEventListener("click", () => {
        clearRecentSearches();
        renderRecentSearches();
    });
    titleContainer.appendChild(clearAllLink);

    recentSearchesListContainer.appendChild(titleContainer);

    const list = document.createElement("ul");
    list.className = "results-list-container w-100";

    const visibleSearches = recentSearches.slice(0, 3);

    visibleSearches.forEach((term) => {
        const listItem = document.createElement("li");
        listItem.className = "w-100 results-items-list";

        const termContainer = document.createElement("a");
        termContainer.setAttribute(
            "href",
            `/web/marketplace/applications?q=${term}`
        );
        termContainer.className =
            "d-flex flex-row mb-0 text-dark text-decoration-none align-items-center";
        termContainer.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-restore mr-2" style="width:16px;height:16px;">
                <use href="${spritemap}#restore"></use>
            </svg>
            <span class="font-weight-bold">${term}</span>
        `;
        termContainer.style.cursor = "pointer";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm border-0 bg-transparent text-muted";
        deleteBtn.innerHTML = `
            <svg class="lexicon-icon lexicon-icon-times" style="width:14px;height:14px;">
                <use href="${spritemap}#times"></use>
            </svg>
        `;
        deleteBtn.style.cursor = "pointer";

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteRecentSearch(term);
            renderRecentSearches();
        });

        listItem.appendChild(termContainer);
        listItem.appendChild(deleteBtn);
        list.appendChild(listItem);

        resultsItemsList = document.querySelectorAll(".results-items-list");
    });

    recentSearchesListContainer.appendChild(list);
}

function getTypeParam(param) {
    const params = new URLSearchParams(window.location.search);
    const URLParam = params.get(param);

    return URLParam ? decodeURIComponent(URLParam) : null;
}

function deleteRecentSearch(termToDelete) {
    let searches = getRecentSearches();
    searches = searches.filter((term) => term !== termToDelete);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
}

function getFirstAvailableParam(...params) {
    const urlParams = new URLSearchParams(window.location.search);
    for (const param of params) {
        const value = urlParams.get(param);
        if (value) {
            return { key: param, value: decodeURIComponent(value) };
        }
    }
    return null;
}

async function main() {
    let selectedIndex = -1;

    initializeElements();
    renderRecentSearches();

    const categoryParam = getFirstAvailableParam("category");

    if (categoryParam) {
        categoriesTrigger.textContent = categoryParam.value;
        selectCategory(categoryParam.value);
    } else {
        categoriesTrigger.textContent = "All Categories";
        selectCategory("All Categories");
    }

    const categoryURL = getTypeParam("type");

    const queryParamData = getFirstAvailableParam("q", "n");

    const queryParam = queryParamData?.value;

    searchInput.value = queryParamData?.value || "";

    const data = queryParam
        ? await getProductsURL(queryParam, categorySelected)
        : { items: [] };

    if (queryParam) {
        if (data.items.length === 0) {
            navContainerInfo(
                `Oops! We couldn't find any results for <strong class="mx-2">${queryParam}</strong>    -   Feel free to browse our full catalog below`
            );
        } else {
            navContainerInfo(
                `<strong class="mx-2">${data.totalCount}</strong> Search results for <strong class="mx-2">${queryParam}</strong>`
            );
        }

        if (categoryURL) {
            selectCategory(categoryURL);
        }
    }

    categoriesListItems.forEach((item) => {
        const typeParam = getTypeParam("type");

        if (
            item.getAttribute("data-category") === "All Categories" &&
            !categoryURL
        ) {
            item.classList.add("selected");
        }

        if (typeParam && item.getAttribute("data-category") === typeParam) {
            item.classList.add("selected");
        }

        item.addEventListener("click", () => {
            const category = item.getAttribute("data-category");
            const typeParam = getTypeParam("type");
            let found = false;

            categoriesListItems.forEach((el) => {
                if (
                    typeParam &&
                    el.getAttribute("data-category") === typeParam
                ) {
                    el.classList.add("selected");
                }
            });
            selectCategory(category);

            isDropdownExpanded = false;
            searchDropdownMenuContainer.classList.remove("expand");
        });
    });

    search.addEventListener("click", () => {
        if (isSearchExpanded) {
            if (!isResultsExpanded && isSearchExpanded) {
                results.classList.add("expand");
                searchDropdownMenuContainer.classList.remove("expand");
            }
            return;
        }

        expandSearchContainer();
    });

    overlay.addEventListener("click", () => {
        collapseSearchContainer();
    });

    searchDropdownTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        isResultsExpanded = false;
        isDropdownExpanded = true;
        results.classList.remove("expand");
        searchDropdownMenuContainer.classList.add("expand");
    });

    searchIcon.addEventListener("click", () => {
        if (searchInput.value.trim()) {
            saveSearchTerm(searchInput.value.trim());

            enterSelection = null;

            if (data.items.length) {
                window.location.href = `/web/marketplace/applications?q=${searchInput.value.trim()}${categorySelected
                        ? `&category=${encodeURIComponent(categorySelected)}`
                        : ""
                    }`;
            } else {
                window.location.href = `/web/marketplace/applications?n=${searchInput.value.trim()}${categorySelected
                        ? `&category=${encodeURIComponent(categorySelected)}`
                        : ""
                    }`;
            }
        }
    });

    navContainerFull.addEventListener("click", (e) => {
        if (!navContainerFull.contains(e.target)) {
            collapseSearchContainer();
        }
    });

    document.addEventListener("keydown", async function (event) {
        resultsItemsList = document.querySelectorAll(".results-items-list");
        const items = resultsItemsList;

        if (!items) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();

            if (selectedIndex >= 0) {
                items[selectedIndex].classList.remove("selected");
            }

            selectedIndex = (selectedIndex + 1) % items.length;

            items[selectedIndex].classList.add("selected");

            items[selectedIndex].scrollIntoView({ block: "nearest" });
            enterSelection = items[selectedIndex];
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (selectedIndex >= 0) {
                items[selectedIndex].classList.remove("selected");
            }

            selectedIndex = (selectedIndex - 1 + items.length) % items.length;

            items[selectedIndex].classList.add("selected");
            items[selectedIndex].scrollIntoView({ block: "nearest" });
            enterSelection = items[selectedIndex];
        }

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();
            expandSearchContainer();
        }

        if (event.key === "Escape") {
            if (isDropdownExpanded) {
                isDropdownExpanded = false;
                searchDropdownMenuContainer.classList.remove("expand");
                results.classList.add("expand");
            } else if (isResultsExpanded) {
                isResultsExpanded = false;
                results.classList.remove("expand");
            } else if (isSearchExpanded) {
                collapseSearchContainer();
            }
        }

        if (event.key === "Enter") {
            const listItems = Array.from(resultsItemsList);
            if (!listItems.length) return;

            const selectedItem = enterSelection;

            if (selectedItem && selectedItem.classList.contains("selected")) {
                const clickable =
                    selectedItem.querySelector("[onclick]") ||
                    selectedItem.querySelector(
                        "button, a, div[role='button']"
                    ) ||
                    selectedItem.firstElementChild;

                if (clickable) {
                    clickable.click();
                } else if (typeof selectedItem.onclick === "function") {
                    selectedItem.onclick();
                } else {
                    selectedItem.click();
                }

                return;
            }

            if (searchInput.value.trim()) {
                saveSearchTerm(searchInput.value.trim());

                const data = await getProductsURL(
                    searchInput.value.trim(),
                    categorySelected
                );

                enterSelection = null;

                if (data.items.length) {
                    window.location.href = `/web/marketplace/applications?q=${searchInput.value.trim()}${categorySelected
                            ? `&category=${encodeURIComponent(
                                categorySelected
                            )}`
                            : ""
                        }`;
                } else {
                    window.location.href = `/web/marketplace/applications?n=${searchInput.value.trim()}${categorySelected
                            ? `&category=${encodeURIComponent(
                                categorySelected
                            )}`
                            : ""
                        }`;
                }
            }
        }
    });

    navContainerFull.addEventListener("click", (e) => {
        if (!navContainerFull.contains(e.target)) {
            collapseSearchContainer();
        }
    });

    searchInput?.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        if (searchInput.value.trim()) {
            clearInputButton.classList.add("visible");
        } else {
            clearInputButton.classList.remove("visible");
        }

        searchTimeout = setTimeout(() => {
            fetchSearchResults(searchInput.value.trim(), categorySelected);

            if (searchInput.value.trim().length === 0) {
                listSectionContainer.forEach((container) =>
                    container.classList.remove("hidden")
                );
            }
        }, SEARCH_DELAY);
    });

    clearInputButton?.addEventListener("click", () => {
        clearInputButton.classList.remove("visible");
        searchInput.value = "";
        searchInput.focus();
    });
}

main();
