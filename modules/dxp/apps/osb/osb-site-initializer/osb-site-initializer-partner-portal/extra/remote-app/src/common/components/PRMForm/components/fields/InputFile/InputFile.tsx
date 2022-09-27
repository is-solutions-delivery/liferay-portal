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

import {ClayInput} from '@clayui/form';

import setFileFormik from '../../../../../utils/setFileFormik';
import WrapperInput from '../common/components/WrapperInput';
import PRMFormFieldProps from '../common/interfaces/prmFormFieldProps';
import PRMFormFieldStateProps from '../common/interfaces/prmFormFieldStateProps';

interface IProps {
	activityId?: number;
	budgetId?: number;
	mdfRequestId?: number;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean
	) => void;
	typeDocument: string;
}

const InputFile = ({
	activityId,
	budgetId,
	field,
	label,
	mdfRequestId,
	meta,
	required,
	setFieldValue,
	typeDocument,
	...props
}: PRMFormFieldProps &
	PRMFormFieldStateProps<string> &
	React.ComponentProps<typeof ClayInput> &
	IProps) => {
	const handleFileObject = (file: any) => {
		return {
			file: file,
			name: field.name,
			activityId: activityId,
			budgetId: budgetId,
			mdfRequestId: mdfRequestId,
			setFieldValue: setFieldValue,
			typeDocument: typeDocument,
		};
	};

	return (
		<WrapperInput {...meta} label={label} required={required}>
			<ClayInput
				{...props}
				onChange={(event) => {
					setFileFormik(handleFileObject(event.target.files));
				}}
				type="file"
			/>
		</WrapperInput>
	);
};
export default InputFile;
