/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Badge} from '..';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {FieldHookConfig, useField} from 'formik';
import {required, validate} from '~/utils/validations.form';

import './Input.css';

interface IProps extends React.ComponentPropsWithoutRef<typeof ClayInput> {
	badgeClassName?: string;
	disableError?: boolean;
	groupStyle?: string;
	helper?: any;
	label: string;
	validations?: Function[];
}

const Input = ({
	badgeClassName,
	disableError,
	groupStyle,
	helper,
	label,
	validations,
	...props
}: IProps) => {
	if (props.required) {
		validations = validations
			? [...validations, (value: string) => required(value)]
			: [(value: string) => required(value)];
	}

	const [field, meta] = useField({
		...props,
		validate: validations
			? (value: string) => validate(validations, value)
			: undefined,
	} as FieldHookConfig<string>);

	return (
		<ClayForm.Group
			className={classNames('w-100', {
				groupStyle,
				'has-error': meta.touched && meta.error,
				'has-success': meta.touched && !meta.error,
			})}
		>
			<label>
				{`${label} `}

				{props.required && (
					<span className="inline-item-after reference-mark text-warning">
						<ClayIcon symbol="asterisk" />
					</span>
				)}

				<ClayInput {...field} {...props} />
			</label>

			{typeof meta.error === 'string' && meta.touched && !disableError ? (
				<Badge badgeClassName={badgeClassName}>
					<span className="pl-1">{meta.error}</span>
				</Badge>
			) : (
				helper && (
					<div className="ml-3 pl-3 pr-2 text-neutral-6 text-paragraph-sm">
						{helper}
					</div>
				)
			)}
		</ClayForm.Group>
	);
};

export default Input;
