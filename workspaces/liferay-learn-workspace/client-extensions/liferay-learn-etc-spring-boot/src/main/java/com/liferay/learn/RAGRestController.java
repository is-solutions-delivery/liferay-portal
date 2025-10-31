/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.learn;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.learn.service.RAGService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Nilton Vieira
 */
@RequestMapping("/rag")
@RestController
public class RAGRestController extends BaseRestController {

	@PostMapping("/search")
	public ResponseEntity postSearch(@RequestBody String question) {
		try {
			String response = _ragService.search(question);

			return ResponseEntity.ok(
			).body(
				response
			);
		}
		catch (Exception exception) {
			_log.error(exception);

			return ResponseEntity.internalServerError(
			).build();
		}
	}

	@PutMapping("document")
	public ResponseEntity putDocument(@RequestBody String json) {
		JSONObject jsonObject = new JSONObject(json);

		_ragService.addOrUpdateDocument(
			jsonObject.getLong("assetEntryId"),
			jsonObject.getString("assetEntryType"),
			jsonObject.getString("content"));

		return ResponseEntity.noContent(
		).build();
	}

	private static final Log _log = LogFactory.getLog(RAGRestController.class);

	@Autowired
	private RAGService _ragService;

}