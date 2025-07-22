/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Select from '@clayui/form/lib/Select';

import {FormFields} from './ModalFormBody';
import Form from '../../../../components/MarketplaceForm';

export type InputProps = {
	className?: string;
	disabled?: boolean;
	error?: string;
	handleChange: ({label, value}: {label: string; value: string}) => void;
	label: keyof FormFields;
	maxLength?: number;
	options?: string[];
	placeholder?: string;
	required?: boolean;
	title: string;
	tooltip?: string;
	type?: 'input' | 'number' | 'select';
	value?: string;
};

const Input = ({
	className,
	disabled = false,
	error,
	handleChange,
	label,
	maxLength,
	options,
	placeholder,
	title,
	type,
	value,
}: InputProps) => {
	if (type === 'select') {
		return (
			<>
				<Select
					className={`${className} marketplace-form-select`}
					disabled={disabled}
					name={title}
					onChange={(event) =>
						handleChange({label, value: event.target.value})
					}
				>
					<Select.Option label={placeholder} />
					{options?.map((opt) => (
						<Select.Option
							key={opt}
							value={opt || value}
							label={opt}
						/>
					))}
				</Select>

				{error && <p className="text-danger mt-1 mb-0">{error}</p>}
			</>
		);
	}

	return (
		<>
			<Form.Input
				disabled={disabled}
				name={title}
				type={type}
				placeholder={placeholder}
				maxLength={maxLength || undefined}
				value={value}
				className={`${className} marketplace-form-select`}
				onChange={(event) =>
					handleChange({label, value: event.target.value})
				}
			/>

			{error && <p className="mb-0 mt-1 text-danger">{error}</p>}
		</>
	);
};

export {Input};
