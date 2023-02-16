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

package com.liferay.client.extension.type.internal.factory;

import com.liferay.client.extension.model.ClientExtensionEntry;
import com.liferay.client.extension.type.SiteInitializerCET;
import com.liferay.client.extension.type.factory.CETImplFactory;
import com.liferay.client.extension.type.internal.SiteInitializerCETImpl;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.util.UnicodeProperties;

import javax.portlet.PortletRequest;
import java.util.Properties;

/**
 * @author Nilton Vieira
 */
public class SiteInitializerCETImplFactoryImpl implements CETImplFactory<SiteInitializerCET> {
	@Override
	public SiteInitializerCET create(ClientExtensionEntry clientExtensionEntry)
		throws PortalException {
		return new SiteInitializerCETImpl(clientExtensionEntry);
	}

	@Override
	public SiteInitializerCET create(PortletRequest portletRequest)
		throws PortalException {
		return new SiteInitializerCETImpl(portletRequest);
	}

	@Override
	public SiteInitializerCET create(
		String baseURL, long companyId, String description,
		String externalReferenceCode, String name, Properties properties,
		String sourceCodeURL, UnicodeProperties toTypeSettingsUnicodeProperties)
		throws PortalException {
		return new SiteInitializerCETImpl(baseURL, companyId, description, externalReferenceCode, name, properties, sourceCodeURL, toTypeSettingsUnicodeProperties);
	}

	@Override
	public void validate(
		UnicodeProperties newTypeSettingsUnicodeProperties,
		UnicodeProperties oldTypeSettingsUnicodeProperties)
		throws PortalException {

	}
}