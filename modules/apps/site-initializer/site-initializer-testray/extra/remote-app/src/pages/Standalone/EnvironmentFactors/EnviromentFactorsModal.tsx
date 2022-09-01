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

import {useState} from 'react';

import Form from '../../../components/Form';
import i18n from '../../../i18n';
import FactorsToCategory from './FactorsToCategory';
import FactorsToOptions from './FactorsToOptions';

type EnvironmentFactorsModalProps = {
	routineId: number;
};

const EnvironmentFactorsModal: React.FC<EnvironmentFactorsModalProps> = ({
	routineId,
}) => {
	const [step, setStep] = useState(0);

	const _onSubmit = () => {
		if (step === 0) {
			return setStep(1);
		}
		setStep(0);
	};
	const lastStep = step === 1;

	return (
		<>
			{step === 0 && (
				<FactorsToCategory lastStep={lastStep} routineId={routineId} />
			)}

			{step === 1 && (
				<FactorsToOptions lastStep={lastStep} routineId={routineId} />
			)}

			<Form.Footer
				isModal
				onClose={() => {
					lastStep ? _onSubmit() : alert;
				}}
				onSubmit={() => _onSubmit()}
				primaryButtonTitle={i18n.translate(lastStep ? 'Save' : 'next')}
				secondaryButtonTitle={i18n.translate(
					lastStep ? 'Back' : 'Cancel'
				)}
			/>
		</>
	);
};

export default EnvironmentFactorsModal;
