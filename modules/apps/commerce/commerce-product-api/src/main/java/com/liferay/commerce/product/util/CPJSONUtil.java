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

package com.liferay.commerce.product.util;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.Validator;

import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @author Igor Beslic
 * @author Brian Wing Shun Chan
 */
public class CPJSONUtil {

	public static JSONArray getJSONArray(JSONObject jsonObject, String key) {
		JSONArray jsonArray = jsonObject.getJSONArray(key);

		if (jsonArray != null) {
			return jsonArray;
		}

		jsonArray = JSONFactoryUtil.createJSONArray();

		String string = jsonObject.getString(key);

		if (string != null) {
			jsonArray.put(string);
		}

		return jsonArray;
	}

	public static boolean isEmpty(String json) {
		if (Validator.isNull(json) || Objects.equals(json, "[]") ||
			Objects.equals(json, "{}")) {

			return true;
		}

		return false;
	}

	public static JSONArray toJSONArray(
		Map<String, List<String>>
			cpDefinitionOptionRelKeysCPDefinitionOptionValueRelKeys) {

		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		for (Map.Entry<String, List<String>> entry :
				cpDefinitionOptionRelKeysCPDefinitionOptionValueRelKeys.
					entrySet()) {

			jsonArray.put(
				JSONUtil.put(
					"key", entry.getKey()
				).put(
					"value",
					JSONUtil.toJSONArray(entry.getValue(), value -> value, _log)
				));
		}

		return jsonArray;
	}

	public static JSONArray toJSONArray(String json) throws JSONException {
		if (JSONUtil.isJSONArray(json)) {
			return JSONFactoryUtil.createJSONArray(json);
		}

		return JSONUtil.put(JSONFactoryUtil.createJSONObject(json));
	}

	private static final Log _log = LogFactoryUtil.getLog(CPJSONUtil.class);

}