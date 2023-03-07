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

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayToggle} from '@clayui/form';
import ClayLink from '@clayui/link';
import React from 'react';

import Log from '../components/Log';
import Header from '../components/layout/Header';
import Page from '../components/layout/Page';
import useCompany from '../hooks/useCompany';
import useCompanyLog from '../hooks/useCompanyLog';

const LogPreview = ({
	history,
	match: {
		params: {companyId, fileName},
	},
}) => {
	const {loading, logs, pooling, setState} = useCompanyLog({
		companyId,
		fileName,
	});
	const {error, webId} = useCompany({companyId});

	return (
		<section>
			<div className="d-flex flex-row justify-content-between mb-2">
				<Header
					breadcrumbItems={[
						{label: Liferay.Language.get('home'), path: '/'},
						{label: webId, path: `/${companyId}`},
						{label: fileName},
					]}
					history={history}
					title={
						<div className="d-flex justify-content-between">
							<span>
								{Liferay.Language.get('console-output')}
							</span>

							<ClayToggle
								label={Liferay.Language.get('real-time')}
								onToggle={() =>
									setState((prevState) => ({
										...prevState,
										pooling: !prevState.pooling,
									}))
								}
								symbol={{
									off: 'times',
									on: 'check',
								}}
								toggled={pooling}
							/>
						</div>
					}
				>
					<div className="align-items-baseline d-flex">
						<ClayButton
							displayType="secondary"
							onClick={() =>
								setState((prevState) => ({
									...prevState,
									logs: '',
								}))
							}
							size="sm"
						>
							{Liferay.Language.get('clear')}
						</ClayButton>

						<ClayLink
							className="ml-1"
							displayType="primary"
							href={`/o/company-log/${companyId}/${fileName}?action=read&format=full`}
							outline
							target="_blank"
						>
							{Liferay.Language.get('see-full-log')}
						</ClayLink>
					</div>
				</Header>

				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('download')}
					displayType="unstyled"
					onClick={() =>
						window.open(
							`/o/company-log/${companyId}/${fileName}`,
							'_blank'
						)
					}
					symbol="download"
					title={Liferay.Language.get('download')}
				/>
			</div>

			<Page error={error} loading={loading}>
				<Log>{logs}</Log>
			</Page>
		</section>
	);
};

export default LogPreview;
