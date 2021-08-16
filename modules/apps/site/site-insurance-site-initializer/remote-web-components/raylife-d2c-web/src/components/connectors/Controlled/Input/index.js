import React from 'react';
import {Controller} from 'react-hook-form';

import {Input} from '../../../fragments/Forms/Input';
import {MoreInfoButton} from '../../../fragments/Buttons/MoreInfo';

export const ControlledInput = ({
	name,
	label,
	rules,
	control,
	moreInfoProps = undefined,
	inputProps = {},
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue=""
			rules={rules}
			render={({field, fieldState}) => (
				<Input
					{...field}
					label={label}
					error={fieldState.error}
					renderActions={
						moreInfoProps && <MoreInfoButton {...moreInfoProps} />
					}
					required={rules?.required}
					{...inputProps}
				/>
			)}
			{...props}
		/>
	);
};
