/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const copyToClipboardButtons = document.querySelectorAll(
	'.copy-to-clipboard-button'
);

const textToSpeechContainer = document.querySelector(
	'.text-to-speech-container'
);

const componentHtmlH1 = document.querySelector('.component-html h1');

copyToClipboardButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const codeToolbar = button.closest('.code-toolbar');

		if (codeToolbar) {
			const code = codeToolbar.querySelector('code');

			if (code) {
				navigator.clipboard
					.writeText(code.innerText)
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

if (componentHtmlH1 && componentHtmlH1.parentElement) {
	componentHtmlH1.insertAdjacentElement('afterend', textToSpeechContainer);
}
