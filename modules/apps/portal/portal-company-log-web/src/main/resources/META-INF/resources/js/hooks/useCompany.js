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

import {fetch, sub} from 'frontend-js-web';
import {useCallback, useEffect, useState} from 'react';

const useCompany = ({companyId}) => {
	const [state, setState] = useState({
		error: null,
		loading: true,
		logs: [],
		webId: '',
	});

	const getCompanyLog = useCallback(async () => {
		const response = await fetch(`/o/company-log/${companyId}`);

		if (!response.ok && response.status === 404) {
			return setState((prevState) => ({
				...prevState,
				error: sub(
					Liferay.Language.get('x-not-found'),
					Liferay.Language.get('company')
				),
				loading: false,
			}));
		}

		const data = await response.json();

		setState({loading: false, ...data});
	}, [companyId]);

	useEffect(() => {
		getCompanyLog();
	}, [getCompanyLog]);

	return state;
};

export default useCompany;
