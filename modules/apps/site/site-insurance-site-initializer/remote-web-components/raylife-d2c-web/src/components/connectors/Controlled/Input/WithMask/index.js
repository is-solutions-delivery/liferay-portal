import React from 'react';
import {Controller} from 'react-hook-form';

import {MoreInfoButton} from '../../../../fragments/Buttons/MoreInfo';
import {InputWithMask} from '../../../../fragments/Forms/Input/WithMask';
import classNames from 'classnames';

export const ControlledInputWithMask = ({
	name,
	label,
	rules,
	control,
	moreInfoProps = undefined,
	inputProps = {},
	renderInput = true,
	...props
}) => {
	const newRules = renderInput ? rules : {required: false};

	return (
		<Controller
			control={control}
			defaultValue=""
			name={name}
			render={({field, fieldState}) => (
				<InputWithMask
					className={classNames({
						'd-none': !renderInput,
					})}
					error={fieldState.error}
					label={label}
					renderActions={
						moreInfoProps && <MoreInfoButton {...moreInfoProps} />
					}
					required={newRules?.required}
					{...field}
					{...inputProps}
				/>
			)}
			rules={newRules}
			{...props}
		/>
	);
};
