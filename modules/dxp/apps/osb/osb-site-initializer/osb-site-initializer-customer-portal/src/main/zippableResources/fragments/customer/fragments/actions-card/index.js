/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable @liferay/portal/no-global-fetch */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

const accountKey = window.location.search.replace('?kor_id=', '');
const containerId = configuration.containerId;
const fragmentName = 'cp-tip-container';
const elementName = `.dynamic-web-content-${containerId}`;
const eventName = `${fragmentName}-${containerId}`;
const headlessBaseURL = `${window.location.origin}/o/headless-delivery/v1.0`;
const siteGroupId = Liferay.ThemeDisplay.getSiteGroupId();
const fragmentContainer = fragmentElement.querySelector('.cp-tip-container');

function setDynamicWebContent(htmlBody, customData = {}) {
	const keys = Object.keys(customData);
	const sanitizeHTMLRegex = /<[^>]*>?/gm;
	const sanitizeEmptyKeysRegex = /{{[^\s]*}}/g;

	let html = htmlBody.replace('[accountKey]', accountKey);

	keys.forEach((key) => {
		html = html.replace(
			`{{${key}}}`,
			customData[key].replace(sanitizeHTMLRegex, '')
		);
	});

	html = html.replace(sanitizeEmptyKeysRegex, '');

	const htmlElement = (elementName, html) => {
		return `<div class="bg-white card-body mb-3 rounded-lg ${elementName}">${html}</div>`;
	};

	fragmentContainer.innerHTML += htmlElement(elementName, html);
}

async function fetchHeadless(url, resolveAsJson = true) {
	const response = await fetch(`${headlessBaseURL}${url}`, {
		headers: {
			'Cache-Control': 'max-age=30, stale-while-revalidate=30',
			'x-csrf-token': Liferay.authToken,
		},
	});

	if (resolveAsJson) {
		return response.json();
	}

	return response;
}

function fetchWebContent(structuredContentId, contentTemplateId, customData) {
	fetchHeadless(
		`/structured-contents/${structuredContentId}/rendered-content/${contentTemplateId}`,
		false
	)
		.then((response) => response.text())
		.then((response) => setDynamicWebContent(response, customData));
}

function CPFragmentInteractiveListener(templateId, structuredContents) {
	window.addEventListener(eventName, (event) => {
		const data = event.detail.data;

		function getStructuredContentIdByName(templateName) {
			return structuredContents.find(
				({friendlyUrlPath, key}) =>
					friendlyUrlPath === templateName ||
					key === templateName.toUpperCase()
			)?.id;
		}

		if (data.hide) {
			fragmentElement.querySelector(elementName).innerHTML = '';
		} else if (
			typeof data === 'object' &&
			data.templateName.every((template) =>
				getStructuredContentIdByName(template)
			)
		) {
			data.templateName.forEach((template) =>
				fetchWebContent(
					getStructuredContentIdByName(template),
					templateId,
					data.templateData
				)
			);
		} else {
			console.warn(`Structure ${data.templateName} not found`);
		}
	});
}

async function workflow() {
	const structuredContentFolders = await fetchHeadless(
		`/sites/${siteGroupId}/structured-content-folders`
	);

	const {id: cpFolderId} =
		structuredContentFolders.items.find(({name}) => name === 'actions') ||
		{};

	if (!cpFolderId) {
		return console.warn('CP Actions Folder not found');
	}

	const structuredContents = await fetchHeadless(
		`/structured-content-folders/${cpFolderId}/structured-contents`
	);

	console.log(structuredContents.items);

	const contentTemplates = await fetchHeadless(
		`/sites/${siteGroupId}/content-templates`
	);

	const contentTemplate = contentTemplates.items.find(
		(template) => template.name === 'Action Card'
	);
	console.log(contentTemplate.id);

	CPFragmentInteractiveListener(
		contentTemplate?.id,
		structuredContents.items
	);

	const startEvent = new CustomEvent('cp-tip-container-primary', {
		bubbles: true,
		composed: true,
		detail: {
			data: {
				templateName: [
					'WEB-CONTENT-ACTION-01',
					'WEB-CONTENT-ACTION-02',
					'WEB-CONTENT-ACTION-03',
					'WEB-CONTENT-ACTION-04',
				],
			},
		},
	});
	console.log(startEvent);

	window.dispatchEvent(startEvent);
}

workflow();

fragmentElement.addEventListener('click', (event) => {
	const hideLinkId = fragmentElement.querySelector('#hide-link');
	let currentButton = event.target;

	if (currentButton.tagName === 'U' || currentButton.tagName === 'svg') {
		currentButton = currentButton.parentElement;
	}
	if (currentButton.tagName === 'use') {
		currentButton = currentButton.parentElement.parentElement;
	}

	if (currentButton.id === 'hide-link') {
		const iconLink = hideLinkId.innerHTML;

		fragmentContainer.classList.toggle('hide');
		hideLinkId.innerHTML = iconLink.includes('#hr')
			? iconLink.replace('#hr', '#plus')
			: iconLink.replace('#plus', '#hr');
		hideLinkId.children[1].classList.toggle('hide');
	}
});
