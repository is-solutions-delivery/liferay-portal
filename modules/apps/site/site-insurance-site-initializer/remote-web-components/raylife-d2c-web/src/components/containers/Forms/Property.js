import React from 'react';

import { AVAILABLE_STEPS } from '../../../utils/constants';
import { CardFormActionsWithSave } from '../../fragments/Card/FormActionsWithSave';
import { ControlledSwitch } from '../../connectors/Controlled/Switch';
import { isHabitational, isThereSwimming } from '../../../utils/propertyFields';
import { NumberControlledInput } from '../../connectors/Controlled/Input/Number';
import { SquareFeatControlledInput } from '../../connectors/Controlled/Input/WithMask/SquareFeet';
import { TIP_EVENT } from '../../../events';
import { useFormContext } from 'react-hook-form';
import { useStepWizard } from '../../../hooks/useStepWizard';
import { YearControlledInput } from '../../connectors/Controlled/Input/WithMask/Year';

import useFormActions from '../../../hooks/useFormActions';
import { useTriggerContext } from '../../../hooks/useTriggerContext';

const setFormPath = (value) => `property.${value}`;

export const FormProperty = ({form}) => {
	const {selectedStep} = useStepWizard();
	const {
		control,
		formState: { isValid },
	} = useFormContext();

	const {onNext, onPrevious, onSave} = useFormActions(
		form,
		AVAILABLE_STEPS.EMPLOYEES
	);

	const { isSelected, updateState } = useTriggerContext();

	return (
		<div className="card">
			<div className="card-content">
				<ControlledSwitch
					name={setFormPath('doOwnBuildingAtAddress')}
					control={control}
					label={`Do you own the building at ${form.basics.businessInformation.business.location.address}?`}
					rules={{ required: true }}
				/>
				<NumberControlledInput
					name={setFormPath('stories')}
					control={control}
					label="How many stories is this building?"
					rules={{
						required: 'This field is required',
						min: {
							value: 0,
							message: 'Must be equal or grater than 0.',
						},
					}}
				/>
				<SquareFeatControlledInput
					name={setFormPath('buildingSquareFeetOccupied')}
					label="How many square feet of the building does your business occupy?"
					control={control}
					rules={{
						required: 'This field is required',
					}}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'building-square-footage',
							step: selectedStep,
							inputName: setFormPath(
								'buildingSquareFeetOccupied'
							),
							value: form?.property?.buildingSquareFeetOccupied,
						},
						selected:
							isSelected(setFormPath('buildingSquareFeetOccupied')),
						callback: () =>
							updateState(
								setFormPath('buildingSquareFeetOccupied')
							),
					}}
				/>
				<SquareFeatControlledInput
					name={setFormPath('totalBuildingSquareFeet')}
					label="How many total square feet is the building?"
					control={control}
					rules={{
						required: 'This field is required',
					}}
				/>
				<YearControlledInput
					name={setFormPath('yearBuilding')}
					label="What year was the building constructed?"
					control={control}
					rules={{
						required: 'This field is required',
					}}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'year-constructed',
							step: selectedStep,
							inputName: setFormPath('yearBuilding'),
							value: form?.property?.yearBuilding,
						},
						selected:
							isSelected(setFormPath('yearBuilding')),
						callback: () =>
							updateState(
								setFormPath('yearBuilding')
							),
					}}
				/>
				<ControlledSwitch
					name={setFormPath('isPrimaryBusinessLocation')}
					label="Is this the primary location you conduct business?"
					control={control}
					rules={{ required: true }}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'primary-location',
							step: selectedStep,
							inputName: setFormPath('isPrimaryBusinessLocation'),
							value: form?.property?.isPrimaryBusinessLocation,
						},
						selected:
							isSelected(setFormPath('isPrimaryBusinessLocation')),
						callback: () =>
							updateState(
								setFormPath('isPrimaryBusinessLocation')
							),
					}}
				/>
				{isHabitational(
					form?.basics?.properties?.segment.toLowerCase()
				) && (
						<ControlledSwitch
							name={setFormPath('isThereSwimming')}
							label="Are there swimming pool(s) on the premises?"
							control={control}
							rules={{ required: true }}
						/>
					)}
				{isThereSwimming(form?.property?.isThereSwimming) && (
					<ControlledSwitch
						name={setFormPath('isThereDivingBoards')}
						label="Are there diving boards or slides?"
						control={control}
						rules={{ required: true }}
					/>
				)}
			</div>
			<CardFormActionsWithSave
				onPrevious={onPrevious}
				isValid={isValid}
				onNext={onNext}
				onSave={onSave}
			/>
		</div>
	);
};
