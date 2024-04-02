/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.rest.internal.resource.v1_0;

import com.liferay.portal.vulcan.multipart.MultipartBody;
import com.liferay.testray.rest.resource.v1_0.TestrayImportResultsResource;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Nilton Vieira
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/testray-import-results.properties",
	scope = ServiceScope.PROTOTYPE, service = TestrayImportResultsResource.class
)
public class TestrayImportResultsResourceImpl
	extends BaseTestrayImportResultsResourceImpl {

	@Override
	public void postTestrayImportResults(MultipartBody multipartBody)
		throws Exception {
	}

}