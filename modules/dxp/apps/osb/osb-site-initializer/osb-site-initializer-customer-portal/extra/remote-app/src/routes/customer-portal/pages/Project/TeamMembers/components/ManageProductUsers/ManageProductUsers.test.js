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

import {MockedProvider} from '@apollo/client/testing';
import {render} from '@testing-library/react';
import ManageProductUsers from './ManageProductUsers';

jest.mock('../../../../../../../common/contexts/AppPropertiesContext', () => ({
	useAppPropertiesContext: () => ({
		client: {
			query: () => ({}),
		},
	}),
}));

const mockedProps = {
	project: {accountKey: 'Test'},
	subscriptionGroups: [],
};

describe('Manage Product Users', () => {
	beforeEach(() => {
		mockedProps.subscriptionGroups = [];
	});

	it('renders in the screen liferay experience cloud with status active ', () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'Active',
			name: 'Liferay Experience Cloud',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeTruthy();
	});

	it("doesn't renders in the screen with status in progress", () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'In Progress',
			name: 'Liferay Experience Cloud',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeFalsy();
	});

	it('renders in the screen analytics cloud with status active', () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'Active',
			name: 'Analytics Cloud',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeTruthy();
	});

	it("doesn't renders in the screen with status in progress", () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'In Progress',
			name: 'Analytics Cloud',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeFalsy();
	});

	it('renders in the screen LXC-SM with status active', () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'Active',
			name: 'LXC-SM',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeTruthy();
	});

	it("doesn't renders in the screen with status in progress", () => {
		mockedProps.subscriptionGroups.push({
			activationStatus: 'In Progress',
			name: 'LXC-SM',
		});

		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeFalsy();
	});

	it("doesn't renders without valid subscription group", () => {
		const {queryByTestId} = render(
			<MockedProvider>
				<ManageProductUsers {...mockedProps} />
			</MockedProvider>
		);

		expect(queryByTestId('test-id')).toBeFalsy();
	});
});
