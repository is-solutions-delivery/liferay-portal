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

const dataNumber = document.querySelector('.grantMoney div h2').innerText;

const currencyFormat = (value) => {
	let formatedValue = value;

	let valueSufix = '';

	if (value >= 1000000000) {
		formatedValue = parseFloat(value / 1000000000).toFixed(2);

		valueSufix = 'B';
	} else if (value >= 1000000) {
		formatedValue = parseFloat(value / 1000000).toFixed(2);

		valueSufix = 'M';
	}

	return formatedValue + valueSufix;
};
document.querySelector('.grantMoney div h2').innerHTML = currencyFormat(
	+dataNumber
);
