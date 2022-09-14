/* eslint-disable no-undef */
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

const defaultColor = configuration.textColor;
const h1Element = fragmentElement.querySelector('h1');
const h2Elements = fragmentElement.querySelectorAll('h2');

h1Element.style.color = defaultColor;
h2Elements.forEach((h2Element) => {
	h2Element.style.color = defaultColor;
});
