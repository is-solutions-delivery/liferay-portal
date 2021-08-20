/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useFormContext, useWatch, Controller} from 'react-hook-form';

import {Radio} from '../../../../fragments/Forms/Radio';
import {LiferayService} from '../../../../../services/liferay';

export const BusinessTypeRadioGroup = ({businessTypes = []}) => {
	const {control, setValue} = useFormContext();
	const form = useWatch();

	useEffect(() => {
		if (form?.basics?.businessCategoryId) setCategoryProperties();
	}, [form?.basics?.businessCategoryId]);

	const setCategoryProperties = async () => {
		try {
			const categoryId = form.basics.businessCategoryId;

			const categoryProperties = await LiferayService.getCategoryProperties(
				categoryId
			);

			setValue(
				'basics.properties.businessClassCode',
				categoryProperties.find(({key}) => key === 'BCC')?.value
			);
			setValue(
				'basics.properties.naics',
				categoryProperties.find(({key}) => key === 'NAICS')?.value
			);
			setValue(
				'basics.properties.segment',
				categoryProperties.find(({key}) => key === 'Segment')?.value
			);
		} catch (error) {
			console.warn(error);
		}
	};

	return (
		<fieldset id="businessType" className="content-column">
			<Controller
				name="basics.businessCategoryId"
				defaultValue=""
				control={control}
				rules={{required: 'Please, Select a field.'}}
				render={({field}) =>
					businessTypes.map((businessType) => (
						<Radio
							{...field}
							key={businessType.id}
							value={businessType.id}
							label={businessType.title}
							description={businessType.description}
							selected={
								businessType.id ===
								form?.basics?.businessCategoryId
							}
						/>
					))
				}
			/>
		</fieldset>
	);
};
