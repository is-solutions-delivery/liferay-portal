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

import {render} from '@liferay/frontend-js-react-web';
import {fetch, openToast} from 'frontend-js-web';

import TemplateSelect from './TemplateSelect';
import {
	SCHEMA_SELECTED_EVENT,
	TEMPLATE_SELECTED_EVENT,
	TEMPLATE_SOILED_EVENT,
} from './constants';

const HEADERS = new Headers({
	'content-type': 'application/json',
	'x-csrf-token': window.Liferay.authToken,
});

function trimPackage(name) {
	if (!name || name.lastIndexOf('.') < 0) {
		return name;
	}

	return name.substr(name.lastIndexOf('.') + 1);
}

function getOptionElement(label, schemaName, selected, value) {
	const optionElement = document.createElement('option');

	optionElement.innerHTML = label;
	optionElement.value = value;

	if (selected) {
		optionElement.selected = true;
	}

	if (schemaName) {
		optionElement.setAttribute('schemaName', schemaName);
	}

	return optionElement;
}

export default function ({
	initialExternalType,
	initialTemplateClassName,
	initialTemplateHeadlessEndpoint,
	initialTemplateMapping,
	namespace,
	templatesOptions,
}) {
	const headlessEnpointSelect = document.querySelector(
		`#${namespace}headlessEndpoint`
	);
	const internalClassNameSelect = document.querySelector(
		`#${namespace}internalClassName`
	);
	const taskItemDelegateNameInput = document.querySelector(
		`#${namespace}taskItemDelegateName`
	);
	const externalTypeInput = document.querySelector(
		`#${namespace}externalType`
	);

	async function handleTemplateSelectedEvent({template}) {
		if (template) {
			if (template.externalType) {
				externalTypeInput.value = template.externalType;
			}

			const headlessTemplateOption = headlessEnpointSelect.querySelector(
				`option[value='${template.headlessEndpoint}']`
			);

			headlessTemplateOption.selected = true;

			await handleHeadlessSelectChange();

			const internalClassTemplateOption = internalClassNameSelect.querySelector(
				`option[value='${template.internalClassName}']`
			);

			internalClassTemplateOption.selected = true;

			await handleClassNameSelectChange();
		}
	}

	async function handleHeadlessSelectChange(event) {
		if (event) {
			Liferay.fire(TEMPLATE_SOILED_EVENT);
			event.target.disabled = true;
		}

		const headlessEnpoint = headlessEnpointSelect.value;

		if (!headlessEnpoint) {
			internalClassNameSelect.innerHTML = '';

			return;
		}

		try {
			const response = await fetch(headlessEnpoint, {
				credentials: 'include',
				headers: HEADERS,
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch: '${headlessEnpointSelect}'`);
			}

			const {components} = await response.json();

			internalClassNameSelect.innerHTML = '';

			internalClassNameSelect.appendChild(
				getOptionElement('', '', false, '')
			);

			const keys = Object.keys(components.schemas).sort();

			keys.forEach((key) => {
				const properties = components.schemas[key].properties;

				if (!properties || !properties['x-class-name']) {
					return;
				}

				const className = properties['x-class-name'].default;
				const schemaName = properties['x-schema-name']?.default;

				const optionElement = getOptionElement(
					trimPackage(className),
					schemaName,
					false,
					className
				);

				internalClassNameSelect.appendChild(optionElement);
			});

			Liferay.fire(SCHEMA_SELECTED_EVENT, {
				schema: null,
			});

			internalClassNameSelect.disabled = false;
		}
		catch (error) {
			openToast({
				message: Liferay.Language.get('your-request-has-failed'),
				type: 'danger',
			});

			console.error('Failed to fetch ' + error);
		}
		finally {
			if (event) {
				event.target.disabled = false;
			}
		}
	}

	async function handleClassNameSelectChange(event) {
		if (event) {
			Liferay.fire(TEMPLATE_SOILED_EVENT);
		}

		const headlessEnpointValue = headlessEnpointSelect.value;

		const selectedOption =
			internalClassNameSelect.options[
				internalClassNameSelect.selectedIndex
			];

		const schemaName = selectedOption.getAttribute('schemaName');

		taskItemDelegateNameInput.value = schemaName || 'DEFAULT';

		const internalClassNameValue = trimPackage(
			schemaName || selectedOption.value
		);

		if (!internalClassNameValue) {
			Liferay.fire(SCHEMA_SELECTED_EVENT, {
				schema: null,
			});

			return;
		}

		try {
			const response = await fetch(headlessEnpointValue, {
				credentials: 'include',
				headers: HEADERS,
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch: '${headlessEnpointValue}'`);
			}

			const {components} = await response.json();

			const schemaEntry = components.schemas[internalClassNameValue];

			schemaEntry.required?.forEach((requiredField) => {
				schemaEntry.properties[requiredField].required = true;
			});

			Liferay.fire(SCHEMA_SELECTED_EVENT, {
				schema: schemaEntry.properties,
			});
		}
		catch (error) {
			openToast({
				message: Liferay.Language.get('your-request-has-failed'),
				type: 'danger',
			});

			console.error(`Failed to fetch ${error}`);
		}
	}

	Liferay.on(TEMPLATE_SELECTED_EVENT, handleTemplateSelectedEvent);

	headlessEnpointSelect.addEventListener(
		'change',
		handleHeadlessSelectChange
	);

	internalClassNameSelect.addEventListener(
		'change',
		handleClassNameSelectChange
	);

	let initialTemplate;

	if (
		initialTemplateHeadlessEndpoint &&
		initialTemplateClassName &&
		initialTemplateMapping
	) {
		initialTemplate = {
			externalType: initialExternalType,
			headlessEndpoint: initialTemplateHeadlessEndpoint,
			internalClassName: initialTemplateClassName,
			mapping: initialTemplateMapping,
		};
	}

	render(
		TemplateSelect,
		{
			initialTemplate,
			initialTemplateOptions: templatesOptions,
			portletNamespace: namespace,
		},
		document.getElementById(`${namespace}templateSelect`)
	);

	return {
		dispose: () => {
			Liferay.detach(
				TEMPLATE_SELECTED_EVENT,
				handleTemplateSelectedEvent
			);
		},
	};
}
