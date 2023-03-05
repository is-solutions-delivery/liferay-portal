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

import React from 'react';

import LogList from '../components/LogList';
import Header from '../components/layout/Header';
import Page from '../components/layout/Page';
import useCompany from '../hooks/useCompany';

const Company = ({
	history,
	match: {
		params: {companyId},
	},
}) => {
	const {error, loading, logs, webId} = useCompany({companyId});

	return (
		<div>
			<Header
				breadcrumbItems={[
					{label: Liferay.Language.get('home'), path: '/'},
					{label: webId},
				]}
				history={history}
				title={Liferay.Language.get('logs')}
			/>

			<Page error={error} loading={loading}>
				<LogList companyId={companyId} history={history} logs={logs} />
			</Page>
		</div>
	);
};

export default Company;
