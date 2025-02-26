/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.dotcom;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.petra.string.StringBundler;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author José Abelenda
 * @author Ana Beatriz Alves
 */
@RequestMapping("/object/action/event-registration-status-update")
@RestController
public class ObjectActionEventRegistrationStatusUpdateRestController extends BaseRestController {

	@PostMapping
	public ResponseEntity<String> post(
		@AuthenticationPrincipal Jwt jwt, @RequestBody String json) {

		JSONObject eventRegistrationResponseJSONObject = new JSONObject(
			get(
				"Bearer " + jwt.getTokenValue(),
				StringBundler.concat(
					"/o/c/eventregistrations/", _getEventRegistrationId(json),
					"?fields=r_eventRegistration_c_eventId")));

		long eventID = eventRegistrationResponseJSONObject.getLong("r_eventRegistration_c_eventId");

		JSONObject eventResponseJSONObject = new JSONObject(
			get(
				"Bearer " + jwt.getTokenValue(),
				StringBundler.concat(
					"/o/c/events/", eventID,
					"?fields=eventCapacityStatus")));

		patch(
			"Bearer " + jwt.getTokenValue(),
			_getPayloadJSONObject(
				eventResponseJSONObject.getJSONObject("eventCapacityStatus")
			).toString(),
			"/o/c/eventregistrations/" + _getEventRegistrationId(json));

		if (_log.isInfoEnabled()) {
			_log.info("Updated Event Registration Status " + _getEventRegistrationId(json));
		}

		return new ResponseEntity<>(json, HttpStatus.OK);
	}

	//	revisar
	private long _getEventRegistrationId(String json) {
		JSONObject jsonObject = new JSONObject(json);

		JSONObject objectEntryJSONObject = jsonObject.getJSONObject(
			"objectEntry");

		JSONObject valuesJSONObject = objectEntryJSONObject.getJSONObject(
			"values");

		if (valuesJSONObject.has("id")) {
			return valuesJSONObject.getLong("id");
		}

		return valuesJSONObject.getLong("id");
	}

	private JSONObject _getPayloadJSONObject(JSONObject eventStatusJSONObject) {
		JSONObject eventResgistrationStatus = new JSONObject(
		).put("key", eventStatusJSONObject.getString("key")
		).put("name", eventStatusJSONObject.getString("name"));

		return new JSONObject(
		).put(
			"eventRegistrationStatus", eventResgistrationStatus
		);
	}

	private static final Log _log = LogFactory.getLog(
		ObjectActionEventRegistrationStatusUpdateRestController.class);
}