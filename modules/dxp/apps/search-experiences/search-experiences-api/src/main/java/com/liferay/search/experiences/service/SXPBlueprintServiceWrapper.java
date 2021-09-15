/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.search.experiences.service;

import com.liferay.portal.kernel.service.ServiceWrapper;

/**
 * Provides a wrapper for {@link SXPBlueprintService}.
 *
 * @author Brian Wing Shun Chan
 * @see SXPBlueprintService
 * @generated
 */
public class SXPBlueprintServiceWrapper
	implements ServiceWrapper<SXPBlueprintService>, SXPBlueprintService {

	public SXPBlueprintServiceWrapper(SXPBlueprintService sxpBlueprintService) {
		_sxpBlueprintService = sxpBlueprintService;
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _sxpBlueprintService.getOSGiServiceIdentifier();
	}

	@Override
	public SXPBlueprintService getWrappedService() {
		return _sxpBlueprintService;
	}

	@Override
	public void setWrappedService(SXPBlueprintService sxpBlueprintService) {
		_sxpBlueprintService = sxpBlueprintService;
	}

	private SXPBlueprintService _sxpBlueprintService;

}