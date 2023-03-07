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
import {useCallback, useState} from 'react';

import useInterval from './useInterval';

const POOLING_TIMEOUT = 3000;

const useCompanyLog = ({companyId, fileName}) => {
	const [state, setState] = useState({
		loading: true,
		logs: '',
		pooling: true,
		totalLineCount: 0,
	});

	const {pooling} = state;

	const getCompanyLog = useCallback(async () => {
		const response = await fetch(
			`/o/company-log/${companyId}/${fileName}?action=read`
		);

		const {log, totalLineCount} = await response.json();

		const logArray = log.split('\n');

		setState((prevState) => {
			const lineDiff = totalLineCount - prevState.totalLineCount;

			if (lineDiff === 0) {
				return prevState;
			}

			const logs = `${logArray.slice(0, lineDiff).join('\n')}${
				prevState.logs
			}`;

			return {
				...prevState,
				loading: false,
				logs,
				totalLineCount,
			};
		});
	}, [companyId, fileName]);

	useInterval(async () => {
		if (pooling) {
			await getCompanyLog();
		}
	}, POOLING_TIMEOUT);

	return {...state, setState};
};

export default useCompanyLog;
