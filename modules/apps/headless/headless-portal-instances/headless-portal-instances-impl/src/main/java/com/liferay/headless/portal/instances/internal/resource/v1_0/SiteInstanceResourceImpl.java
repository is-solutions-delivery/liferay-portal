/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.headless.portal.instances.internal.resource.v1_0;

import com.liferay.headless.portal.instances.dto.v1_0.SiteInstance;
import com.liferay.headless.portal.instances.resource.v1_0.SiteInstanceResource;

import com.liferay.site.exception.InitializationException;
import com.liferay.site.initializer.SiteInitializer;
import com.liferay.site.initializer.SiteInitializerRegistry;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Alberto Chaparro
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/site-instance.properties",
	scope = ServiceScope.PROTOTYPE, service = SiteInstanceResource.class
)
public class SiteInstanceResourceImpl extends BaseSiteInstanceResourceImpl {

	@Override
	public SiteInstance postSiteInstance(SiteInstance siteInstance){

		SiteInitializer siteInitializer =
			_siteInitializerRegistry.getSiteInitializer(siteInstance.getSiteInitializerKey());

		try {
			siteInitializer.initialize(siteInstance.getGroupId());
		}
		catch (InitializationException e) {
			throw new RuntimeException(e);
		}
		return siteInstance;
	}

	@Reference
	private SiteInitializerRegistry _siteInitializerRegistry;

}