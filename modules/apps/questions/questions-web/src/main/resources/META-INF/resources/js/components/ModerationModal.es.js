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

import ClayForm, {ClayInput, ClayRadio, ClayRadioGroup} from '@clayui/form';
import React, {useState} from 'react';

import Modal from './Modal.es';

const suspiciousCategories = [
	{label: 'Inappropriate content', value: 0},
	{label: 'Harassment or bullying', value: 1},
	{label: 'Harmful or dangerous acts', value: 2},
	{label: 'Spam or misleading', value: 3},
	{label: 'Infringes human rights', value: 4},
];

const MAX_DESCRIPTION_LENGTH = 500;

const ModerationModal = ({onOpenChange, open}) => {
	const [form, setForm] = useState({
		description: '',
		suspiciousCategoryId: suspiciousCategories[0]?.value,
	});

	if (!open) {
		return null;
	}

	return (
		<Modal
			body={
				<ClayForm>
					<h2 className="mb-3">
						Do you want to report this question?
					</h2>

					<ClayRadioGroup defaultValue={form.suspiciousCategoryId}>
						{suspiciousCategories.map(
							(suspiciousCategory, index) => (
								<ClayRadio
									key={index}
									label={suspiciousCategory.label}
									onClick={() =>
										setForm({
											...form,
											suspiciousCategoryId:
												suspiciousCategory.value,
										})
									}
									value={suspiciousCategory.value}
								/>
							)
						)}
					</ClayRadioGroup>

					<ClayForm.Group className="form-group-sm">
						<label htmlFor="description">
							{Liferay.Language.get('description')}
						</label>

						<ClayInput
							component="textarea"
							id="description"
							maxLength={MAX_DESCRIPTION_LENGTH}
							onChange={(event) =>
								setForm({
									...form,
									description: event.target.value,
								})
							}
							placeholder="Report Suspicious Activity"
							value={form.description}
						/>

						<div className="d-flex form-text justify-content-end mt-1">
							{`${form.description.length} / ${MAX_DESCRIPTION_LENGTH}`}
						</div>

						<div className="form-text">
							Reported activity is moderated by community admins
							to determine whether they violate any guidelines.
							Accounts are penalized, and serious or repeated
							violations can lead to account termination.
						</div>
					</ClayForm.Group>
				</ClayForm>
			}
			onClose={() => onOpenChange(false)}
			status="warning"
			textPrimaryButton={Liferay.Language.get('report')}
			title="Report question?"
			visible={onOpenChange}
		/>
	);
};

export default ModerationModal;
