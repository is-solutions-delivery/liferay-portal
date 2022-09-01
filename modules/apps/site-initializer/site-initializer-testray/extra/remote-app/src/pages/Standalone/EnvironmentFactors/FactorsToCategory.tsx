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

import {useCallback} from 'react';

import DualListBox from '../../../components/Form/DualListBox';
import {useFetch} from '../../../hooks/useFetch';
import i18n from '../../../i18n';
import yupSchema from '../../../schema/yup';
import {APIResponse, TestrayFactor} from '../../../services/rest';
import {testrayFactorRest} from '../../../services/rest/TestrayFactor';
import {searchUtil} from '../../../util/search';
import {State} from './EnviromentFactorsModal';

type FactorCategoryForm = typeof yupSchema.factorCategory.__outputType;

type EnvironmentFactorsModalProps = {
	lastStep: Boolean;
	routineId: number;
	setState?: any;
	state?: State;
};
const onMapAvailable = ({id, name}: FactorCategoryForm) => ({
	label: name,
	value: id,
});
const onMapSelected = ({id, name}: FactorCategoryForm) => ({
	label: name,
	value: id,
});
const FactorsToCategory: React.FC<EnvironmentFactorsModalProps> = ({
	lastStep,
	routineId,
	setState,
	state,
}) => {
	const {data: factorCategoryResponse, isValidating} = useFetch<
		APIResponse<FactorCategoryForm>
	>(!lastStep ? `/factorcategories` : null);

	const {data: factorResponse} = useFetch<APIResponse<TestrayFactor>>(
		!isValidating && !lastStep
			? `${testrayFactorRest.resource}&filter=${searchUtil.eq(
					'routineId',
					routineId
			  )}`
			: null,
		(response) => testrayFactorRest.transformDataFromList(response)
	);

	const getCategoryDualBox = useCallback(() => {
		const selectedItems =
			factorResponse?.items.map(({factorCategory}) => factorCategory) ||
			[];

		const availableItems =
			factorCategoryResponse?.items.filter(
				(factorCategory) =>
					!selectedItems.find(
						(item) => Number(item?.id) === Number(factorCategory.id)
					)
			) || [];

		return [
			availableItems?.map(onMapAvailable),
			selectedItems.map(onMapSelected as any),
		];
	}, [factorCategoryResponse, factorResponse]);

	const categoryDualBox = getCategoryDualBox();

	return (
		<DualListBox
			boxes={categoryDualBox}
			leftLabel={i18n.translate('Available')}
			rightLabel={i18n.translate('Selected')}
			setValue={setState}
		/>
	);
};

export default FactorsToCategory;
