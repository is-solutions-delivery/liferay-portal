/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {fireEvent, render} from '@testing-library/react';
import React from 'react';

import Carousel from '../../../src/main/resources/META-INF/resources/js/components/Carousel';

const mockPrev = jest.fn();

const mockNext = jest.fn();

const mockSelect = jest.fn();

const imagesURL = [
	'https://liferay.com/liferay-logo.png',
	'https://liferay.com/liferay-waffle.png',
	'https://liferay.com/liferay-ray.png',
];

describe('Carousel', () => {
	it('rendering components withou clicking button', () => {
		const {container} = render(<Carousel images={imagesURL} />);

		const images = container.querySelectorAll('img');

		const previousButton = container.querySelector(
			'.left'
		) as HTMLButtonElement;
		previousButton?.addEventListener('click', mockPrev);

		const nextButton = container.querySelector(
			'.right'
		) as HTMLButtonElement;
		nextButton?.addEventListener('click', mockNext);

		const selectButton = container.querySelector(
			'.gallery-image'
		) as HTMLButtonElement;
		selectButton?.addEventListener('click', mockSelect);

		const slide = container.querySelector('.carousel-image');

		expect(slide).toHaveAttribute('alt', `Slide 0`);
		expect(images[0]).toHaveAttribute('src', `${imagesURL[0]}`);
		expect(images[1]).toHaveAttribute('src', `${imagesURL[0]}`);
		expect(images[2]).toHaveAttribute('src', `${imagesURL[1]}`);
		expect(images[3]).toHaveAttribute('src', `${imagesURL[2]}`);

		fireEvent.click(previousButton);
		expect(images[0]).toHaveAttribute('src', `${imagesURL[2]}`);
		expect(slide).toHaveAttribute('alt', 'Slide 2');

		fireEvent.click(nextButton);
		expect(mockNext).toHaveBeenCalled();

		expect(images[0]).toHaveAttribute('src', `${imagesURL[0]}`);
		expect(slide).toHaveAttribute('alt', 'Slide 0');

		fireEvent.click(nextButton);
		expect(mockPrev).toHaveBeenCalled();

		expect(images[0]).toHaveAttribute('src', `${imagesURL[1]}`);
		expect(slide).toHaveAttribute('alt', 'Slide 1');

		fireEvent.click(previousButton);
		expect(images[0]).toHaveAttribute('src', `${imagesURL[0]}`);
		expect(slide).toHaveAttribute('alt', 'Slide 0');

		fireEvent.click(selectButton);
		expect(mockSelect).toHaveBeenCalledTimes(1);
	});
});
