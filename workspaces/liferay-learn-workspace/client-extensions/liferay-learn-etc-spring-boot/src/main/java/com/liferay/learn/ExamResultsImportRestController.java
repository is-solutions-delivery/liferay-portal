/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.client.extension.util.spring.boot3.client.LiferayOAuth2AccessTokenManager;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.StringUtil;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * @author Lucas Emanuel
 */
@RequestMapping("/api/exam-results")
@RestController
public class ExamResultsImportRestController extends BaseRestController {

	public static String formatToIsoUtc(String rawDateTime) {
		rawDateTime = normalizeDateTime(rawDateTime);

		return LocalDateTime.parse(
			rawDateTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
		).atOffset(
			ZoneOffset.UTC
		).format(
			DateTimeFormatter.ISO_INSTANT
		);
	}

	public static String normalizeDateTime(String input) {
		Matcher matcher = _dateTimePattern.matcher(input);

		if (matcher.matches()) {
			String day = String.format(
				"%02d", GetterUtil.getInteger(matcher.group(3)));
			String hour = String.format(
				"%02d", GetterUtil.getInteger(matcher.group(4)));
			String minute = matcher.group(5);
			String month = String.format(
				"%02d", GetterUtil.getInteger(matcher.group(2)));
			String second = matcher.group(6);
			String year = matcher.group(1);

			return StringBundler.concat(
				year, "-", month, "-", day, " ", hour, ":", minute, ":",
				second);
		}

		throw new IllegalArgumentException("Invalid date format: " + input);
	}

	@PostMapping(
		consumes = MediaType.MULTIPART_FORM_DATA_VALUE, value = "/import-csv"
	)
	public ResponseEntity<String> uploadCsv(
		@RequestParam("file") MultipartFile file) {

		try {
			return _processCsv(file);
		}
		catch (Exception exception) {
			return ResponseEntity.status(
				HttpStatus.INTERNAL_SERVER_ERROR
			).body(
				"Error processing CSV: " + exception.getMessage()
			);
		}
	}

	private String _getAuthorization() {
		return _liferayOAuth2AccessTokenManager.getAuthorization(
			"liferay-learn-etc-spring-boot-oauth-application-headless-server");
	}

	private ResponseEntity<String> _processCsv(MultipartFile file)
		throws CsvValidationException, IOException {

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(file.getInputStream()));
			CSVReader csvReader = new CSVReader(reader)) {

			csvReader.readNext();

			JSONArray jsonArray = new JSONArray();

			String[] row;

			while ((row = csvReader.readNext()) != null) {
				String emailAddress = row[2];
				String examInstanceTokenId = row[0];
				String examName = row[6];
				String examStartDate = row[10];
				String firstName = row[3];
				String lastName = row[4];
				String passFail = row[8];
				String scoreStr = row[7];

				if (Objects.equals(
						examName,
						"Building Enterprise Websites with Liferay")) {

					examName =
						"Building Enterprise Websites with Liferay " +
							"Certification Exam (2024)";
				}

				JSONObject jsonObject = new JSONObject(
				).put(
					"externalReferenceCode", examInstanceTokenId
				).put(
					"email", emailAddress
				).put(
					"firstName", firstName
				).put(
					"lastName", lastName
				).put(
					"examName", examName
				).put(
					"testName", examName
				).put(
					"score", GetterUtil.getInteger(scoreStr)
				).put(
					"date", formatToIsoUtc(examStartDate)
				).put(
					"result",
					new JSONObject(
					).put(
						"key", StringUtil.toLowerCase(passFail)
					).put(
						"name", passFail
					)
				);

				jsonArray.put(jsonObject);
			}

			String response = post(
				_getAuthorization(), jsonArray.toString(),
				UriComponentsBuilder.fromPath(
					"/o/c/p2s3examresults/batch?createStrategy=UPSERT"
				).build(
				).toUri());

			return ResponseEntity.ok(response);
		}
	}

	private static final Pattern _dateTimePattern = Pattern.compile(
		"(\\d{4})-(\\d{1,2})-(\\d{1,2})[ ](\\d{1,2}):(\\d{2}):(\\d{2})");

	@Autowired
	private LiferayOAuth2AccessTokenManager _liferayOAuth2AccessTokenManager;

}