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

import {useEffect} from 'react';
import {useState} from 'react';

import Form from '../../../components/Form';
import {useFetch} from '../../../hooks/useFetch';
import {
	APIResponse,
	TestrayFactor,
	getFactorOptionQuery,
	testrayFactorRest,
} from '../../../services/rest';
import {testrayFactorCategoryRest} from '../../../services/rest/TestrayFactorCategory';
import {searchUtil} from '../../../util/search';

type FactorsToOptionsProps = {
	lastStep: Boolean;
	routineId: number;
};

const FactorsToOptions: React.FC<FactorsToOptionsProps> = ({
	lastStep,
	routineId,
}) => {
	const [factorOptionsList, setFactorOptionsList] = useState<
		TestrayFactor[][]
	>([[] as any]);
	const {data: factorsData} = useFetch<APIResponse<TestrayFactor>>(
		`${testrayFactorRest.resource}&filter=${searchUtil.eq(
			'routineId',
			routineId
		)}`,
		(response) => testrayFactorRest.transformDataFromList(response)
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const factorItems = factorsData?.items || [];

	console.log(factorOptionsList);

	useEffect(() => {
		testrayFactorCategoryRest
			.getFactoryCategoryItems(factorItems)
			.then(setFactorOptionsList);
	}, [factorItems]);

	return (
		<>
			{factorItems.map((factorItem, index) => (
				<Form.Select
					defaultOption={false}
					defaultValue={factorItem.factorOption?.id}
					key={index}
					label={factorItem.factorCategory?.name}
					multiple={!lastStep}
					name="type"
					options={(factorOptionsList[index] || []).map(
						({id, name}: any) => ({
							label: name,
							value: id,
						})
					)}
					required
				/>
			))}
		</>
	);
};

export default FactorsToOptions;
