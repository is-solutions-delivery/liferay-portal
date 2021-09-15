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
 * Provides a wrapper for {@link SXPElementService}.
 *
 * @author Brian Wing Shun Chan
 * @see SXPElementService
 * @generated
 */
public class SXPElementServiceWrapper
	implements ServiceWrapper<SXPElementService>, SXPElementService {

	public SXPElementServiceWrapper(SXPElementService sxpElementService) {
		_sxpElementService = sxpElementService;
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _sxpElementService.getOSGiServiceIdentifier();
	}

	@Override
	public SXPElementService getWrappedService() {
		return _sxpElementService;
	}

	@Override
	public void setWrappedService(SXPElementService sxpElementService) {
		_sxpElementService = sxpElementService;
	}

	private SXPElementService _sxpElementService;

}