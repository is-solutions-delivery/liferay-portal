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
	const rulesRender = renderInput ? rules : {required: false};

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
					required={rulesRender?.required}
					{...field}
					{...inputProps}
				/>
			)}
			rules={rulesRender}
			{...props}
		/>
	);
};
