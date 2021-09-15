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

const btnBack = fragmentElement.querySelector('#contact-agent-btn-back');
const btnCall = fragmentElement.querySelector('#contact-agent-btn-call');
const nameCookieContextualMessage = 'raylife-contextual-message';
const nameCookieId = 'raylife-application-id';
const valueCall = fragmentElement.querySelector('#value-number-call')
	.textContent;

btnBack.onclick = function () {
	document.cookie = 'raylife-back-to-edit=true';
	window.history.back();
};

btnCall.onclick = function () {
	window.location.href = 'tel:' + valueCall;
};

function getCookie(name) {
	name = name + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.indexOf(name) == 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
}

const applicationIdCookie = getCookie(nameCookieId);

if (applicationIdCookie) {
	document.getElementById('content-agent-text-your-application').textContent =
		'Your Application #' + applicationIdCookie;
}

const contextualMessageCookie = getCookie(nameCookieContextualMessage);

if (contextualMessageCookie) {
	document.getElementById(
		'contact-agent-contextual-message'
	).textContent = contextualMessageCookie;
}
