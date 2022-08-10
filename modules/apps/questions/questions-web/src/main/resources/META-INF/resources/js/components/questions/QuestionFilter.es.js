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

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayForm, {ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

import TagSelector from '../TagSelector.es';

const filterByOptions = [
	{
		label: Liferay.Language.get('none'),
		value: 'none',
	},
	{
		label: Liferay.Language.get('no-answer'),
		value: 'no-answer',
	},
	{
		label: Liferay.Language.get('no-accepted-answer'),
		value: 'no-accepted-answer',
	},

	{
		label: Liferay.Language.get('accepted-answer'),
		value: 'accepted-answer',
	},
];

const sortedByOptions = [
	{
		label: Liferay.Language.get('newest'),
		value: 'newest',
	},
	{
		label: Liferay.Language.get('oldest'),
		value: 'oldest',
	},
	{
		label: Liferay.Language.get('recent-activity'),
		value: 'recent-activity',
	},

	{
		label: Liferay.Language.get('highest-score'),
		value: 'highest-score',
	},
	{
		label: Liferay.Language.get('most-frequent'),
		value: 'most-frequent',
	},
];

const taggedWithOptions = [
	{
		label: Liferay.Language.get('my-watched-tags'),
		value: 'my-watched-tags',
	},
	{
		label: Liferay.Language.get('some-specific-tag'),
		value: 'some-specific-tag',
	},
];

const initialState = {
	filterBy: '',
	sortedBy: '',
	taggedWith: {
		property: '',
		values: [],
	},
};

const QuestionsFilter = () => {
	const [form, setForm] = useState(initialState);
	const [tags, setTags] = useState([]);
	const [, setTagsLoaded] = useState(true);

	const cleanOnHandle = () => {
		setForm(initialState);
		setTags([]);
	};

	return (
		<ClayDropDown
			menuHeight="auto"
			menuWidth="sm"
			trigger={
				<ClayButton displayType="secondary">
					{Liferay.Language.get('filter-and-order')}

					<ClayIcon className="ml-2" symbol="caret-bottom" />
				</ClayButton>
			}
		>
			<ClayForm className="mx-3 pl-3 pr-3 py-3">
				<ClayDropDown.ItemList>
					<ClayDropDown.Group>
						<label className="align-items-center d-inline-flex">
							{Liferay.Language.get('filter-by')}
						</label>

						<div className="form-check">
							<ClayRadioGroup
								defaultValue={filterByOptions[0].value}
							>
								{filterByOptions.map(
									({label, value}, index) => (
										<ClayRadio
											aria-label={label}
											checked={form.filterBy === value}
											key={index}
											label={label}
											onClick={({target: {value}}) =>
												setForm({
													...form,
													filterBy: value,
												})
											}
											value={value}
										/>
									)
								)}
							</ClayRadioGroup>
						</div>
					</ClayDropDown.Group>

					<ClayDropDown.Group>
						<label className="align-items-center d-inline-flex form-check">
							{Liferay.Language.get('sort-by')}
						</label>

						<div className="form-check">
							<ClayRadioGroup
								defaultValue={sortedByOptions[0].value}
							>
								{sortedByOptions.map(
									({label, value}, index) => (
										<ClayRadio
											aria-label={label}
											key={index}
											label={label}
											onClick={({target: {value}}) =>
												setForm({
													...form,
													sortedBy: value,
												})
											}
											value={value}
										/>
									)
								)}
							</ClayRadioGroup>
						</div>
					</ClayDropDown.Group>

					<ClayDropDown.Group>
						<label className="align-items-center d-inline-flex">
							{Liferay.Language.get('tagged-with')}
						</label>

						<div className="form-check">
							<ClayRadioGroup
								defaultValue={taggedWithOptions[0].value}
							>
								{taggedWithOptions.map(
									({label, value}, index) => (
										<ClayRadio
											aria-label={label}
											key={index}
											label={label}
											onClick={({target: {value}}) =>
												setForm({
													...form,
													taggedWith: {
														property: value,
													},
												})
											}
											value={value}
										/>
									)
								)}
							</ClayRadioGroup>

							{form.taggedWith.property ===
								'some-specific-tag' && (
								<TagSelector
									className="c-mt-3"
									showSelectButton={false}
									tags={tags}
									tagsChange={setTags}
									tagsLoaded={setTagsLoaded}
								/>
							)}
						</div>
					</ClayDropDown.Group>
				</ClayDropDown.ItemList>

				<ClayButton className="btn btn-primary c-mt-4 c-mt-sm-0">
					{Liferay.Language.get('apply')}
				</ClayButton>

				<ClayButton
					className="btn btn-secondary c-ml-sm-3"
					onClick={cleanOnHandle}
				>
					{Liferay.Language.get('clear')}
				</ClayButton>
			</ClayForm>
		</ClayDropDown>
	);
};

export default QuestionsFilter;
