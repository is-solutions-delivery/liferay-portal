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

const applicationIdKey = 'raylife-application-id';
const check = fragmentElement.querySelector('#hidden-images #check');
const uncheck = fragmentElement.querySelector('#hidden-images #uncheck');

const data = {
	productName: 'Business Owners Policy',
	policyTerm: '10/1/2019 - 10/1/2020',
	price: '1,225',
	infoOne: {
		checked: true,
		value: '1,000,000',
	},
	infoTwo: {
		checked: true,
		value: '2,000,000',
	},
	infoThree: {
		checked: true,
		value: '50,000',
	},
	infoFour: {
		checked: true,
		value: '100,000',
	},
	infoFive: {
		checked: true,
		value: '500,000',
	},
};

const valueRow = [
	{
		image: document.getElementById('congrats-check-one'),
		priceChecked: document.getElementById('price-one'),
		priceUnchecked: document.getElementById('list-info-one'),
		price: document.getElementById('price-one'),
	},
	{
		image: document.getElementById('congrats-check-two'),
		priceChecked: document.getElementById('price-two'),
		priceUnchecked: document.getElementById('list-info-two'),
		price: document.getElementById('price-two'),
	},
	{
		image: document.getElementById('congrats-check-three'),
		priceChecked: document.getElementById('price-three'),
		priceUnchecked: document.getElementById('list-info-three'),
		price: document.getElementById('price-three'),
	},
	{
		image: document.getElementById('congrats-check-four'),
		priceChecked: document.getElementById('price-four'),
		priceUnchecked: document.getElementById('list-info-four'),
		price: document.getElementById('price-four'),
	},
	{
		image: document.getElementById('congrats-check-five'),
		priceChecked: document.getElementById('price-five'),
		priceUnchecked: document.getElementById('list-info-five'),
		price: document.getElementById('price-five'),
	},
];

const formatRow = (dataInfo, object) => {
	if (dataInfo.checked) {
		object.image.src = check.currentSrc;
		object.priceChecked.innerHTML = '$' + dataInfo.value;
		return;
	}
	object.price.innerHTML = '&nbsp;';
	object.image.src = uncheck.currentSrc;
	object.priceUnchecked.style.color = '#A0A0A4';
};

const productName = document.getElementById('congrats-info-title');

productName.innerHTML = data.productName;

const newPolicyNumber = localStorage.getItem(applicationIdKey);

if (newPolicyNumber) {
	document.getElementById('congrats-info-policy').textContent =
		'Policy: #' + newPolicyNumber;
}

const policyTerm = document.getElementById('congrats-info-date');

policyTerm.innerHTML = data.policyTerm;

const policyAmount = document.getElementById('congrats-price');

policyAmount.innerHTML = '$' + data.price;

formatRow(data.infoOne, valueRow[0]);
formatRow(data.infoTwo, valueRow[1]);
formatRow(data.infoThree, valueRow[2]);
formatRow(data.infoFour, valueRow[3]);
formatRow(data.infoFive, valueRow[4]);
