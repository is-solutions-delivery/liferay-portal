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
import ClayLabel from '@clayui/label';
import ClayList from '@clayui/list';
import React from 'react';
import {Link} from 'react-router-dom';

const LogList = ({companyId, history, logs}) => (
	<ClayList className="mt-3">
		{logs.map(({fileName, fileSize}, index) => (
			<ClayList.Item flex key={index}>
				<ClayList.ItemField>
					<ClayIcon
						className="mt-1"
						fontSize={18}
						symbol="document"
					/>
				</ClayList.ItemField>

				<ClayList.ItemField expand>
					<ClayList.ItemTitle>
						<Link to={`/${companyId}/${fileName}`}>
							{fileName}

							{index === 0 && (
								<ClayLabel className="ml-2" displayType="info">
									{Liferay.Language.get('newest')}
								</ClayLabel>
							)}
						</Link>
					</ClayList.ItemTitle>

					<ClayList.ItemText>{fileSize}</ClayList.ItemText>
				</ClayList.ItemField>

				<ClayList.ItemField>
					<ClayList.QuickActionMenu>
						<ClayList.QuickActionMenu.Item
							onClick={() =>
								history.push(`/${companyId}/${fileName}`)
							}
							symbol="view"
							title={Liferay.Language.get('view')}
						/>

						<ClayList.QuickActionMenu.Item
							onClick={() =>
								window.open(
									`/o/company-log/${companyId}/${fileName}`,
									'_blank'
								)
							}
							symbol="download"
							title={Liferay.Language.get('download')}
						/>
					</ClayList.QuickActionMenu>
				</ClayList.ItemField>
			</ClayList.Item>
		))}
	</ClayList>
);

export default LogList;
