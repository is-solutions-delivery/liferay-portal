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
import {ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useRef, useState} from 'react';

import TagSelector from '../TagSelector.es';

const filterByOptions = [
	{
		filterValue: '',
		label: Liferay.Language.get('none'),
		value: 'none',
	},
	{
		filterValue: 'numberOfMessageBoardMessages eq 0',
		label: Liferay.Language.get('no-answer'),
		value: 'no-answer',
	},
	{
		filterValue: `hasValidAnswer eq 'false'`,
		label: Liferay.Language.get('no-accepted-answer'),
		value: 'no-accepted-answer',
	},

	{
		filterValue: `hasValidAnswer eq 'true'`,
		label: Liferay.Language.get('accepted-answer'),
		value: 'accepted-answer',
	},
];

const sortedByOptions = [
	{
		label: Liferay.Language.get('newest'),
		sortValue: 'dateCreated:asc',
		value: 'newest',
	},
	{
		label: Liferay.Language.get('oldest'),
		sortValue: 'dateCreated:desc',
		value: 'oldest',
	},
	{
		label: Liferay.Language.get('recent-activity'),
		sortValue: 'dateModified:asc',
		value: 'recent-activity',
	},
	{
		label: Liferay.Language.get('highest-score'),
		sortValue: 'totalScore:desc',
		value: 'highest-score',
	},
	{
		label: Liferay.Language.get('most-frequent'),
		sortValue: 'viewCount:desc',
		value: 'most-frequent',
	},
];

const taggedWithOptions = [
	{
		label: Liferay.Language.get('none'),
		value: 'none',
	},
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
	filterBy: 'none',
	sortedBy: 'newest',
	taggedWith: {
		property: 'none',
		values: [],
	},
};

const QuestionsFilter = ({onApplyFilter}) => {
	const [form, setForm] = useState(initialState);
	const [tags, setTags] = useState([]);
	const triggerElementRef = useRef();
	const [expand, setExpand] = useState(false);
	const menuElementRef = useRef(null);
	const [, setTagsLoaded] = useState(true);

	// eslint-disable-next-line no-console
	console.log(JSON.stringify(form));

	const onSubmit = (event) => {
		event.preventDefault();

		const query = {
			filter: '',
			sort: '',
			tag: '',
		};

		query.sort = sortedByOptions.find(
			({value}) => value === form.sortedBy
		)?.sortValue;

		query.filter = filterByOptions.find(
			({value}) => value === form.filterBy
		)?.filterValue;

		if (form.taggedWith.property === 'some-specific-tag') {
			query.tag = tags.map(({value}) => value).join(',');
		}

		setExpand(false);

		onApplyFilter(query);
	};

	const handleExpand = (event) => {
		// This is not ideal for allowing you to have more than
		// one trigger for the same content but it simulates the
		// advantages of controlling `DropDown.Menu`.

		triggerElementRef.current = event.target;

		setExpand(!expand);
	};

	return (
		<>
			<ClayButton displayType="secondary" onClick={handleExpand}>
				{Liferay.Language.get('filter-and-order')}

				<ClayIcon className="ml-2" symbol="caret-bottom" />
			</ClayButton>

			<ClayDropDown.Menu
				active={expand}
				alignElementRef={triggerElementRef}
				menuHeight="auto"
				menuWidth="md"
				onActiveChange={() => setExpand(!expand)}
				ref={menuElementRef}
			>
				<div className="mx-3 pl-3 pr-3 py-3">
					<ClayDropDown.ItemList>
						<ClayDropDown.Group>
							<label className="align-items-center d-inline-flex">
								{Liferay.Language.get('filter-by')}
							</label>

							<div className="form-check">
								<ClayRadioGroup
									defaultValue={form.filterBy}
									name="filterBy"
									onChange={(value) => {
										setForm({
											...form,
											filterBy: value,
										});
									}}
									value={form.filterBy}
								>
									{filterByOptions.map(
										({label, value}, index) => (
											<ClayRadio
												aria-label={label}
												key={index}
												label={label}
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
									defaultValue={form.sortedBy}
									name="sortedBy"
									onChange={(value) => {
										setForm({
											...form,
											sortedBy: value,
										});
									}}
									value={form.sortedBy}
								>
									{sortedByOptions.map(
										({label, value}, index) => (
											<ClayRadio
												aria-label={label}
												key={index}
												label={label}
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
									defaultValue={form.taggedWith.property}
									onChange={(value) =>
										setForm({
											...form,
											taggedWith: {
												...form.taggedWith,
												property: value,
											},
										})
									}
									value={form.taggedWith.property}
								>
									{taggedWithOptions.map(
										({label, value}, index) => (
											<ClayRadio
												aria-label={label}
												key={index}
												label={label}
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

					<ClayButton
						block
						className="btn btn-primary c-mt-4 c-mt-sm-0"
						onClick={onSubmit}
						type="button"
					>
						{Liferay.Language.get('apply')}
					</ClayButton>
				</div>
			</ClayDropDown.Menu>
		</>
	);
};

export default QuestionsFilter;
