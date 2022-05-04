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

import ClayIcon from '@clayui/icon';
import React, {useEffect, useState} from 'react';

import ClayIconProvider from '../../../common/context/ClayIconProvider';
import {getApplicationsStatus} from '../../../common/services/Application';
import {CONSTANTS} from '../../../common/utils/constants';
import Section from './components/Section';

export default function () {
	const [section, setSection] = useState({
		active: true,
		index: 0,
		link: 'Applications',
		name: 'LEADS',
		subSections: [
			{
				name: 'Unassigned',
				value: 0,
			},
			{
				name: 'Abandoned',
				value: 0,
			},
			{
				name: 'Open',
				value: 0,
			},
		],
	});

	const settingsOnClick = () => {
		alert('Open Modal');
	};

	const getTotalCount = (result) => {
		return result?.value?.data?.totalCount || 0;
	};

	const loadData = () => {
		Promise.allSettled([
			getApplicationsStatus(CONSTANTS.STATUS.INCOMPLETE),
			getApplicationsStatus(CONSTANTS.STATUS.QUOTED),
			getApplicationsStatus(CONSTANTS.STATUS.OPEN),
		]).then((results) => {
			const [
				incompleteApplicationsResult,
				openApplicationsResults,
				quotedApplicationsResult,
			] = results;

			setSection({
				...section,
				subSections: [
					{
						name: 'Unassigned',
						value: getTotalCount(quotedApplicationsResult),
					},
					{
						name: 'Abandoned',
						value: getTotalCount(incompleteApplicationsResult),
					},
					{
						name: 'Open',
						value: getTotalCount(openApplicationsResults),
					},
				],
			});
		});
	};

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ClayIconProvider>
			<div className="dashboard-whats-new-container flex-shrink-0 pb-4 pt-3 px-3">
				<div className="align-items-center d-flex dashboard-whats-new-header justify-content-between">
					<div className="dashboard-whats-new-title font-weight-bolder h4 mb-0">
						What&apos;s New
					</div>

					<div className="mr-2 settings-icon">
						<ClayIcon
							className="text-neutral-5"
							onClick={settingsOnClick}
							symbol="cog"
						/>
					</div>
				</div>

				<div className="dashboard-whats-new-subtext mb-3 mx-3 text-neutral-9">
					Since the end of last business day
				</div>

				<div className="d-flex dashboard-whats-new-content flex-column mx-3">
					<Section section={section} />
				</div>
			</div>
		</ClayIconProvider>
	);
}
