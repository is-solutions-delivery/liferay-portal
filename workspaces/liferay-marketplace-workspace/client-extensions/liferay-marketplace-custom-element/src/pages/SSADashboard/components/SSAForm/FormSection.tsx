/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Form from '../../../../components/MarketplaceForm';
import {Input, InputProps} from './Input';

type FormSectionProps = {
	leftSection: InputProps;
	rightSection: InputProps;
	title?: string;
};

export const FormField = ({section}: {section: InputProps}) => (
	<div className="mb-3 pr-2 w-50">
		<Form.Label
			className="mt-5"
			info={section.tooltip || ''}
			required={section.required}
		>
			{section.title}
		</Form.Label>
		<Input {...section} />
	</div>
);

const FormSection = ({
	title,
	leftSection,
	rightSection,
}: FormSectionProps) => {
	return (
		<div className="mb-5">
			<Form.FormControl>
				{title && (
					<>
						<h4>{title}</h4>
						<hr className="mb-1" />
					</>
				)}
				<div className="d-flex justify-content-between">
					<FormField section={leftSection} />
					<FormField section={rightSection} />
				</div>
			</Form.FormControl>
		</div>
	);
};

export {FormSection};
