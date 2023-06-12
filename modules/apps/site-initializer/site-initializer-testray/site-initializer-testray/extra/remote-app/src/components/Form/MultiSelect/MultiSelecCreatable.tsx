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

import {InputHTMLAttributes} from 'react';
import {PropsValue} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import {BaseWrapper} from '../Base';

type MultiSelectCreatableProps = {
	disabled?: boolean;
	errors?: any;
	id?: string;
	label?: string;
	name: string;
	options: [];
	register?: any;
	required?: boolean;
	type?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const MultiSelectCreatable: React.FC<MultiSelectCreatableProps> = ({
	disabled,
	name,
	errors,
	label,
	id = name,
	onBlur,
	options = [],
	register = () => {},
	required = false,
	value,
}) => {
	return (
		<BaseWrapper
			disabled={disabled}
			error={errors[name]?.message}
			id={id}
			label={label}
			required={required}
		>
			<CreatableSelect
				{...register(name, {onBlur, required})}
				className="rounded-xs"
				disabled={disabled}
				id={id}
				isMulti
				name={name}
				options={options}
				value={value as PropsValue<unknown>}
			/>
		</BaseWrapper>
	);
};

export default MultiSelectCreatable;
