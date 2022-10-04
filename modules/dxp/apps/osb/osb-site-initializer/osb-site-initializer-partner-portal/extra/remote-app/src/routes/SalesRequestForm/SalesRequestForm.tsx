/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {useState} from 'react';

import PRMFormik from '../../common/components/PRMFormik';
import DealRegistration from '../../common/interfaces/dealRegistration';
import StepIcon from './components/StepIcon';
import {StepType} from './enums/stepType';
import General from './steps/General';
import Review from './steps/Review';

type StepComponent = {
	[key in StepType]?: JSX.Element;
};

const SalesRequestForm = () => {
	const [step, setStep] = useState<StepType>(StepType.GENERAL);

	const onSubmit = (values: DealRegistration) => {
		console.log(values, 'OK');
	};

	const onCancel = () => {
		setStep(StepType.GENERAL);
	};
	const onSaveAsDraft = () => {};
	const onContinue = () => {
		setStep(StepType.REVIEW);
	};

	const StepFormComponent: StepComponent = {
		[StepType.GENERAL]: (
			<General onContinue={onContinue} onSaveAsDraft={onSaveAsDraft} />
		),
		[StepType.REVIEW]: (
			<Review onCancel={onCancel} onSaveAsDraft={onSaveAsDraft} />
		),
	};

	return (
		<div className="container">
			<div className="row">
				<div className="bg-neutral-0 col-2 h-25 p-4">
					<div className="d-flex flex-column">
						<div className="align-items-center d-flex">
							<StepIcon active />

							<span className="ml-3">General</span>
						</div>

						<div className="align-items-center d-flex">
							<StepIcon /> <span className="ml-3">Review</span>
						</div>
					</div>
				</div>

				<div className="col ml-5">
					<PRMFormik
						initialValues={{} as DealRegistration}
						onSubmit={onSubmit}
					>
						{StepFormComponent[step]}
					</PRMFormik>
				</div>
			</div>
		</div>
	);
};

export default SalesRequestForm;
