/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.client.extension.util.spring.boot3.client.LiferayOAuth2AccessTokenManager;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

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
import org.springframework.web.util.UriComponentsBuilder;

/**
 * @author Lucas Emanuel
 */
@RestController
public class CourseProgressDownloadRestController extends BaseRestController {

	@GetMapping("/course-progress/download")
	public ResponseEntity<String> downloadCourseProgress(
		@AuthenticationPrincipal Jwt jwt,
		@RequestParam(required = false) String startDate,
		@RequestParam(required = false) String endDate) {

		List<EnrollmentData> enrollmentDataList = new ArrayList<>();

		int lastPage = 1;

		for (int i = 1; i <= lastPage; i++) {
			JSONObject jsonObject = new JSONObject(
				get(
					_getAuthorization(),
					UriComponentsBuilder.fromUriString(
						"/o/c/enrollments/scopes/" + _siteGroupId
					).queryParam(
						"pageSize", -1
					).queryParam(
						"page", i
					).queryParam(
						"nestedFields", "course,user"
					).build(
					).toUri()));

			JSONArray jsonArray = jsonObject.getJSONArray("items");

			for (Object itemObject : jsonArray) {
				if (!(itemObject instanceof JSONObject)) {
					continue;
				}

				JSONObject enrollmentJsonObject = (JSONObject)itemObject;

				JSONObject userJsonObject = enrollmentJsonObject.optJSONObject(
					"r_userenrollments_user");
				JSONObject courseJsonObject =
					enrollmentJsonObject.optJSONObject(
						"r_courseEnrollment_c_course");

				if ((userJsonObject == null) || (courseJsonObject == null)) {
					continue;
				}

				String modifiedDate = enrollmentJsonObject.optString(
					"dateModified", null);

				if (!isWithinDateRange(modifiedDate, startDate, endDate)) {
					continue;
				}

				String userId = userJsonObject.optString(
					"id",
					UUID.randomUUID(
					).toString());
				String[] fullName = userJsonObject.optString(
					"name", ""
				).split(
					" ", 2
				);
				String firstName = fullName.length > 0 ? fullName[0] : "";
				String lastName = fullName.length > 1 ? fullName[1] : "";
				String email = userJsonObject.optString("emailAddress", "");

				JSONArray groups = userJsonObject.optJSONArray(
					"userGroupBriefs");
				List<String> groupNames = new ArrayList<>();

				if (groups != null) {
					for (int g = 0; g < groups.length(); g++) {
						groupNames.add(
							groups.getJSONObject(
								g
							).optString(
								"name", ""
							));
					}
				}

				String userGroup = String.join(" | ", groupNames);

				String courseTitle = courseJsonObject.optString("title", "");
				float totalAssets = courseJsonObject.optInt("totalAssets", 0);

				String completedAssetsStr = enrollmentJsonObject.optString(
					"completedAssetIds", ""
				).replaceFirst(
					"^,", ""
				);

				List<String> completedAssets =
					completedAssetsStr.isBlank() ? Collections.emptyList() :
						Arrays.asList(completedAssetsStr.split(","));

				enrollmentDataList.add(
					new EnrollmentData(
						userId, firstName, lastName, email, userGroup,
						courseTitle, totalAssets, completedAssets));
			}

			lastPage = jsonObject.getInt("lastPage");
		}

		try (PrintWriter printWriter = new PrintWriter(
				new FileWriter("report.csv"))) {

			printWriter.println(
				"First Name,Last Name,Work Email,Course Name,Completion Status,% Complete,User Group");

			for (EnrollmentData data : enrollmentDataList) {
				if (data.getTotalAssets() == 0)

					continue;
				float percent =
					(float)data.getCompletedAssets(
					).size() / data.getTotalAssets() * 100;
				String status = percent >= 100 ? "completed" : "in progress";

				printWriter.printf(
					"%s,%s,%s,%s,%s,%.2f,%s\n", data.getFirstName(),
					data.getLastName(), data.getEmail(), data.getCourseTitle(),
					status, percent, data.getUserGroup());
			}

			printWriter.flush();
		}
		catch (IOException ioException) {
			return ResponseEntity.status(
				HttpStatus.INTERNAL_SERVER_ERROR
			).body(
				"Error generating CSV."
			);
		}

		return ResponseEntity.ok(
			"CSV report successfully generated on 'report.csv'");
	}

	private String _getAuthorization() {
		return _liferayOAuth2AccessTokenManager.getAuthorization(
			"liferay-learn-etc-spring-boot-oauth-application-headless-server");
	}

	private boolean isWithinDateRange(
		String dateStr, String start, String end) {

		if ((dateStr == null) || ((start == null) && (end == null)))

			return true;

		try {
			LocalDate date = LocalDate.parse(
				dateStr, DateTimeFormatter.ISO_DATE_TIME);

			if (start != null) {
				LocalDate startDate = LocalDate.parse(start);

				if (date.isBefore(startDate))

					return false;
			}

			if (end != null) {
				LocalDate endDate = LocalDate.parse(end);

				if (date.isAfter(endDate))

					return false;
			}

			return true;
		}
		catch (DateTimeParseException dateTimeParseException) {
			return false;
		}
	}

	@Autowired
	private LiferayOAuth2AccessTokenManager _liferayOAuth2AccessTokenManager;

	@Value("${liferay.learn.dxp.site.group.id}")
	private long _siteGroupId;

	private static class EnrollmentData {

		public EnrollmentData(
			String userId, String firstName, String lastName, String email,
			String userGroup, String courseTitle, float totalAssets,
			List<String> completedAssets) {

			this.userId = userId;
			this.firstName = firstName;
			this.lastName = lastName;
			this.email = email;
			this.userGroup = userGroup;
			this.courseTitle = courseTitle;
			this.totalAssets = totalAssets;
			this.completedAssets = completedAssets;
		}

		public List<String> getCompletedAssets() {
			return completedAssets;
		}

		public String getCourseTitle() {
			return courseTitle;
		}

		public String getEmail() {
			return email;
		}

		public String getFirstName() {
			return firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public float getTotalAssets() {
			return totalAssets;
		}

		public String getUserGroup() {
			return userGroup;
		}

		public String getUserId() {
			return userId;
		}

		private final List<String> completedAssets;
		private final String courseTitle;
		private final String email;
		private final String firstName;
		private final String lastName;
		private final float totalAssets;
		private final String userGroup;
		private final String userId;

	}

}