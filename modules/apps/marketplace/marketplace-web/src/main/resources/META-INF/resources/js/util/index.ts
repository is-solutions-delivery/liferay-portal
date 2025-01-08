/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Product} from '../types';

export function getProductSpecification(
	product: Product,
	specificationKey: string
) {
	return product.productSpecifications.find(
		(specification) => specification.specificationKey === specificationKey
	);
}

export function getCategoryVocabulary(product: Product, vocabulary: string) {
	return product.categories.filter(
		(category) => category?.vocabulary === vocabulary
	);
}
