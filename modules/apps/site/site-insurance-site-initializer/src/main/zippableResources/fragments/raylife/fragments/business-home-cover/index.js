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

const retrieveQuoteContainer = fragmentElement.querySelector('#retrieve-quote');
const newQuoteContainer = fragmentElement.querySelector('#new-quote');
const businessEmailDeliveredContainer = fragmentElement.querySelector(
	'.business-email-delivered'
);
const newQuoteFormContainer = fragmentElement.querySelector('.new-quote-form');

// Action Buttons

const retrieveQuoteButton = fragmentElement.querySelector(
	'#retrieve-quote-button'
);
const newQuoteButton = fragmentElement.querySelector('#new-quote-button');
const continueQuoteButton = fragmentElement.querySelector('#continue-quote');

retrieveQuoteButton.onclick = function () {
	retrieveQuoteContainer.classList.add('d-none', 'invisible');
	newQuoteContainer.classList.remove('d-none', 'invisible');
};

newQuoteButton.onclick = function () {
	newQuoteContainer.classList.add('d-none', 'invisible');
	retrieveQuoteContainer.classList.remove('d-none', 'invisible');
};

continueQuoteButton.onclick = function () {
	const email = newQuoteFormContainer.querySelector('input').value;

	fetch(`https://jsonplaceholder.typicode.com/users/1`)
		.then((response) => response.json())
		.then((json) => {
			const title = businessEmailDeliveredContainer.querySelector('h2');
			const paragraph = businessEmailDeliveredContainer.querySelector(
				'p'
			);

			title.innerHTML = title.textContent.replace('{name}', json.name);

			paragraph.innerHTML = paragraph.textContent.replace(
				'{email}',
				email
			);

			businessEmailDeliveredContainer.classList.remove(
				'd-none',
				'invisible'
			);
			newQuoteFormContainer.classList.remove('d-flex', 'invisible');
			newQuoteFormContainer.classList.add('d-none', 'invisible');
		});
};

fragmentElement.querySelector('#zip').onkeypress = (event) => {
	var charCode = event.which ? event.which : event.keyCode;

	return !(charCode > 31 && (charCode < 48 || charCode > 57));
};
