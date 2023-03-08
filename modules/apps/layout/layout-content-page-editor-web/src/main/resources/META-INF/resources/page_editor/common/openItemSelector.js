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

import {openSelectionModal} from 'frontend-js-web';

export function openItemSelector({
	callback,
	eventName,
	itemSelectorURL,
	destroyedCallback = null,
	modalProps = {},
	transformValueCallback,
}) {
	openSelectionModal({
		onClose: destroyedCallback,
		onSelect: (selection) => {
			let infoItem = {
				...selection,
			};

			let value;

			if (selection.value) {
				if (typeof selection.value === 'string') {
					try {
						value = JSON.parse(selection.value);
					}
					catch (error) {}
				}
				else if (
					selection.value &&
					typeof selection.value === 'object'
				) {
					value = selection.value;
				}

				if (value) {
					delete infoItem.value;
					infoItem = {...infoItem, ...value};
				}
			}
			else if (typeof selection === 'object') {
				infoItem = Object.values(selection)[0];
			}

			infoItem = transformValueCallback(infoItem);

			infoItem = callback(infoItem);
		},
		selectEventName: eventName,
		title: Liferay.Language.get('select'),
		url: itemSelectorURL,
		...modalProps,
	});
}
