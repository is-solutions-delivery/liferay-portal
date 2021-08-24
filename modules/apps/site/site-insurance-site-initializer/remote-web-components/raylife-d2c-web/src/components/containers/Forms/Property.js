import React, {useState} from 'react';

import {AVAILABLE_STEPS} from '../../../utils/constants';
import {CardFormActionsWithSave} from '../../fragments/Card/FormActionsWithSave';
import {ControlledSwitch} from '../../connectors/Controlled/Switch';
import {isHabitational, isThereSwimming} from '../../../utils/propertyFields';
import {NumberControlledInput} from '../../connectors/Controlled/Input/Number';
import {SquareFeatControlledInput} from '../../connectors/Controlled/Input/WithMask/SquareFeet';
import {TIP_EVENT} from '../../../events';
import {useFormContext, useWatch} from 'react-hook-form';
import {useStepWizard} from '../../../hooks/useStepWizard';
import {YearControlledInput} from '../../connectors/Controlled/Input/WithMask/Year';

import {LiferayService} from '../../../services/liferay';

const setFormPath = (value) => `property.${value}`;

export const FormProperty = () => {
	const form = useWatch();
	const {selectedStep, setSection} = useStepWizard();
	const {
		control,
		formState: {isValid},
		setError,
	} = useFormContext();

	const goToPreviousForm = () => {
		console.log(form);

		LiferayService.createOrUpdateRaylifeApplication(form)
			.then(() => {
				setSection(AVAILABLE_STEPS.EMPLOYEES);
			})
			.catch((erro) => {
				setError('continueButton', {
					type: 'manual',
					message: `There was an error processing your request. Please try again.`,
				});
			});
	};

	const onSave = () => {
		LiferayService.createOrUpdateRaylifeApplication(form)
			.then(() => {
				window.location.href = '/web/raylife';
			})
			.catch((erro) => {
				setError('continueButton', {
					type: 'manual',
					message: `There was an error processing your request. Please try again.`,
				});
			});
	};

	/**
	 * @state disabled for now
	 * @param {*} data
	 */
	const onNext = () => {
		console.log(form);
		LiferayService.createOrUpdateRaylifeApplication(form)
			.then(() => {
				window.location.href = '/web/raylife/hang-tight';
			})
			.catch((erro) => {
				setError('continueButton', {
					type: 'manual',
					message: `There was an error processing your request. Please try again.`,
				});
			});
	};

	const [selectedKey, setSelectedKey] = useState('');

	const changeMoreInfoSelected = (inputName) => {
		if (inputName === selectedKey) {
			setSelectedKey('');
		} else {
			setSelectedKey(inputName);
		}
	};

	return (
		<div className="card">
			<div className="card-content">
				<ControlledSwitch
					name={setFormPath('doOwnBuildingAtAddress')}
					control={control}
					label={`Do you own the building at ${form.basics.businessInformation.business.location.address}?`}
					rules={{required: true}}
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
							templateName: 'more-info-template',
							step: selectedStep,
							inputName: setFormPath(
								'buildingSquareFeetOccupied'
							),
							value: form?.property?.buildingSquareFeetOccupied,
						},
						selected:
							setFormPath('buildingSquareFeetOccupied') ===
							selectedKey,
						callback: () =>
							changeMoreInfoSelected(
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
				/>
				<ControlledSwitch
					name={setFormPath('isPrimaryBusinessLocation')}
					label="Is this the primary location you conduct business?"
					control={control}
					rules={{required: true}}
					moreInfoProps={{
						event: TIP_EVENT,
						value: {
							templateName: 'more-info-template',
							step: selectedStep,
							inputName: setFormPath('isPrimaryBusinessLocation'),
							value: form?.property?.isPrimaryBusinessLocation,
						},
						selected:
							setFormPath('isPrimaryBusinessLocation') ===
							selectedKey,
						callback: () =>
							changeMoreInfoSelected(
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
						rules={{required: true}}
						moreInfoProps={{
							event: TIP_EVENT,
							value: {
								templateName: 'more-info-template',
								step: selectedStep,
								inputName: setFormPath('isThereSwimming'),
								value: form?.property?.isThereSwimming,
							},
						}}
					/>
				)}
				{isThereSwimming(form?.property?.isThereSwimming) && (
					<ControlledSwitch
						name={setFormPath('isThereDivingBoards')}
						label="Are there diving boards or slides?"
						control={control}
						rules={{required: true}}
						moreInfoProps={{
							event: TIP_EVENT,
							value: {
								templateName: 'more-info-template',
								step: selectedStep,
								inputName: setFormPath('isThereDivingBoards'),
								value: form?.property?.isThereDivingBoards,
							},
						}}
					/>
				)}
			</div>
			<CardFormActionsWithSave
				onPrevious={goToPreviousForm}
				isValid={isValid}
				onNext={onNext}
				onSave={onSave}
			/>
		</div>
	);
};
