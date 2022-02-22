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

import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import React from 'react';

import SaveTemplate from '../../../src/main/resources/META-INF/resources/js/SaveTemplate';
import {SCHEMA_SELECTED_EVENT} from '../../../src/main/resources/META-INF/resources/js/constants';

const BASE_PROPS = {
	evaluateForm: () => {},
	formIsValid: true,
	formSaveAsTemplateDataQuerySelector: 'form',
	formSaveAsTemplateURL: 'https://formUrl.test',
	portletNamespace: 'test',
	type: 'import',
};
const INPUT_VALUE_TEST = 'test';

function fireSchemaChangeEvent() {
	Liferay.fire(SCHEMA_SELECTED_EVENT, {schema: 'something'});
}

describe('SaveTemplateModal', () => {
	beforeEach(() => {
		const form = document.createElement('form');

		form.innerHTML = `
			<input type="text" value="${INPUT_VALUE_TEST}" />
		`;

		document.body.appendChild(form);
	});

	afterEach(() => {
		fetchMock.restore();
	});

	it('must render a save template button', () => {
		const {getByText} = render(<SaveTemplate {...BASE_PROPS} />);

		expect(
			getByText(Liferay.Language.get('save-as-template'))
		).toBeInTheDocument();
	});

	it('must initially have the button disabled', () => {
		const {getByText} = render(<SaveTemplate {...BASE_PROPS} />);

		expect(
			getByText(Liferay.Language.get('save-as-template'))
		).toBeDisabled();
	});

	it('must enable the button on Schema Change Event', () => {
		const {getByText} = render(<SaveTemplate {...BASE_PROPS} />);

		act(() => {
			fireSchemaChangeEvent();
		});

		expect(
			getByText(Liferay.Language.get('save-as-template'))
		).not.toBeDisabled();
	});

	it('must evaluate the form when the button is clicked', async () => {
		const evaluate = jest.fn();

		const {getByText} = render(
			<SaveTemplate {...BASE_PROPS} evaluateForm={evaluate} />
		);

		act(() => {
			fireSchemaChangeEvent();
		});

		act(() => {
			fireEvent.click(
				getByText(Liferay.Language.get('save-as-template'))
			);
		});

		expect(evaluate).toBeCalled();
	});

	it('must not show modal when the button is clicked and the form has no errors', async () => {
		const {getByText, queryByText} = render(
			<SaveTemplate {...BASE_PROPS} formIsValid={false} />
		);

		act(() => {
			fireSchemaChangeEvent();
		});

		act(() => {
			fireEvent.click(
				getByText(Liferay.Language.get('save-as-template'))
			);
		});

		expect(
			await queryByText(Liferay.Language.get('save'))
		).not.toBeInTheDocument();
	});

	it('must show modal when the button is clicked and the form has no errors', async () => {
		const {findByText, getByText} = render(
			<SaveTemplate {...BASE_PROPS} />
		);

		act(() => {
			fireSchemaChangeEvent();
		});

		act(() => {
			fireEvent.click(
				getByText(Liferay.Language.get('save-as-template'))
			);
		});

		const saveButton = await findByText(Liferay.Language.get('save'));

		expect(saveButton).toBeInTheDocument();
	});

	describe('modal', () => {
		it('must have the button disabled if no text input provided', async () => {
			const {findByText, getByText} = render(
				<SaveTemplate {...BASE_PROPS} />
			);

			act(() => {
				fireSchemaChangeEvent();
			});

			act(() => {
				fireEvent.click(
					getByText(Liferay.Language.get('save-as-template'))
				);
			});

			const saveButton = await findByText(Liferay.Language.get('save'));

			expect(saveButton).toBeDisabled();
		});

		it('must has button enabled if text input provided', async () => {
			const testName = 'test';

			const {findByText, getByPlaceholderText, getByText} = render(
				<SaveTemplate {...BASE_PROPS} />
			);

			act(() => {
				fireSchemaChangeEvent();
			});

			act(() => {
				fireEvent.click(
					getByText(Liferay.Language.get('save-as-template'))
				);
			});

			await findByText(Liferay.Language.get('save'));

			act(() => {
				fireEvent.change(
					getByPlaceholderText(Liferay.Language.get('template-name')),
					{target: {value: testName}}
				);
			});

			expect(getByText(Liferay.Language.get('save'))).not.toBeDisabled();
		});

		it('must call api with form data and add the input field data', async () => {
			const mockedApi = fetchMock.mock(
				BASE_PROPS.formSaveAsTemplateURL,
				() => {
					return {test: 'test'};
				}
			);

			const testName = 'test';
			const {
				findByText,
				getByPlaceholderText,
				getByText,
				queryByLabelText,
			} = render(<SaveTemplate {...BASE_PROPS} />);

			act(() => {
				fireSchemaChangeEvent();
			});

			act(() => {
				fireEvent.click(
					getByText(Liferay.Language.get('save-as-template'))
				);
			});

			await findByText(Liferay.Language.get('save'));

			act(() => {
				fireEvent.change(
					getByPlaceholderText(Liferay.Language.get('template-name')),
					{target: {value: testName}}
				);
			});

			act(() => {
				fireEvent.click(getByText(Liferay.Language.get('save')));
			});

			expect(mockedApi.called()).toBe(true);

			await waitFor(() => {
				expect(
					queryByLabelText(Liferay.Language.get('name'))
				).toBeNull();
			});
		});
	});
});
