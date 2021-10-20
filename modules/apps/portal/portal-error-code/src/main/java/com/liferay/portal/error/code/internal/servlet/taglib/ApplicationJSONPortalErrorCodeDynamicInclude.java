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

package com.liferay.portal.error.code.internal.servlet.taglib;

import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.servlet.taglib.DynamicInclude;
import com.liferay.portal.kernel.util.StackTraceUtil;

import java.io.PrintWriter;

import org.osgi.service.component.annotations.Component;

/**
 * @author Carlos Sierra Andrés
 */
@Component(
	property = "mime.type=application/json", service = DynamicInclude.class
)
public class ApplicationJSONPortalErrorCodeDynamicInclude
	extends BasePortalErrorCodeDynamicInclude {

	@Override
	protected void write(
		String message, PrintWriter printWriter, int statusCode) {

		printWriter.write(
			JSONUtil.put(
				"message", message
			).put(
				"statusCode", statusCode
			).toString());
	}

	@Override
	protected void write(
		String message, PrintWriter printWriter, String requestURI,
		int statusCode, Throwable throwable) {

		printWriter.write(
			JSONUtil.put(
				"message", message
			).put(
				"requestURI", requestURI
			).put(
				"statusCode", statusCode
			).put(
				"throwable",
				() -> {
					if (throwable != null) {
						return StackTraceUtil.getStackTrace(throwable);
					}

					return null;
				}
			).toString());
	}

}