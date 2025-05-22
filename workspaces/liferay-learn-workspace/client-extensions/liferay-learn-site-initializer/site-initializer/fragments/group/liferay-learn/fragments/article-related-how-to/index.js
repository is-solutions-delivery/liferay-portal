/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

function createHowToCard(dateModified, id, title) {
	const howToCardsContainer = document.getElementById(
		'how-to-cards-container'
	);

	if (!howToCardsContainer) {
		return;
	}

	const howToCardHeader = document.createElement('div');

	howToCardHeader.classList.add('how-to-card-header');
	howToCardHeader.textContent = title;

	const howToCardDatePublished = document.createElement('div');

	howToCardDatePublished.classList.add('published-date');
	howToCardDatePublished.textContent = Liferay.Language.get('published-date') +
		': ' +
		formatDate(dateModified);

	const howToCardDiv = document.createElement('div');

	howToCardDiv.appendChild(howToCardHeader);
	howToCardDiv.appendChild(howToCardDatePublished);
	howToCardDiv.classList.add('how-to-card');
	howToCardDiv.onclick = function () {
		window.location.href = `${Liferay.ThemeDisplay.getCDNBaseURL()}/l/${id}/`;
	};

	howToCardsContainer.appendChild(howToCardDiv);
}

function createHowToContainer() {
	const articleRelatedHowTo = document.getElementById(
		'article-related-how-to'
	);

	if (!articleRelatedHowTo) {
		return;
	}

	const howToContainerHeader = document.createElement('div');

	howToContainerHeader.classList.add('how-to-container-header');
	howToContainerHeader.textContent = Liferay.Language.get('how-to-related-to-this-article');

	const howToCardsContainer = document.createElement('div');

	howToCardsContainer.classList.add('how-to-cards-container');
	howToCardsContainer.id = 'how-to-cards-container';

	const howToContainer = document.createElement('div');

	howToContainer.classList.add('how-to-container');
	howToContainer.appendChild(howToContainerHeader);
	howToContainer.appendChild(howToCardsContainer);

	articleRelatedHowTo.appendChild(howToContainer);
}

async function createHowToSuggestions() {
	const articleId = document.querySelector('.article-related-how-to').dataset
		.articleId;

	const structuredContent = await Liferay.Util.fetch(
		`/o/headless-delivery/v1.0/sites/${Liferay.ThemeDisplay.getSiteGroupId()}/structured-contents/by-key/${articleId}`
	).then((response) => response.json());

	if (structuredContent.keywords.length) {
		const structuredContentHowTo = await getHowToKeywords(
			structuredContent.keywords
		);

		if (structuredContentHowTo.totalCount > 0) {
			createHowToContainer();

			structuredContentHowTo.items.forEach((item) =>
				createHowToCard(item.dateModified, item.id, item.title)
			);
		}
	}
}

function formatDate(dateModified) {
	const date = new Date(dateModified);

	return date.toLocaleString('en-US', {
		day: 'numeric',
		hour: 'numeric',
		hour12: true,
		minute: '2-digit',
		month: 'short',
		year: '2-digit',
	});
}

async function getHowToKeywords(articleKeywords) {
	const searchParams = new URLSearchParams({
		fields: 'dateModified,id,title',
		filter: "(knowledgeArticleType eq 'howTo') and (status eq 0) and (sourceTeam eq 'Enablement')",
		pageSize: '3',
		search: articleKeywords.slice(0, articleKeywords.length).join(','),
		sort: 'dateModified:desc',
	}).toString();

	const response = await Liferay.Util.fetch(
		`/o/c/p2s3knowledgearticles/scopes/${Liferay.ThemeDisplay.getScopeGroupId()}?${searchParams}`
	).then((response) => response.json());

	return response;
}

createHowToSuggestions();
