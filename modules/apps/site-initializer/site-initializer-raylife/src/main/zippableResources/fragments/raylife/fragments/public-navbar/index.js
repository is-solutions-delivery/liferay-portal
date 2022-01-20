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

const checkbox = fragmentElement.querySelector('#togBtn');
const sliderBefore = fragmentElement.querySelector(
	'.public-site-navbar .switch .slider'
);
const sliderOn = fragmentElement.querySelector(
	'.public-site-navbar .switch .slider .on'
);
const sliderOff = fragmentElement.querySelector(
	'.public-site-navbar .switch .slider .off'
);

function changeBeforeText(checked) {
	if (checked) {
		sliderBefore.setAttribute(
			'data-content',
			sliderOn.firstChild.nodeValue
		);
	}
	else {
		sliderBefore.setAttribute(
			'data-content',
			sliderOff.firstChild.nodeValue
		);
	}
}

changeBeforeText(checkbox.checked);

checkbox.addEventListener('click', (event) => {
	changeBeforeText(event.target.checked);
});

const menuButton = fragmentElement.querySelector('.raylife-navbar-button');
const myDropdown = fragmentElement.querySelector('#myDropdown');
const menuGrid = fragmentElement.querySelector('.menu-grid');
const menuClose = fragmentElement.querySelector('.menu-close');

menuButton.addEventListener('click', () => {
	['show-menu', 'hiden-menu'].map((cssClass) => {
		myDropdown.classList.toggle(cssClass);
	});
	['show-icon', 'hiden-icon'].map((cssClass) => {
		menuGrid.classList.toggle(cssClass);
	});
	['show-icon', 'hiden-icon'].map((cssClass) => {
		menuClose.classList.toggle(cssClass);
	});
	if (myDropdown.classList.contains('show-menu')) {
		fragmentElement.querySelector(
			'.raylife-navbar-button div span'
		).innerText = 'CLOSE';
	}
	else {
		fragmentElement.querySelector(
			'.raylife-navbar-button div span'
		).innerText = 'MENU';
	}
});

menuButton.addEventListener('blur', () => {
	if (myDropdown.classList.contains('show-menu')) {
		['show-menu', 'hiden-menu'].map((cssClass) => {
			myDropdown.classList.toggle(cssClass);
		});
		['show-icon', 'hiden-icon'].map((cssClass) => {
			menuGrid.classList.toggle(cssClass);
		});
		['show-icon', 'hiden-icon'].map((cssClass) => {
			menuClose.classList.toggle(cssClass);
		});
		if (myDropdown.classList.contains('show-menu')) {
			fragmentElement.querySelector(
				'.raylife-navbar-button div span'
			).innerText = 'CLOSE';
		}
		else {
			fragmentElement.querySelector(
				'.raylife-navbar-button div span'
			).innerText = 'MENU';
		}
	}
});
