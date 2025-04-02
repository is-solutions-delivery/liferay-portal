/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getCurrentSiteId} from '../utils/util';

export const getTopThreePaths = async () => {
	return Liferay.Util.fetch(
		`/o/c/learningpaths/scopes/${getCurrentSiteId()}?fields=id,description,level,persona,title,position&pageSize=3&sort=position:asc`
	)
		.then((response) => response.json())
		.then((data) => data);
};

export const getLearningPath = async (learningPathId) => {
	return Liferay.Util.fetch(
		`/o/c/learningpaths/${learningPathId}?nestedFields=learningPathSteps`
	)
		.then((response) => response.json())
		.then((data) => data);
};
