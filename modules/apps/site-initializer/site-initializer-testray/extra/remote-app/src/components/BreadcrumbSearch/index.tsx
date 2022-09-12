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

import ClayAutocomplete from '@clayui/autocomplete';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {Fragment, useState} from 'react';

import useBreadcrumb, {defaultEntities} from '../../hooks/useBreadcrumb';
import i18n from '../../i18n';

const MAX_ENTITIES_TO_SEARCH = 3;

type BreadccrumbSearchProps = {
	onClick: (value: any) => void;
};

const BreadcrumbSearch: React.FC<BreadccrumbSearchProps> = ({onClick}) => {
	const {
		breadCrumb,
		entities,
		inputRef,
		items,
		onBackscape,
		onClickRow,
		search,
		setSearch,
	} = useBreadcrumb([...defaultEntities].slice(0, MAX_ENTITIES_TO_SEARCH));

	const [active, setActive] = useState(false);

	// useEffect(() => {
	// 	if (
	// 		breadCrumb.length === MAX_ENTITIES_TO_SEARCH &&
	// 		active === true &&
	// 		entities.length === 3
	// 	) {
	// 		setActive(false);
	// 	} else if (entities.length < 3) {
	// 		setActive(true);
	// 	}

	// }, [breadCrumb, breadCrumb.length, items, items.length, search]);

	const showResults = () => {
		if (!items.length) {
			setActive(false);
		}
		setActive(!active);
	};

	const onClickItem = (item: any, itemIndex: any) => {
		onClick(item);
		onClickRow(itemIndex);

		if (
			breadCrumb.length + 1 === MAX_ENTITIES_TO_SEARCH &&
			active === true &&
			entities.length === 3
		) {
			return setActive(false);
		} else if (entities.length <= 3) {
			return setActive(true);
		}
	};

	return (
		<div className="breadcrumb-finder-navigator breadcrumb-search-container">
			<div
				className="breadcrumb-search-content"
				id="breadcrumbSearchContent"
			>
				<div className="d-flex flex-column w-100">
					<ul className="d-flex overflow-hidden">
						{entities.map((entity, index) => {
							const selected = !!breadCrumb[index];

							return (
								<li className="mr-3" key={index}>
									<ClayIcon
										className="mr-1"
										color={selected ? 'green' : 'red'}
										symbol={
											selected
												? 'check-circle-full'
												: 'times-circle-full'
										}
									/>

									<span>{entity.name}</span>
								</li>
							);
						})}
					</ul>

					<div className="form-control" onClick={() => showResults()}>
						<span
							className="selected-container"
							id="selectedContainer"
						>
							{breadCrumb.length >= 1 && (
								<div className="divider">/</div>
							)}

							{breadCrumb.map(({label}, index) => (
								<Fragment key={index}>
									<span className="breadcrumb-selected-item">
										{label}
									</span>

									{index !== breadCrumb.length - 1 && (
										<div className="divider">/</div>
									)}
								</Fragment>
							))}
						</span>

						<div className="breadcrumb-search-input-edit-wrapper">
							<input
								className="breadcrumb-search-input-edit"
								name="breadcrumbInputEdit"
								onChange={({target: {value}}) =>
									setSearch(value)
								}
								onKeyDown={({key}) => {
									if (key === 'Backspace' && search === '') {
										onBackscape();
									}
								}}
								ref={inputRef}
								tabIndex={-1}
								type="text"
								value={search}
							/>
						</div>
					</div>

					<ClayAutocomplete className="mb-4">
						<ClayAutocomplete.DropDown active={active}>
							<ClayDropDown.ItemList>
								{items.length ? (
									items?.map((item: any, itemIndex: any) => (
										<ClayAutocomplete.Item
											key={item.label}
											match={item.label}
											onClick={() => {
												onClickItem(item, itemIndex);
											}}
											value={item.label}
										/>
									))
								) : (
									<ClayAutocomplete.Item
										match={i18n.translate(
											'no-results-found'
										)}
										value=""
									/>
								)}
							</ClayDropDown.ItemList>
						</ClayAutocomplete.DropDown>
					</ClayAutocomplete>

					{/* {breadCrumb.length !== MAX_ENTITIES_TO_SEARCH && (
						<div className="breadcumbSeachList mt-2 position-relative">
							<ul className="list-unstyled" tabIndex={-1}>
								{items.map((item, itemIndex) => (
									<li
										className="breadcrumb-finder-item cursor-pointer"
										key={itemIndex}
										onClick={() => onClickRow(itemIndex)}
									>
										<div className="d-flex justify-content-between result-item">
											<span className="result-text">
												{item.label}
											</span>
										</div>
									</li>
								))}
							</ul>
						</div>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default BreadcrumbSearch;
