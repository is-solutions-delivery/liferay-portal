/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.testray.service;

import com.liferay.portal.kernel.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link CompareRunsService}.
 *
 * @author José Abelenda
 * @see CompareRunsService
 * @generated
 */
public class CompareRunsServiceWrapper
	implements CompareRunsService, ServiceWrapper<CompareRunsService> {

	public CompareRunsServiceWrapper() {
		this(null);
	}

	public CompareRunsServiceWrapper(CompareRunsService compareRunsService) {
		_compareRunsService = compareRunsService;
	}

	@Override
	public int getComparison(
		long companyId, long testrayRunId1, long testrayRunId2,
		String testrayDueStatus1, String testrayDueStatus2) {

		return _compareRunsService.getComparison(
			companyId, testrayRunId1, testrayRunId2, testrayDueStatus1,
			testrayDueStatus2);
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _compareRunsService.getOSGiServiceIdentifier();
	}

	@Override
	public CompareRunsService getWrappedService() {
		return _compareRunsService;
	}

	@Override
	public void setWrappedService(CompareRunsService compareRunsService) {
		_compareRunsService = compareRunsService;
	}

	private CompareRunsService _compareRunsService;

}