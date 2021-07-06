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

import {act, render} from '@testing-library/react';
import React from 'react';

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

const EnvelopeViewWithProvider = (props) => (
	<AppContext.Provider
		value={{baseResourceURL: 'http://localhost:8080?p_p_id=unitTest'}}
	>
		<EnvelopeView {...props} />
	</AppContext.Provider>
);

describe('EnvelopeView', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	it('renders', async () => {
		fetch.mockResponseOnce(JSON.stringify(data));

		render(<EnvelopeViewWithProvider match={{params: {envelopeId: 1}}} />);

		await act(async () => {
			await jest.runAllTimers();
		});
	});
});
