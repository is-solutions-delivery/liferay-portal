/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.testray.service;

import com.liferay.portal.kernel.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link CompareRunsLocalService}.
 *
 * @author José Abelenda
 * @see CompareRunsLocalService
 * @generated
 */
public class CompareRunsLocalServiceWrapper
	implements CompareRunsLocalService,
			   ServiceWrapper<CompareRunsLocalService> {

	public CompareRunsLocalServiceWrapper() {
		this(null);
	}

	public CompareRunsLocalServiceWrapper(
		CompareRunsLocalService compareRunsLocalService) {

		_compareRunsLocalService = compareRunsLocalService;
	}

	@Override
	public int getComparison(
		long companyId, long testrayRunId1, long testrayRunId2,
		String testrayDueStatus1, String testrayDueStatus2) {

		return _compareRunsLocalService.getComparison(
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
		return _compareRunsLocalService.getOSGiServiceIdentifier();
	}

	@Override
	public CompareRunsLocalService getWrappedService() {
		return _compareRunsLocalService;
	}

	@Override
	public void setWrappedService(
		CompareRunsLocalService compareRunsLocalService) {

		_compareRunsLocalService = compareRunsLocalService;
	}

	private CompareRunsLocalService _compareRunsLocalService;

}