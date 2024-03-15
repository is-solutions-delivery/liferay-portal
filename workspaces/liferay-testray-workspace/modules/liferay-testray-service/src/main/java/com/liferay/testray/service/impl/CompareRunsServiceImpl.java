/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.service.impl;

import com.liferay.portal.aop.AopService;
import com.liferay.testray.service.base.CompareRunsServiceBaseImpl;

import java.util.Map;

import org.osgi.service.component.annotations.Component;

/**
 * @author Nilton Vieira
 */
@Component(
	property = {
		"json.web.service.context.name=testray",
		"json.web.service.context.path=CompareRuns"
	},
	service = AopService.class
)
public class CompareRunsServiceImpl extends CompareRunsServiceBaseImpl {

	public Map<String, Map<String, Integer>> getComparison(
			long companyId, long testrayRun1Id, long testrayRun2Id)
		throws Exception {

		return compareRunsLocalService.getComparison(
			companyId, testrayRun1Id, testrayRun2Id);
	}

}