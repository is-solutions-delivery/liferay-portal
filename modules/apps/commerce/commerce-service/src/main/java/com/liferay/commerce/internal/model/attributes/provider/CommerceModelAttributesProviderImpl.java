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

package com.liferay.commerce.internal.model.attributes.provider;

import com.liferay.commerce.model.attributes.provider.CommerceModelAttributesProvider;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterRegistry;
import com.liferay.portal.vulcan.dto.converter.DefaultDTOConverterContext;

import java.util.Collections;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Riccardo Alberti
 */
@Component(service = CommerceModelAttributesProvider.class)
public class CommerceModelAttributesProviderImpl
	implements CommerceModelAttributesProvider {

	@Override
	public Map<String, Object> getModelAttributes(
		BaseModel<?> baseModel, DTOConverter<?, ?> dtoConverter, long userId) {

		Map<String, Object> modelAttributes = baseModel.getModelAttributes();

		if (dtoConverter == null) {
			if (_log.isWarnEnabled()) {
				Class<?> baseModelClass = baseModel.getClass();

				_log.warn(
					"No DTO converter found for " + baseModelClass.getName());
			}

			return modelAttributes;
		}

		User user = _userLocalService.fetchUser(userId);

		if (user == null) {
			if (_log.isWarnEnabled()) {
				_log.warn("No user found with user ID " + userId);
			}

			return modelAttributes;
		}

		try {
			Object object = dtoConverter.toDTO(
				new DefaultDTOConverterContext(
					false, Collections.emptyMap(), _dtoConverterRegistry,
					baseModel.getPrimaryKeyObj(), user.getLocale(), null,
					user));

			if (object == null) {
				return modelAttributes;
			}

			JSONObject jsonObject = _jsonFactory.createJSONObject(
				_jsonFactory.looseSerializeDeep(object));

			return jsonObject.put(
				"createDate", modelAttributes.get("createDate")
			).put(
				"modifiedDate", modelAttributes.get("modifiedDate")
			).put(
				"status", modelAttributes.get("status")
			).put(
				"userName", user.getFullName()
			).put(
				"uuid", modelAttributes.get("uuid")
			).toMap();
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}
		}

		return modelAttributes;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		CommerceModelAttributesProviderImpl.class);

	@Reference
	private DTOConverterRegistry _dtoConverterRegistry;

	@Reference
	private JSONFactory _jsonFactory;

	@Reference
	private UserLocalService _userLocalService;

}