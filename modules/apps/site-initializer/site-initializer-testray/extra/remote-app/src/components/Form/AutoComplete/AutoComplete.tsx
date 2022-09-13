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
import {useEffect, useState} from 'react';

import useDebounce from '../../../hooks/useDebounce';
import {useFetch} from '../../../hooks/useFetch';
import {BaseWrapper} from '../Base';

export type AutoCompleteProps = {
	errors?: any;
	label?: string;
	onClick?: (name: string, value: any) => void;
	onSearch: (keyword: string) => any;
	required?: boolean;
	resource: string;
	transformData?: (item: any) => any;
};

const AutoComplete: React.FC<AutoCompleteProps> = ({
	errors,
	label,
	onClick,
	onSearch,
	required,
	resource,
	transformData,
}) => {
	const [showValue, setShowValue] = useState('');
	const [value, setValue] = useState('');
	const [active, setActive] = useState(false);

	const debouncedValue = useDebounce(value, 1000);

	const {called, data, error, isValidating} = useFetch(
		debouncedValue
			? `${resource}/?filter=${onSearch(debouncedValue)}`
			: null,
		transformData
	);

	const items = data?.items || [];

	const onClickItem = (name: any, item: any) => {
		setShowValue(item.name);
		setActive(false);

		if (onClick) {
			onClick(name, item);
		}
	};

	useEffect(() => {
		if (debouncedValue) {
			setActive(true);
		}
	}, [called, debouncedValue]);

	return (
		<ClayAutocomplete className="mb-4">
			<BaseWrapper
				error={label ? errors[label]?.message : null}
				label={label}
				required={required}
			>
				<ClayAutocomplete.Input
					onBlur={() => setTimeout(() => setActive(false), 200)}
					onChange={(event) => {
						setValue(event.target.value);
						setShowValue(event.target.value);
					}}
					placeholder="Type here"
					value={showValue || value}
				/>

				<ClayAutocomplete.DropDown active={active}>
					<ClayDropDown.ItemList>
						{called && (error || (items && !items.length)) && (
							<ClayDropDown.Item className="disabled">
								No Results Found
							</ClayDropDown.Item>
						)}

						{!error &&
							items?.map((item: any) => (
								<ClayAutocomplete.Item
									key={item.id}
									match={value}
									onClick={() => onClickItem(label, item)}
									value={item.name}
								/>
							))}
					</ClayDropDown.ItemList>
				</ClayAutocomplete.DropDown>
			</BaseWrapper>

			{isValidating && <ClayAutocomplete.LoadingIndicator />}
		</ClayAutocomplete>
	);
};

export default AutoComplete;
