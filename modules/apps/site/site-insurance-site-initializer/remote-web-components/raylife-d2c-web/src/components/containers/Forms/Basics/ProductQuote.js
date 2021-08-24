import React, {useState} from 'react';
import {useFormContext, useWatch, Controller} from 'react-hook-form';

import {Radio} from '../../../fragments/Forms/Radio';
import {AVAILABLE_STEPS} from '../../../../utils/constants';
import {useStepWizard} from '../../../../hooks/useStepWizard';
import {useProductQuotes} from '../../../../hooks/useProductQuotes';
import {MoreInfoButton} from '../../../fragments/Buttons/MoreInfo';
import {TIP_EVENT} from '../../../../events';
import {CardFormActions} from '../../../fragments/Card/FormActions';
import useFormActions from '../../../../hooks/useFormActions';

export const FormBasicProductQuote = () => {
	const {
		control,
		formState: {isValid},
	} = useFormContext();
	const form = useWatch();
	const {selectedStep} = useStepWizard();
	const {productQuotes} = useProductQuotes();
	const {onPrevious, onNext, onSave} = useFormActions(
		AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION,
		AVAILABLE_STEPS.BUSINESS
	);

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
				<div className="content-column">
					<label>Select a product to quote.</label>
					<fieldset id="productQuote" className="content-column">
						<Controller
							name="basics.productQuote"
							defaultValue=""
							control={control}
							rules={{required: true}}
							render={({field}) =>
								productQuotes.map((quote) => (
									<Radio
										{...field}
										key={quote.id}
										label={quote.title}
										sideLabel={quote.period}
										description={quote.description}
										value={quote.id}
										selected={
											quote.id ===
											form.basics.productQuote
										}
										renderActions={
											quote.template.allowed && (
												<MoreInfoButton
													event={TIP_EVENT}
													value={{
														templateName:
															quote.template.name,
														step: selectedStep,
														inputName: field.name,
														value: quote.id,
													}}
													selected={
														quote.id === selectedKey
													}
													callback={() =>
														changeMoreInfoSelected(
															quote.id
														)
													}
												/>
											)
										}
									/>
								))
							}
						/>
					</fieldset>
				</div>
			</div>
			<CardFormActions
				isValid={isValid}
				onPrevious={onPrevious}
				onNext={onNext}
				onSave={onSave}
			/>
		</div>
	);
};
