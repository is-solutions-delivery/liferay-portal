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

import ClayDatePicker from '@clayui/date-picker';
import {ClayIconSpriteContext} from '@clayui/icon';
import {ErrorMessage, useField} from 'formik';

import getIconSpriteMap from '../../utils/getIconSpriteMap';

type Props = {
	dateFormat: string;
	label: string;
	name: string;
	onChange: any;
	placeholder: string;
	value: any;
	years: any;
};

const DatePicker = ({label, ...props}: Props) => {
	const [field, meta] = useField(props);

	const fieldClass =
		meta.touched && meta.error
			? 'has-error'
			: meta.touched && !meta.error && 'has-success';

	return (
		<div className={`form-group-item ${fieldClass}`}>
			<label htmlFor={field.name}>{label}</label>

			<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
				<ClayDatePicker {...props} />
			</ClayIconSpriteContext.Provider>

			<ErrorMessage
				className={`error ${fieldClass}`}
				component="div"
				name={field.name}
			/>
		</div>
	);
};

export default DatePicker;
