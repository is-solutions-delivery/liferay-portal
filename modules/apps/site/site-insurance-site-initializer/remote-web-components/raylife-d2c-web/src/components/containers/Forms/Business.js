import React from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {AVAILABLE_STEPS} from '../../../utils/constants';
import {useStepWizard} from '../../../hooks/useStepWizard';
import {TIP_EVENT} from '../../../events';
import {CardFormActionsWithSave} from '../../fragments/Card/FormActionsWithSave';
import {ControlledSwitch} from '../../connectors/Controlled/Switch';
import {NumberControlledInput} from '../../connectors/Controlled/Input/Number';
import {PercentageControlledInput} from '../../connectors/Controlled/Input/WithMask/Percentage';
import {LegalEntityControlledSelect} from '../../connectors/Controlled/Select/LegalEntity';
import {PERCENTAGE_REGEX_MAX_100} from '../../../utils/patterns';
import {
	validateOverallSales,
	validateOwnBrandLabel,
	validatePercentSales,
} from '../../../utils/businessFields';

const setFormPath = (value) => `business.${value}`;

export const FormBusiness = () => {
	const {
		control,
		formState: {isValid},
	} = useFormContext();
	const {selectedStep, setSection} = useStepWizard();
	const form = useWatch();

	const goToPreviousForm = () =>
		setSection(AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE);

	const goToNextForm = () => setSection(AVAILABLE_STEPS.EMPLOYEES);

	return (
		<div className="card">
			<div className="card-content">
				<NumberControlledInput
					name={setFormPath('yearsOfExperience')}
					label="Years of industry experience?"
					rules={{
						required: 'This field is required',
						min: {
							value: 0,
							message: 'Must be equal or grater than 0.',
						},
					}}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'years-of-industry-experience',
							step: selectedStep,
							inputName: setFormPath('yearsOfExperience'),
							value: form?.business?.yearsOfExperience,
						},
					}}
					control={control}
				/>
				<ControlledSwitch
					name={setFormPath('hasStoredCustomerInformation')}
					label="Do you store personally identifiable information about your customers?"
					rules={{required: true}}
					control={control}
					defaultValue="true"
				/>
				<ControlledSwitch
					name={setFormPath('hasAutoPolicy')}
					label="Do you have a Raylife Auto policy?"
					rules={{required: true}}
					control={control}
				/>
				<LegalEntityControlledSelect
					name={setFormPath('legalEntity')}
					label="Legal Entity"
					rules={{
						required: 'This field is required.',
					}}
					control={control}
				/>
				{validatePercentSales(
					form?.basics?.properties?.businessClassCode
				) && (
					<PercentageControlledInput
						name={setFormPath('salesMerchandise')}
						label="Percent of sales from used merchandise?"
						rules={{
							pattern: {
								value: PERCENTAGE_REGEX_MAX_100,
								message: 'Value must not be greater than 100%.',
							},
							required: 'Percent of sales is required.',
						}}
						moreInfoProps={{
							event: TIP_EVENT,
							value: {
								templateName: 'percent-of-sales-from-used-merchandise',
								step: selectedStep,
								inputName: setFormPath('salesMerchandise'),
								value: form?.business?.salesMerchandise,
							},
						}}
						control={control}
					/>
				)}
				{validateOwnBrandLabel(
					form?.basics?.properties?.businessClassCode
				) && (
					<ControlledSwitch
						name={setFormPath('hasSellProductsUnderOwnBrand')}
						label="Do you sell products under your own brand or label?"
						rules={{required: true}}
						control={control}
					/>
				)}
				{validateOverallSales(form?.basics?.properties?.segment) && (
					<PercentageControlledInput
						name={setFormPath('overallSales')}
						label="What percentage of overall sales involve delivery?"
						rules={{
							pattern: {
								value: PERCENTAGE_REGEX_MAX_100,
								message: 'Value must not be greater than 100%.',
							},
							required: 'Percent of overall sales is required.',
						}}
						control={control}
					/>
				)}
			</div>
			<CardFormActionsWithSave
				onPrevious={goToPreviousForm}
				onNext={goToNextForm}
				isValid={isValid}
			/>
		</div>
	);
};
