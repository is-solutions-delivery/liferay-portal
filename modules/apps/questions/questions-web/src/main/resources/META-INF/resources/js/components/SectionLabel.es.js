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

import ClayLabel from '@clayui/label';
import React from 'react';

import {slugToText, stringToSlug} from '../utils/utils.es';

const getSectionTitle = (section) => {
	if (section.friendlyUrlPath === undefined) {
		return section.title;
	}

	if (stringToSlug(section.title) === section.friendlyUrlPath) {
		return section.title;
	}

	return `${section.title} (${slugToText(section.friendlyUrlPath)})`;
};

export default function SectionLabel({section}) {
	if (!section) {
		return null;
	}

	return (
		<ClayLabel
			className="bg-light border-0 stretched-link-layer text-uppercase"
			displayType="secondary"
			large
		>
			{getSectionTitle(section)}
		</ClayLabel>
	);
}

export {getSectionTitle};
