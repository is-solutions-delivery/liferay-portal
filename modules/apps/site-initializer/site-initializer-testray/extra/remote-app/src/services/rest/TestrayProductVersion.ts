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

import yupSchema from '../../schema/yup';
import {searchUtil} from '../../util/search';
import fetcher from '../fetcher';
import {APIResponse, TestrayProductVersion} from './types';

type ProductVersion = typeof yupSchema.team.__outputType;

const adapter = ({
	name,
	projectId: r_projectToProductVersions_c_projectId,
}: ProductVersion) => ({
	name,
	r_projectToProductVersions_c_projectId,
});

const updateProductVersion = (id: number, productVersion: ProductVersion) =>
	fetcher.put(`/productversions/${id}`, adapter(productVersion));

const nestedFieldsParam = 'nestedFields=project';

const productVersionsResource = `/productversions?${nestedFieldsParam}`;

const getProductVersionQuery = (productVersionId: number | string) =>
	`/productversions/${productVersionId}?${nestedFieldsParam}`;

const getProductVersionTransformData = (
	testrayProductVersion: TestrayProductVersion
): TestrayProductVersion => ({
	...testrayProductVersion,
	project: testrayProductVersion?.r_projectToProductVersions_c_project,
});

const getProductVersionsTransformData = (
	response: APIResponse<TestrayProductVersion>
) => ({
	...response,
	items: response?.items?.map(getProductVersionTransformData),
});

const createProductVersion = async (productVersion: ProductVersion) => {
	const response = await fetcher<APIResponse<TestrayProductVersion>>(
		`/productversions?filter=${searchUtil.eq(
			'projectId',
			productVersion.projectId as string
		)} and ${searchUtil.eq('name', productVersion.name)}`
	);

	if ((response?.totalCount as number) > 0) {
		throw new Error('The product version name already exists');
	}

	return fetcher.post('/productversions', adapter(productVersion));
};

export {
	productVersionsResource,
	createProductVersion,
	updateProductVersion,
	getProductVersionQuery,
	getProductVersionTransformData,
	getProductVersionsTransformData,
};
