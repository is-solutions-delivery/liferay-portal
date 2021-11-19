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

package com.liferay.digital.signature.rest.internal.resource.v1_0;

import com.liferay.digital.signature.manager.DSEnvelopeManager;
import com.liferay.digital.signature.rest.dto.v1_0.DSEnvelope;
import com.liferay.digital.signature.rest.internal.dto.v1_0.util.DSEnvelopeUtil;
import com.liferay.digital.signature.rest.resource.v1_0.DSEnvelopeResource;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author José Abelenda
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/ds-envelope.properties",
	scope = ServiceScope.PROTOTYPE, service = DSEnvelopeResource.class
)
public class DSEnvelopeResourceImpl extends BaseDSEnvelopeResourceImpl {

	@Override
	public DSEnvelope getSiteDSEnvelope(Long siteId, String dsEnvelopeId)
		throws Exception {

		return DSEnvelopeUtil.toDSEnvelope(
			_dsEnvelopeManager.getDSEnvelope(
				contextCompany.getCompanyId(), siteId, dsEnvelopeId));
	}

	@Override
	public DSEnvelope postSiteDSEnvelope(Long siteId, DSEnvelope dsEnvelope)
		throws Exception {

		return DSEnvelopeUtil.toDSEnvelope(
			_dsEnvelopeManager.addDSEnvelope(
				contextCompany.getCompanyId(), siteId,
				DSEnvelopeUtil.toDSEnvelope(dsEnvelope)));
	}

	@Reference
	private DSEnvelopeManager _dsEnvelopeManager;

}