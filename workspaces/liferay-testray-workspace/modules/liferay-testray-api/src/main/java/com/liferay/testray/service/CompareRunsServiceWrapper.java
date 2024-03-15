/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.service;

import com.liferay.portal.kernel.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link CompareRunsService}.
 *
 * @author Nilton Vieira
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
	public java.util.Map<String, java.util.Map<String, Integer>> getComparison(
			long companyId, long testrayRun1Id, long testrayRun2Id)
		throws Exception {

		return _compareRunsService.getComparison(
			companyId, testrayRun1Id, testrayRun2Id);
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