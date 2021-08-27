/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect} from 'react';
import {useFormContext} from 'react-hook-form';
import useDebounce from 'lodash.debounce';

import {TIP_EVENT} from '../../../../../events';
import {WarningBadge} from '../../../../fragments/Badges/Warning';
import {SearchInput} from '../../../../fragments/Forms/Input/Search';
import {useStepWizard} from '../../../../../hooks/useStepWizard';
import {useBusinessTypes} from '../../../../../hooks/useBusinessTypes';
import {useCustomEvent} from '../../../../../hooks/useCustomEvent';
import {BusinessTypeRadioGroup} from './RadioGroup';

import ClayIcon from '@clayui/icon';

import classNames from 'classnames';
import { useTriggerContext } from '../../../../../hooks/useTriggerContext';

export const BusinessTypeSearch = ({form}) => {
	const {
		register,
		setValue,
		formState: {errors},
	} = useFormContext();
	const [dispatchEvent] = useCustomEvent(TIP_EVENT);

	const {selectedStep} = useStepWizard();
	const {businessTypes, isError, isLoading, reload} = useBusinessTypes();
	const { isSelected, updateState } = useTriggerContext();

	const templateName = 'i-am-unable-to-find-my-industry';
	const selectedTrigger = isSelected(templateName);

	useEffect(() => {
		onSearch(form?.basics?.businessSearch);
	}, [form?.basics?.businessSearch]);

	const onSearch = useCallback(
		useDebounce((searchTerm = '') => {
			if (!searchTerm.length) setValue('basics.businessCategoryId', '');
			return reload(searchTerm);
		}, 500),
		[]
	);

	const showInfoPanel = () => {
		updateState(templateName);
		dispatchEvent({
			templateName,
			step: selectedStep,
			hide: selectedTrigger,
		});
	};

	const infoPanelButton = () => (
		<button
			type="button"
			className={classNames('btn badge bottom-list', {
				open: selectedTrigger,
			})}
			onClick={showInfoPanel}
		>
			I am unable to find my industry
			{selectedTrigger ? (
				<ClayIcon symbol="question-circle-full" />
			) : (
				<ClayIcon symbol="question-circle" />
			)}
		</button>
	);

	const renderResults = () => {
		if (isLoading || !form?.basics?.businessSearch) return;

		if (isError) return <WarningBadge>{isError}</WarningBadge>;

		if (!businessTypes.length)
			return (
				<>
					<WarningBadge>
						There are no results for “{form?.basics?.businessSearch}
						”. Please try a different search.
					</WarningBadge>
					{infoPanelButton()}
				</>
			);

		return (
			<>
				<BusinessTypeRadioGroup
					businessTypes={businessTypes}
					form={form}
				/>
				{infoPanelButton()}
			</>
		);
	};

	return (
		<>
			<div>
				<SearchInput
					label="Search for your primary industry and then select it from the list."
					defaultValue=""
					required
					error={errors?.basics?.businessSearch}
					{...register('basics.businessSearch', {
						required:
							'Please, search for a business type in order to proceed.',
					})}
					className="search"
				>
					<button
						type="button"
						className="btn btn-primary search"
						onClick={() => onSearch(form?.basics?.businessSearch)}
					>
						Search
					</button>
				</SearchInput>
				<p className="paragraph">
					i.e. Coffee shop, Plumber, Drop Shipping, Landscape, etc
				</p>
			</div>
			{renderResults()}
		</>
	);
};
