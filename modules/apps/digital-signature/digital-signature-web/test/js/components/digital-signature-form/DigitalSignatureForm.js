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

import {act, cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import {AppContext} from '../../../../src/main/resources/META-INF/resources/js/AppContext';
import DigitalSignatureForm from '../../../../src/main/resources/META-INF/resources/js/components/digital-signature-form/DigitalSignatureForm';

const DigitalSignatureFormWithProvider = (props) => (
	<AppContext.Provider value={{}}>
		<DigitalSignatureForm {...props} />
	</AppContext.Provider>
);

describe('DigitalSignatureForm', () => {
	afterEach(cleanup);

	it('Renders with the Send button disabled', () => {
		const {getByText} = render(<DigitalSignatureFormWithProvider />);

		const button = getByText('send');

		expect(button.hasAttribute('disabled')).toBeTruthy();
	});

	it('Validates required fields', async () => {
		const {asFragment, container, getByLabelText} = render(
			<DigitalSignatureFormWithProvider />
		);

		const inputEmailMessage = getByLabelText('email-message');

		await act(async () => {
			fireEvent.change(inputEmailMessage, {
				target: {
					value: 'Email Message',
				},
			});
		});

		const parentEnvelopeName = container
			.querySelector('[for="envelopeName"]')
			.closest('div');
		const parentRecipientFullName = container
			.querySelector('[for="recipients[0].fullName"]')
			.closest('div');
		const parentRecipentEmail = container
			.querySelector('[for="recipients[0].email"]')
			.closest('div');
		const parentEmailSubject = container
			.querySelector('[for="emailSubject"]')
			.closest('div');

		expect(parentEnvelopeName.classList.contains('has-error')).toBeTruthy();
		expect(
			parentRecipientFullName.classList.contains('has-error')
		).toBeTruthy();
		expect(
			parentRecipentEmail.classList.contains('has-error')
		).toBeTruthy();
		expect(parentEmailSubject.classList.contains('has-error')).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
