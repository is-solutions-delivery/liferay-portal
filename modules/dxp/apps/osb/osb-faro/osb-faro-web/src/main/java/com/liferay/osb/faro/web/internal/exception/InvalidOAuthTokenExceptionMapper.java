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

package com.liferay.osb.faro.web.internal.exception;

import com.liferay.osb.faro.engine.client.exception.InvalidOAuthTokenException;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.util.Map;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;

/**
 * @author Thiago Buarque
 */
public class InvalidOAuthTokenExceptionMapper
	implements ExceptionMapper<InvalidOAuthTokenException> {

	@Override
	public Response toResponse(
		InvalidOAuthTokenException invalidOAuthTokenException) {

		Map<String, String> stringMap = HashMapBuilder.put(
			"message", invalidOAuthTokenException.getMessage()
		).put(
			"status", "ERROR"
		).build();

		Response.ResponseBuilder responseBuilder = Response.status(401);

		return responseBuilder.entity(
			stringMap
		).header(
			"Content-Type", "application/json"
		).build();
	}

}