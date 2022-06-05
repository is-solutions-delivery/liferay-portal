/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ('License'). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {faker} from '@faker-js/faker';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import SlaCard from '.';
import {FORMAT_DATE} from '../../../../common/utils/constants/slaCardDate';
import getDateCustomFormat from '../../utils/getDateCustomFormat';
import getKebabCase from '../../utils/getKebabCase';

const currentEndDate = faker.date.between();
const currentStartDate = faker.date.between();
const projectLiferayContactName = faker.name.findName();
const projectLiferayContactEmailAddress = faker.internet.email();
const projectLiferayContactRole = getKebabCase(faker.name.jobTitle());
const projectDxpVersion = faker.datatype.number({
	precision: 0.1,
});

const projectMock = {
	accountKey: 'ERC-006',
	code: 'PROJECT06',
	dxpVersion: projectDxpVersion,
	liferayContactEmailAddress: projectLiferayContactEmailAddress,
	liferayContactName: projectLiferayContactName,
	liferayContactRole: projectLiferayContactRole,
	maxRequestors: 2,
	name: 'Project 06',
	partner: false,
	region: faker.address.country(),
	slaCurrent: 'Limited Subscription',
	slaCurrentEndDate: currentEndDate,
	slaCurrentStartDate: currentStartDate,
	slaExpired: 'Gold Subscription',
	slaExpiredEndDate: '2018-07-25T00:00:00Z',
	slaExpiredStartDate: '2017-08-25T00:00:00Z',
	slaFuture: 'Platinum Subscription',
	slaFutureEndDate: '2024-07-25T00:00:00Z',
	slaFutureStartDate: '2023-08-25T00:00:00Z',
};

const projectNoSlaMock = {
	accountKey: 'ERC-008',
	code: 'PROJECT08',
	dxpVersion: null,
	liferayContactEmailAddress: projectLiferayContactEmailAddress,
	liferayContactName: projectLiferayContactName,
	liferayContactRole: projectLiferayContactRole,
	maxRequestors: 1,
	name: 'Project 08',
	partner: false,
	region: faker.address.country(),
	slaCurrent: null,
	slaCurrentEndDate: null,
	slaCurrentStartDate: null,
	slaExpired: null,
	slaExpiredEndDate: null,
	slaExpiredStartDate: null,
	slaFuture: null,
	slaFutureEndDate: null,
	slaFutureStartDate: null,
};

test('renders SLA Card', () => {
	render(<SlaCard project={projectMock} />);
});

test('renders SLA Card start and end date', () => {
	render(<SlaCard project={projectMock} />);
	const linkElementNameslaCurrent = screen.getByText('Limited');
	const linkElementNameslaExpired = screen.getByText('Gold');
	const linkElementNameslaFuture = screen.getByText('Platinum');

	const linkElementEndDate = screen.getByText(
		getDateCustomFormat(currentEndDate, FORMAT_DATE),
		{exact: false}
	);

	const linkElementStartDate = screen.getByText(
		getDateCustomFormat(currentEndDate, FORMAT_DATE),
		{exact: false}
	);
	expect(linkElementNameslaCurrent).toBeInTheDocument();
	expect(linkElementNameslaExpired).toBeInTheDocument();
	expect(linkElementNameslaFuture).toBeInTheDocument();

	expect(linkElementEndDate).toBeInTheDocument();
	expect(linkElementStartDate).toBeInTheDocument();
});

test('renders SLA Card with no SLA on the project', () => {
	render(<SlaCard project={projectNoSlaMock} />);
	const linkElement = screen.getByText(
		"The project's Support Level is displayed here for projects with ticketing support."
	);
	expect(linkElement).toBeInTheDocument();
});

test('test if when user has multiple statuses, the status order went from highest to lowest (Current > Future > Expired)', async () => {
	const user = userEvent.setup();
	render(<SlaCard project={projectMock} />);
	const linkElementName = screen.getByText('Current');
	expect(linkElementName).toBeInTheDocument();
	expect(screen.getByRole('button')).toBeInTheDocument();
	await user.click(screen.getByRole('button'));
	const linkElementName2 = screen.getByText('Future');
	expect(linkElementName2).toBeInTheDocument();
	await user.click(screen.getByRole('button'));
	const linkElementName3 = screen.getByText('Expired');
	expect(linkElementName3).toBeInTheDocument();
});
