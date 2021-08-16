/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {useFormContext, useWatch, Controller} from 'react-hook-form';

import {TIP_EVENT} from '../../../../../events';
import {Radio} from '../../../../fragments/Forms/Radio';
import {LiferayService} from '../../../../../services/liferay';
import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {useCustomEvent} from '../../../../../hooks/useCustomEvent';

export const BusinessTypeRadioGroup = ({businessTypes = []}) => {
	const [dispatchEvent] = useCustomEvent(TIP_EVENT);
	const {control, setValue} = useFormContext();
	const {selectedStep} = useStepWizard();
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
			<button
				type="button"
				className="btn badge"
				style={{width: 'fit-content'}}
				onClick={() =>
					dispatchEvent({
						templateName: 'i-am-unable-to-find-my-industry',
						step: selectedStep,
					})
				}
			>
				I am unable to find my industry
			</button>
		</fieldset>
	);
};
