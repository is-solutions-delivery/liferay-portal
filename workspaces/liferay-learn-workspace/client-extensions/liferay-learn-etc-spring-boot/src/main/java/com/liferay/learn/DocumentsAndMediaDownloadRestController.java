/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.petra.string.StringBundler;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * @author Nilton Vieira
 */
@RequestMapping("/documents-and-media/download")
@RestController
public class DocumentsAndMediaDownloadRestController
	extends BaseRestController {

	@GetMapping
	@ResponseBody
	public ResponseEntity<StreamingResponseBody> get(
			@AuthenticationPrincipal Jwt jwt)
		throws Exception {

		return ResponseEntity.ok(
		).header(
			"Content-Disposition",
			"attachment; filename=\"documents_and_media.csv\""
		).body(
			new StreamingResponseBody() {

				@Override
				public void writeTo(OutputStream outputStream)
					throws IOException {

					_write(jwt, outputStream);
				}

			}
		);
	}

	private void _write(Jwt jwt, OutputStream outputStream) throws IOException {
		try (CSVPrinter csvPrinter = new CSVPrinter(
				new BufferedWriter(new OutputStreamWriter(outputStream)),
				CSVFormat.DEFAULT.builder(
				).setHeader(
					"Content Url", "Document Title", "Document ID",
					"Creator Name", "Creator ID", "Date Created",
					"Date Modified", "Document Description", "Document Type",
					"Document Folder ID", "File Name", "File Extension",
					"Encoding Format", "External Reference Code",
					"Number Of Comments", "Category Names", "Category Ids",
					"Side Id", "Size In Bytes"
				).build())) {

			int lastPage = 1;

			for (int i = 1; i <= lastPage; i++) {
				JSONObject jsonObject1 = new JSONObject(
					get(
						null,
						StringBundler.concat(
							"/o/headless-delivery/v1.0/sites/", _siteGroupId,
							"/documents?flatten=true&pageSize=500&page=", i)));

				JSONArray jsonArray = jsonObject1.getJSONArray("items");

				for (int j = 0; j < jsonArray.length(); j++) {
					JSONObject jsonObject2 = jsonArray.getJSONObject(j);
					String categoryNames = "";
					String categoryIds = "";

					if (!jsonObject2.isNull("taxonomyCategoryBriefs")) {
						JSONArray categoryjsonArray = jsonObject2.getJSONArray(
							"taxonomyCategoryBriefs");

						for (int k = 0; k < categoryjsonArray.length(); k++) {
							JSONObject categoryjsonObject =
								categoryjsonArray.getJSONObject(k);

							categoryNames += categoryjsonObject.get(
								"taxonomyCategoryName"
							).toString();
							categoryIds += String.valueOf(
								categoryjsonObject.getInt(
									"taxonomyCategoryId"));

							if (k < (categoryjsonArray.length() - 1)) {
								categoryNames = categoryNames + ", ";
								categoryIds = categoryIds + ", ";
							}
						}
					}

					String creatorName = "";
					String creatorId = "";

					if (!jsonObject2.isNull("creator")) {
						creatorName = jsonObject2.getJSONObject(
							"creator"
						).getString(
							"name"
						);
						creatorId = String.valueOf(
							jsonObject2.getJSONObject(
								"creator"
							).getInt(
								"id"
							));
					}

					String documentType = "";

					if (!jsonObject2.isNull("documentType")) {
						documentType = jsonObject2.getJSONObject(
							"documentType"
						).getString(
							"name"
						);
					}

					csvPrinter.printRecord(
						jsonObject2.getString("contentUrl"),
						jsonObject2.getString("title"),
						jsonObject2.getInt("id"), creatorName, creatorId,
						jsonObject2.getString("dateCreated"),
						jsonObject2.getString("dateModified"),
						jsonObject2.getString("description"), documentType,
						jsonObject2.getInt("documentFolderId"),
						jsonObject2.getString("fileName"),
						jsonObject2.getString("fileExtension"),
						jsonObject2.getString("encodingFormat"),
						jsonObject2.getString("externalReferenceCode"),
						jsonObject2.getInt("numberOfComments"), categoryIds,
						categoryNames, jsonObject2.getInt("siteId"),
						jsonObject2.getInt("sizeInBytes"));
				}

				lastPage = jsonObject1.getInt("lastPage");
			}

			csvPrinter.flush();
		}
		catch (Exception exception) {
			throw new IOException(exception);
		}
	}

	@Value("${liferay.learn.dxp.site.group.id}")
	private long _siteGroupId;

}