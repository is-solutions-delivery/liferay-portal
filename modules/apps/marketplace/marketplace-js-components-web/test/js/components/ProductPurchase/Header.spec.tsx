/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render} from '@testing-library/react';
import React from 'react';

import {ProductPurchase} from '../../../../src/main/resources/META-INF/resources/js/components/ProductPurchase/';

describe('Header', () => {
	it('testing Header with all different prop combinations', () => {
		const {container, queryAllByAltText, queryByText, rerender} = render(
			<ProductPurchase.Header
				subsectionTitleLeft="left title"
				subsectionTitleRight="right title"
				title="heading"
			/>
		);

		expect(container.querySelector('h1')).toBeTruthy();
		expect(queryByText('heading')).toBeInTheDocument();
		expect(queryByText('left title')).toBeInTheDocument();
		expect(queryByText('right title')).toBeInTheDocument();

		rerender(
			<ProductPurchase.Header
				subsectionTitleLeft="left title"
				subsectionTitleRight="right title"
				subtitle="subTitle"
				title="heading"
			/>
		);

		expect(queryByText('subTitle')).toBeInTheDocument();

		rerender(
			<ProductPurchase.Header
				subsectionTitleLeft="left title"
				subsectionTitleRight="right title"
				title="heading"
			>
				children
			</ProductPurchase.Header>
		);

		expect(queryByText('children')).toBeInTheDocument();

		rerender(
			<ProductPurchase.Header
				image="image/src"
				subsectionTitleLeft="left title"
				subsectionTitleRight="right title"
				title="heading"
			/>
		);

		expect(queryAllByAltText('App Icon')).toBeTruthy();

		rerender(
			<ProductPurchase.Header
				image="image/src"
				rightNode="right node"
				subsectionTitleLeft="left title"
				subsectionTitleRight="right title"
				title="heading"
			/>
		);

		expect(queryByText('right node')).toBeInTheDocument();

		rerender(
			<ProductPurchase.Header
				subsectionTitleLeft="left"
				subsectionTitleRight="right"
				title="This Title is Longer than 30 characters making it an h3"
			/>
		);

		expect(container.querySelector('h3')).toBeTruthy();
	});
});
