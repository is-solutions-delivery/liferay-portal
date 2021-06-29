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

import {act, cleanup, render} from '@testing-library/react';
import React, {createContext} from 'react';

import {AppContext} from '../../../../src/main/resources/META-INF/resources/js/AppContext';
import EnvelopeView from '../../../../src/main/resources/META-INF/resources/js/pages/envelope/EnvelopeView';

const data = {
	envelope: {
		createdLocalDateTime: '2021-01-01T12:30:00.000',
		documents: [
			{
				documentId: 'document1',
				fileExtension: 'pdf',
				name: 'file.pdf',
			},
		],
		emailBlurb: 'Email Message',
		emailSubject: 'Email Subject',
		envelopeId: 'envelope1',
		name: 'Test Envelope Name',
		recipients: {
			signers: [
				{
					email: 'test@liferay.com',
					name: 'Recipient Full Name',
					recipientId: 'recipient1',
					status: 'autoresponded',
				},
			],
		},
		senderEmailAddress: 'test@liferay.com',
		status: 'sent',
	},
	fileEntries: [],
};

const Context = createContext();

const EnvelopeViewWithProvider = (props) => (
	<AppContext.Provider
		value={{
			baseResourceURL:
				'http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_digital_signature_web_internal_portlet_DigitalSignaturePortlet',
		}}
	>
		<EnvelopeView {...props} />
	</AppContext.Provider>
);

describe('EnvelopeView', () => {
	afterEach(cleanup);

	beforeEach(() => {
		jest.useFakeTimers();
	});

	it('renders', async () => {
		fetch.mockResponseOnce(JSON.stringify(data));

		const {asFragment} = render(
			<EnvelopeViewWithProvider
				AppContext={Context}
				match={{params: {envelopeId: 1}}}
			/>
		);

		await act(async () => {
			await jest.runAllTimers();
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
