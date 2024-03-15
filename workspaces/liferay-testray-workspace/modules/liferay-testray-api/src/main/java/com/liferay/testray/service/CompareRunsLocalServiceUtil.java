/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.service;

import java.util.Map;

/**
 * Provides the local service utility for CompareRuns. This utility wraps
 * <code>com.liferay.testray.service.impl.CompareRunsLocalServiceImpl</code> and
 * is an access point for service operations in application layer code running
 * on the local server. Methods of this service will not have security checks
 * based on the propagated JAAS credentials because this service can only be
 * accessed from within the same VM.
 *
 * @author Nilton Vieira
 * @see CompareRunsLocalService
 * @generated
 */
public class CompareRunsLocalServiceUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.liferay.testray.service.impl.CompareRunsLocalServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */
	public static Map<String, Map<String, Integer>> getComparison(
			long companyId, long testrayRun1Id, long testrayRun2Id)
		throws Exception {

		return getService().getComparison(
			companyId, testrayRun1Id, testrayRun2Id);
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	public static String getOSGiServiceIdentifier() {
		return getService().getOSGiServiceIdentifier();
	}

	public static CompareRunsLocalService getService() {
		return _service;
	}

	public static void setService(CompareRunsLocalService service) {
		_service = service;
	}

	private static volatile CompareRunsLocalService _service;

}