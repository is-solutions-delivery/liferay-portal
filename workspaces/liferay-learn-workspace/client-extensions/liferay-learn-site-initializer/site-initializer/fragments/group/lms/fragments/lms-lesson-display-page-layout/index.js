/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const admonitionsElements = document.querySelectorAll(
	'.portlet-msg-alert, .portlet-msg-error, .portlet-msg-info'
);

const copyToClipboardButtons = document.querySelectorAll(
	'.copy-to-clipboard-button'
);

admonitionsElements.forEach((admonitionElement) => {
	if (admonitionElement) {
		let brFound = false;
		const textAdmonitionNodes = [];

		for (let i = 0; i < admonitionElement.childNodes.length; i++) {
			const admonitionChildNode = admonitionElement.childNodes[i];

			if (admonitionChildNode.nodeName === "BR") {
				brFound = true;
			} else if (brFound && admonitionChildNode.nodeType === Node.TEXT_NODE && admonitionChildNode.nodeValue.trim() !== "") {
				textAdmonitionNodes.push(admonitionChildNode);
			}
		}

		if (textAdmonitionNodes.length) {
			const textAdmonitionDiv = document.createElement("div");
			textAdmonitionDiv.classList.add("text-admonition");
			textAdmonitionNodes.forEach(node => textAdmonitionDiv.appendChild(node));
			admonitionElement.appendChild(textAdmonitionDiv);
		}
	}
});

copyToClipboardButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const codeToolbar = button.closest('.code-toolbar');

		if (codeToolbar) {
			if (codeToolbar.querySelector('code.language-css').innerText) {
				navigator.clipboard
					.writeText(
						codeToolbar.querySelector('code.language-css')
							.innerText
					)
					.then(() => {
						button.setAttribute('data-copy-state', 'copy-success');
					})
					.catch(() => {
						button.setAttribute('data-copy-state', 'copy-failure');
					})
					.finally(() => {
						setTimeout(() => {
							button.setAttribute('data-copy-state', 'copy');
						}, 3000);
					});
			}
		}
	});
});