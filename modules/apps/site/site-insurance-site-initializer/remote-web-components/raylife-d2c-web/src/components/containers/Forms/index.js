import React from 'react';

import {FormBusiness} from './Business';
import {FormProperty} from './Property';
import {FormEmployees} from './Employees';
import {AVAILABLE_STEPS} from '../../../utils/constants';
import {useStepWizard} from '../../../hooks/useStepWizard';
import {FormBasicBusinessType} from './Basics/BusinessType';
import {FormBasicProductQuote} from './Basics/ProductQuote';
import {FormBasicBusinessInformation} from './Basics/BusinessInformation';

const compare = (a, b) => {
	return a.section === b.section && a.subsection === b.subsection;
};

export const Forms = ({form}) => {
	const {selectedStep} = useStepWizard();

	if (compare(selectedStep, AVAILABLE_STEPS.BASICS_BUSINESS_TYPE))
		return <FormBasicBusinessType form={form} />;

	if (compare(selectedStep, AVAILABLE_STEPS.BASICS_BUSINESS_INFORMATION))
		return <FormBasicBusinessInformation form={form} />;

	if (compare(selectedStep, AVAILABLE_STEPS.BASICS_PRODUCT_QUOTE))
		return <FormBasicProductQuote form={form} />;

	if (compare(selectedStep, AVAILABLE_STEPS.BUSINESS))
		return <FormBusiness form={form} />;

	if (compare(selectedStep, AVAILABLE_STEPS.EMPLOYEES))
		return <FormEmployees form={form} />;

	if (compare(selectedStep, AVAILABLE_STEPS.PROPERTY))
		return <FormProperty form={form} />;

	return <div></div>;
};
