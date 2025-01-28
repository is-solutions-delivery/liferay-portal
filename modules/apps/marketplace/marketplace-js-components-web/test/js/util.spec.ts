/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';

import {sanitizeHTML} from '../../src/main/resources/META-INF/resources/js/util';

describe('sanitizeHTML', () => {
	it('will remove disallowed tags', () => {
		const input = '<a href="#">Link</a><div>will be removed</div>';
		const sanitized = sanitizeHTML(input);

		expect(sanitized).toContain('<a href="#">Link</a>');
		expect(sanitized).not.toContain('<div>will be removed</div>');
	});

	it('will keep allowed tags', () => {
		const input = '<b>Bold</b><em>Emphasized</em><span>Text</span>';
		const sanitized = sanitizeHTML(input);

		expect(sanitized).toContain('<b>Bold</b>');
		expect(sanitized).toContain('<em>Emphasized</em>');
		expect(sanitized).toContain('<span>Text</span>');
	});

	it('will remove disallowed attributes from allowed tags', () => {
		const input = '<a href="#" onclick="alert(1)">Link</a>';
		const sanitized = sanitizeHTML(input);

		expect(sanitized).toContain('<a href="#">Link</a>');
		expect(sanitized).not.toContain('onclick');
	});

	it('will keep allowed attributes on allowed tags', () => {
		const input = '<a href="#" target="_blank">Link</a>';
		const sanitized = sanitizeHTML(input);

		expect(sanitized).toContain('<a href="#" target="_blank">Link</a>');
	});

	it('will handle an empty string properly', () => {
		const sanitized = sanitizeHTML('');
		expect(sanitized).toBe('');
	});

	it('will handle a string with only disallowed tags', () => {
		const input = '<script>alert("XSS")</script>';
		const sanitized = sanitizeHTML(input);

		expect(sanitized).not.toContain('<script>');
	});
});
