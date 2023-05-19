/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.testray.service;

/**
 * Provides the remote service utility for CompareRuns. This utility wraps
 * <code>com.liferay.osb.testray.service.impl.CompareRunsServiceImpl</code> and is an
 * access point for service operations in application layer code running on a
 * remote server. Methods of this service are expected to have security checks
 * based on the propagated JAAS credentials because this service can be
 * accessed remotely.
 *
 * @author José Abelenda
 * @see CompareRunsService
 * @generated
 */
public class CompareRunsServiceUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.liferay.osb.testray.service.impl.CompareRunsServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */
	public static int getComparison(
		long companyId, long testrayRunId1, long testrayRunId2,
		java.lang.String testrayDueStatus1,
		java.lang.String testrayDueStatus2) {

		return getService().getComparison(
			companyId, testrayRunId1, testrayRunId2, testrayDueStatus1,
			testrayDueStatus2);
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	public static java.lang.String getOSGiServiceIdentifier() {
		return getService().getOSGiServiceIdentifier();
	}

	public static CompareRunsService getService() {
		return _service;
	}

	public static void setService(CompareRunsService service) {
		_service = service;
	}

	private static volatile CompareRunsService _service;

}