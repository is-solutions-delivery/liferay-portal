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

import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayForm, {
	ClayInput,
	ClayRadio,
	ClayRadioGroup,
	ClaySelect,
} from '@clayui/form';
import React, {useContext, useState} from 'react';

import {
	ACTIONS,
	NewApplicationAutoContext,
} from '../../context/NewApplicationAutoContextProvider';

const DriverInfo = () => {
	const [state, dispatch] = useContext(NewApplicationAutoContext);

	const [value, setValue] = useState<string>();

	const {form} = state?.steps?.driverInfo;

	const handleChangeField = (fieldName: string, value: string) => {
		const payload = {
			...form,
			[fieldName]: value,
		};

		dispatch({payload, type: ACTIONS.SET_DRIVER_INFO_FORM});
		dispatch({payload: true, type: ACTIONS.SET_HAS_FORM_CHANGE});
	};

	const relationToContactOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'Self',
			value: '3',
		},
		{
			label: 'Spouse',
			value: '4',
		},
		{
			label: 'Dependent',
			value: '5',
		},
		{
			label: 'Relative',
			value: '6',
		},
	];

	const genderOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'Male',
			value: '3',
		},
		{
			label: 'Female',
			value: '4',
		},
	];

	const maritalStatusOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'Married',
			value: '3',
		},
		{
			label: 'Separated',
			value: '4',
		},
		{
			label: 'Single',
			value: '5',
		},
		{
			label: 'Widowed',
			value: '6',
		},
	];

	const occupationOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'Accountant',
			value: '3',
		},
		{
			label: 'Dentist',
			value: '4',
		},
		{
			label: 'Engineer',
			value: '5',
		},
		{
			label: 'Government',
			value: '6',
		},
		{
			label: 'Other',
			value: '7',
		},
	];

	const millitaryAffiliationOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'None',
			value: '3',
		},
		{
			label: 'US Air Force',
			value: '4',
		},
		{
			label: 'US Coast Guard',
			value: '5',
		},
		{
			label: 'US Marine Corps',
			value: '6',
		},
		{
			label: 'US Military',
			value: '7',
		},
		{
			label: 'US Navy',
			value: '8',
		},
	];

	const highestEducationOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
		{
			label: 'Hign School',
			value: '3',
		},
		{
			label: 'College',
			value: '4',
		},
		{
			label: 'Masters',
			value: '5',
		},
		{
			label: 'PHD',
			value: '6',
		},
	];

	const governmentAffiliationOptions = [
		{
			label: '',
			value: '1',
		},
		{
			label: 'Choose an option',
			value: '2',
		},
	];

	return (
		<div className="bg-neutral-0 mx-8">
			<ClayForm>
				<div className="row">
					<div className="col filled form-condensed form-group">
						<ClayInput
							autoComplete="off"
							className="bg-neutral-0 w-100 year"
							id="firstName"
							name="firstName"
							onChange={(event) => {
								handleChangeField('year', event.target.value);
							}}
							required
							type="text"
							value={form.firstName}
						/>

						<label htmlFor="firstName">
							Fisrt Name&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClayInput
							autoComplete="off"
							className="bg-neutral-0 make w-100"
							id="lastName"
							name="lastName"
							onChange={(event) => {
								handleChangeField(
									'lastName',
									event.target.value
								);
							}}
							required
							type="text"
							value={form.lastName}
						/>

						<label htmlFor="lastName">
							Last Name&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClaySelect
							aria-label="Select Label"
							id="relationToContact"
						>
							{relationToContactOptions.map(
								(relationToContactOption) => (
									<ClaySelect.Option
										className="text-uppercase"
										key={relationToContactOption.value}
										label={relationToContactOption.label}
										value={relationToContactOption.value}
									/>
								)
							)}
						</ClaySelect>

						<label htmlFor="relationToContact">
							Relation To Contact&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>
				</div>

				<div className="row">
					<div className="col filled form-condensed form-group">
						<ClaySelect aria-label="Select Label" id="gender">
							{genderOptions.map((genderOption) => (
								<ClaySelect.Option
									className="text-uppercase"
									key={genderOption.value}
									label={genderOption.label}
									value={genderOption.value}
								/>
							))}
						</ClaySelect>

						<label htmlFor="gender">
							Gender&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClaySelect
							aria-label="Select Label"
							id="maritalStatusOptions"
						>
							{maritalStatusOptions.map((maritalStatusOption) => (
								<ClaySelect.Option
									className="text-uppercase"
									key={maritalStatusOption.value}
									label={maritalStatusOption.label}
									value={maritalStatusOption.value}
								/>
							))}
						</ClaySelect>

						<label htmlFor="maritalStatusOptions">
							Marital Status&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClayInput
							autoComplete="off"
							className="ageFirstLicenced bg-neutral-0 w-100"
							id="ageFirstLicenced"
							name="ageFirstLicenced"
							onChange={(event) => {
								handleChangeField(
									'ageFirstLicenced',
									event.target.value
								);
							}}
							required
							type="text"
							value={form.ageFirstLicenced}
						/>

						<label htmlFor="ageFirstLicenced">
							Age First Licenced&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>
				</div>

				<div className="row">
					<div className="col filled form-condensed form-group">
						<ClaySelect aria-label="Select Label" id="occupation">
							{occupationOptions.map((occupationOption) => (
								<ClaySelect.Option
									className="text-uppercase"
									key={occupationOption.value}
									label={occupationOption.label}
									value={occupationOption.value}
								/>
							))}
						</ClaySelect>

						<label htmlFor="maritalStatusOptions">
							Ocuppation&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClayInput
							autoComplete="off"
							className="bg-neutral-0 otherOcupation w-100"
							id="otherOcupation"
							name="otherOcupation"
							onChange={(event) => {
								handleChangeField(
									'annualMileage',
									event.target.value
								);
							}}
							required
							type="text"
							value={form.otherOcupation}
						/>

						<label htmlFor="otherOcupation">
							Other Ocupation&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClaySelect
							aria-label="Select Label"
							id="highestEducation"
						>
							{highestEducationOptions.map(
								(highestEducationOption) => (
									<ClaySelect.Option
										className="text-uppercase"
										key={highestEducationOption.value}
										label={highestEducationOption.label}
										value={highestEducationOption.value}
									/>
								)
							)}
						</ClaySelect>

						<label htmlFor="highestEducation">
							Highest Education&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>
				</div>

				<div className="mb-3 row">
					<div className="col filled form-condensed form-group">
						<ClaySelect
							aria-label="Select Label"
							disabled
							id="governmentAffiliation"
						>
							{governmentAffiliationOptions.map(
								(governmentAffiliationOption) => (
									<ClaySelect.Option
										className="text-uppercase"
										key={governmentAffiliationOption.value}
										label={
											governmentAffiliationOption.label
										}
										value={
											governmentAffiliationOption.value
										}
									/>
								)
							)}
						</ClaySelect>

						<label htmlFor="governmentAffiliation">
							Government Affiliation&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>

					<div className="col filled form-condensed form-group">
						<ClayDropDownWithItems
							items={millitaryAffiliationOptions}
							onSearchValueChange={setValue}
							searchValue={value}
							searchable={true}
							trigger={
								<ClayInput
									id="value"
									name="value"
									type="text"
									value={value}
								/>
							}
						/>

						<label htmlFor="millitaryAffiliation">
							Millitary Affiliation&nbsp;
							<span className="text-danger-darken-1">*</span>
						</label>
					</div>
				</div>

				<div>
					<p className="text-paragraph-sm text-uppercase">
						<u>Accidents &amp; Violations</u>
					</p>

					<div className="mb-1 mt-2 text-neutral-9 text-paragraph-sm">
						Accidents or CItations in the last 10 yeras?*
					</div>

					<ClayRadioGroup className="mb-3" inline>
						<ClayRadio label="Yes" value="yes" />

						<ClayRadio label="No" value="no" />
					</ClayRadioGroup>
				</div>
			</ClayForm>
		</div>
	);
};

export default DriverInfo;
