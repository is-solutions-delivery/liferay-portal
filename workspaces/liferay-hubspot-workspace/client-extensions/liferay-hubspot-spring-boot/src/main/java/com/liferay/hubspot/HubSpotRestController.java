/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.hubspot;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.hubspot.service.HubSpotService;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Ricardo Mariz
 */
@RequestMapping("/")
@RestController
public class HubSpotRestController extends BaseRestController {

	@PostMapping("/lead")
	public void createLead(@RequestBody String json) throws Exception {
		JSONObject jsonObject = new JSONObject(json);

		JSONObject objectEntryJSONObject = jsonObject.getJSONObject(
			"objectEntry");

		JSONObject objectValuesJSONObject = objectEntryJSONObject.getJSONObject(
			"values");

		String firstName = objectValuesJSONObject.getString("firstName");

		String lastName = objectValuesJSONObject.getString("lastName");

		String email = objectValuesJSONObject.getString("email");

		String phone = objectValuesJSONObject.getString("phone");

		String companyName = objectValuesJSONObject.getString("companyName");

		String numberOfEmployees = String.valueOf(
			objectValuesJSONObject.getInt("numberOfEmployees"));

		String websiteURL = objectValuesJSONObject.getString("websiteURL");

		_hubSpotService.createLead(
			email, firstName, lastName, phone, companyName, numberOfEmployees,
			websiteURL);
	}

	@Autowired
	private HubSpotService _hubSpotService;

}