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

import {faker} from '@faker-js/faker';
import {render, screen} from '@testing-library/react';
import getKebabCase from '../../utils/getKebabCase';
import LiferayContact from '../LiferayContact';

const currentEndDate = faker.date.between();
const currentStartDate = faker.date.between();
const projectLiferayContactName = faker.name.findName();
const projectLiferayContactEmailAddress = faker.internet.email();
const projectLiferayContactRole = getKebabCase(faker.name.jobTitle());
const projectDxpVersion = faker.datatype.number({
	precision: 0.1,
});

const project = {
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
	slaExpired: null,
	slaExpiredEndDate: null,
	slaExpiredStartDate: null,
	slaFuture: 'Platinum Subscription',
	slaFutureEndDate: '2023-07-25T00:00:00Z',
	slaFutureStartDate: '2022-08-25T00:00:00Z',
};

test('renders project support liferay contact name, role and emailadress', () => {
	render(<LiferayContact project={project} />);
	const linkElementLiferayContactName = screen.getByText(
		projectLiferayContactName
	);
	const linkElementLiferayContactEmailAddress = screen.getByText(
		projectLiferayContactEmailAddress
	);
	const linkElementLiferayContactRole = screen.getByText(
		projectLiferayContactRole
	);

	expect(linkElementLiferayContactName).toBeInTheDocument();
	expect(linkElementLiferayContactEmailAddress).toBeInTheDocument();
	expect(linkElementLiferayContactRole).toBeInTheDocument();
});
