/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.client.extension.util.spring.boot3.client.LiferayOAuth2AccessTokenManager;
import com.liferay.portal.kernel.util.GetterUtil;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Lucas Emanuel
 */
@RestController
public class CourseProgressDownloadRestController extends BaseRestController {

	@GetMapping("/course-progress/download")
	public ResponseEntity<Object> downloadCourseProgress(
		@AuthenticationPrincipal Jwt jwt,
		@RequestParam(required = false, value = "endDate") String endDate,
		@RequestParam(required = false, value = "startDate") String startDate) {

		DateTimeFormatter dateTimeFormatter =
			DateTimeFormatter.ISO_OFFSET_DATE_TIME;
		List<Object> itemList = new JSONObject(
			get(_getAuthorization(), "/o/c/enrollments/scopes/" + _siteGroupId)
		).getJSONArray(
			"items"
		).toList();
		List<String> userIds = new ArrayList<>();
		LocalDate end = LocalDate.parse(endDate);
		LocalDate start = LocalDate.parse(startDate);
		Map<String, String> courseTitleMap = new HashMap<>();
		Map<String, Integer> courseTotalAssetsMap = new HashMap<>();
		Map<String, String> dateModifiedMap = new HashMap<>();
		Map<String, List<String>> userCompletedAssetsMap = new HashMap<>();
		Map<String, String> userCourseIdsMap = new HashMap<>();
		Map<String, String> userEmailMap = new HashMap<>();
		Map<String, String> userFirstNameMap = new HashMap<>();
		Map<String, String> userGroupNameMap = new HashMap<>();
		Map<String, String> userLastNameMap = new HashMap<>();

		for (Object item : itemList) {
			if (item instanceof Map) {
				Map<String, Object> mapItem = (Map<String, Object>)item;

				String dateModifiedString = (String)mapItem.get("dateModified");

				ZonedDateTime dateModified = ZonedDateTime.parse(
					dateModifiedString, dateTimeFormatter);

				LocalDate modifiedDate = dateModified.toLocalDate();

				if (modifiedDate.isBefore(start) || modifiedDate.isAfter(end)) {
					continue;
				}

				String userId = String.valueOf(
					mapItem.get("r_userenrollments_userId"));

				userIds.add(userId);
				dateModifiedMap.put(userId, dateModifiedString);

				Object completedAssetsObject = mapItem.get("completedAssetIds");

				if (completedAssetsObject != null) {
					String completedAssetIdsStr =
						completedAssetsObject.toString(
						).replaceAll(
							"^,|,$", ""
						);

					List<String> completedAssetIds = Arrays.asList(
						completedAssetIdsStr.split(","));

					userCompletedAssetsMap.put(userId, completedAssetIds);
				}

				Object courseIdObject = mapItem.get(
					"r_courseEnrollment_c_courseId");

				if (courseIdObject != null) {
					String courseId = courseIdObject.toString(
					).trim();

					userCourseIdsMap.put(userId, courseId);

					if (!courseId.isEmpty() && !Objects.equals(courseId, "0")) {
						JSONObject courseJSONObject = new JSONObject(
							get(
								_getAuthorization(),
								"/o/c/courses/" + courseId));

						String courseTitle = courseJSONObject.get(
							"title"
						).toString();

						courseTitleMap.put(userId, courseTitle);

						int courseTotalAssets = GetterUtil.getInteger(
							courseJSONObject.get(
								"totalAssets"
							).toString(
							).trim());

						courseTotalAssetsMap.put(userId, courseTotalAssets);
					}
				}

				JSONObject userJSONObject = new JSONObject(
					get(
						_getAuthorization(),
						"/o/headless-admin-user/v1.0/user-accounts/" + userId));

				userFirstNameMap.put(
					userId,
					userJSONObject.get(
						"givenName"
					).toString());
				userLastNameMap.put(
					userId,
					userJSONObject.get(
						"familyName"
					).toString());
				userEmailMap.put(
					userId,
					userJSONObject.get(
						"emailAddress"
					).toString());

				JSONArray userGroupBriefsJSONArray =
					userJSONObject.optJSONArray("userGroupBriefs");

				if ((userGroupBriefsJSONArray != null) &&
					(userGroupBriefsJSONArray.length() > 0)) {

					JSONObject groupJSONObject =
						userGroupBriefsJSONArray.getJSONObject(0);

					userGroupNameMap.put(
						userId, groupJSONObject.optString("name"));
				}
			}
		}

		try (PrintWriter printWriter = new PrintWriter(
				new FileWriter("report.csv"))) {

			printWriter.println(
				"First Name, Last Name, Work Email, Course Name,
                completion status, % Complete, User Group");

			for (String userId : userIds) {
				float completed = userCompletedAssetsMap.getOrDefault(
					userId, Collections.emptyList()
				).size();

				float total = courseTotalAssetsMap.getOrDefault(userId, 0);

				if (total == 0) {
					continue;
				}

				float percent = (completed / total) * 100;

				String status = (percent >= 100) ? "completed" : "in progress";

				printWriter.printf(
					"%s,%s,%s,%s,%s,%.2f,%s",
					userFirstNameMap.getOrDefault(userId, ""),
					userLastNameMap.getOrDefault(userId, ""),
					userEmailMap.getOrDefault(userId, ""),
					courseTitleMap.getOrDefault(userId, ""), status, percent,
					userGroupNameMap.getOrDefault(userId, ""));
			}
		}
		catch (IOException ioException) {
			System.err.println(
				"Error to save CSV: " + ioException.getMessage());
		}

		return new ResponseEntity<>(itemList, HttpStatus.OK);
	}

	private String _getAuthorization() {
		return _liferayOAuth2AccessTokenManager.getAuthorization(
			"liferay-learn-etc-spring-boot-oauth-application-headless-server");
	}

	@Autowired
	private LiferayOAuth2AccessTokenManager _liferayOAuth2AccessTokenManager;

	@Value("${liferay.learn.dxp.site.group.id}")
	private long _siteGroupId;

}