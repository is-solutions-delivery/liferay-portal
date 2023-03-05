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

import {fetch} from 'frontend-js-web';
import {useCallback, useEffect, useState} from 'react';

const useCompanies = ({page, pageSize}) => {
	const [state, setState] = useState({
		items: [],
		loading: true,
		page,
		pageSize,
	});

	const getCompanyLog = useCallback(async (page, pageSize) => {
		const response = await fetch(
			`/o/company-log?page=${page}&pageSize=${pageSize}`
		);

		const data = await response.json();

		setState({loading: false, ...data});
	}, []);

	useEffect(() => {
		getCompanyLog(page, pageSize);
	}, [getCompanyLog, page, pageSize]);

	return state;
};

export default useCompanies;
