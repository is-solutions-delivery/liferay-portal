import React, { useState } from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {AVAILABLE_STEPS} from '../../../utils/constants';
import {useStepWizard} from '../../../hooks/useStepWizard';
import {TIP_EVENT} from '../../../events';
import {CardFormActionsWithSave} from '../../fragments/Card/FormActionsWithSave';
import {ControlledSwitch} from '../../connectors/Controlled/Switch';
import {NumberControlledInput} from '../../connectors/Controlled/Input/Number';
import {FEINControlledInput} from '../../connectors/Controlled/Input/WithMask/FEIN';
import {YearControlledInput} from '../../connectors/Controlled/Input/WithMask/Year';
import {CurrencyControlledInput} from '../../connectors/Controlled/Input/WithMask/Currency';
import useFormActions from '../../../hooks/useFormActions';

const setFormPath = (value) => `employees.${value}`;

const hasFein = (value) => value === 'true';

export const FormEmployees = () => {
	const form = useWatch();
	const {selectedStep} = useStepWizard();
	const {
		control,
		formState: {isValid},
	} = useFormContext();

	const {onNext, onPrevious, onSave} = useFormActions(
		AVAILABLE_STEPS.BUSINESS,
		AVAILABLE_STEPS.PROPERTY
	);

	const [selectedKey, setSelectedKey] = useState("");

	const changeMoreInfoSelected = (inputName) => {
		if (inputName === selectedKey) {
			setSelectedKey("");
		} else {
			setSelectedKey(inputName);
		}
	}

	return (
		<div className="card">
			<div className="card-content">
				<ControlledSwitch
					name={setFormPath('hasFein')}
					label="Does your business have a Federal Employer Identification Number (FEIN)?"
					rules={{required: true}}
					control={control}
				/>
				{hasFein(form?.employees?.hasFein) && (
					<FEINControlledInput
						name={setFormPath('fein')}
						label="Federal Employer Identification Number (FEIN)"
						rules={{
							required: 'FEIN is required.',
						}}
						moreInfoProps={{
							event: TIP_EVENT,
							value: {
								templateName:
									'federal-employer-identification-number',
								step: selectedStep,
								inputName: setFormPath('fein'),
								value: form?.employees?.fein,
							},
							selected: setFormPath('fein') === selectedKey,
							callback: () => changeMoreInfoSelected(setFormPath('fein'))
						}}
						control={control}
					/>
				)}
				<YearControlledInput
					name={setFormPath('startBusinessAtYear')}
					label="What year did you start your business?"
					rules={{required: 'This field is required'}}
					control={control}
				/>
				<ControlledSwitch
					name={setFormPath('businessOperatesYearRound')}
					label="Does your business operate year round?"
					rules={{required: true}}
					control={control}
				/>
				<NumberControlledInput
					name={setFormPath('partTimeEmployees')}
					label="How many full or part time employees do you have?"
					rules={{
						required: 'This field is required',
						min: {
							value: 1,
							message: 'You must have at least one employee.',
						},
					}}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'full-or-part-time-employees',
							step: selectedStep,
							inputName: setFormPath('partTimeEmployees'),
							value: form?.employees?.partTimeEmployees,
						},
						selected: setFormPath('partTimeEmployees') === selectedKey,
						callback: () => changeMoreInfoSelected(setFormPath('partTimeEmployees'))
					}}
					control={control}
				/>
				<CurrencyControlledInput
					name={setFormPath('estimatedAnnualGrossRevenue')}
					label="What is your estimated annual gross revenue for the next 12 months?"
					rules={{required: 'This field is required'}}
					control={control}
				/>
				<CurrencyControlledInput
					name={setFormPath('annualPayrollForOwner')}
					label="What do you anticipate your annual payroll will be for all owner(s) over the next 12 months?"
					rules={{required: 'This field is required'}}
					control={control}
				/>
				<CurrencyControlledInput
					name={setFormPath('annualPayrollForEmployees')}
					label="What do you anticipate your annual payroll will be for all employees over the next 12 months?"
					rules={{required: 'This field is required'}}
					control={control}
				/>
			</div>
			<CardFormActionsWithSave
				isValid={isValid}
				onPrevious={onPrevious}
				onNext={onNext}
				onSave={onSave}
			/>
		</div>
	);
};
