/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.paypal;

import com.liferay.petra.string.StringBundler;

import java.util.Objects;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Brian I. Kim
 */
@RequestMapping("/capture")
@RestController
public class CaptureRestController extends BaseRestController {

	@PostMapping
	public ResponseEntity<String> post(
		@AuthenticationPrincipal Jwt jwt, @RequestBody String json) {

		log(jwt, _log, json);

		String errorMessages = null;
		String paymentStatus = "4";
		String transactionCode = null;

		try {
			JSONObject jsonObject = new JSONObject(json);

			JSONObject commercePaymentEntryJSONObject =
				jsonObject.getJSONObject("commercePaymentEntry");

			JSONObject typeSettingsJSONObject = jsonObject.getJSONObject(
				"typeSettings");

			putAdditionalHttpHeader(
				"PayPal-Partner-Attribution-Id", "Liferay_SP_PPCP_API");
			putAdditionalHttpHeader(
				"PayPal-Request-Id",
				commercePaymentEntryJSONObject.getString(
					"commercePaymentEntryId"));
			putAdditionalHttpHeader("Prefer", "return=representation");

			JSONObject captureResponseJSONObject = new JSONObject(
				post(
					"Bearer " + getAuthorization(typeSettingsJSONObject), null,
					StringBundler.concat(
						getPayPalURL(typeSettingsJSONObject.getString("mode")),
						"v2/checkout/orders/",
						commercePaymentEntryJSONObject.getString(
							"transactionCode"),
						"/capture")));

			if (Objects.equals(
					captureResponseJSONObject.getString("status"),
					"COMPLETED")) {

				paymentStatus = "0";

				JSONObject purchaseUnitsJSONObject =
					captureResponseJSONObject.getJSONArray(
						"purchase_units"
					).getJSONObject(
						0
					);

				JSONObject paymentsJSONObject =
					purchaseUnitsJSONObject.getJSONObject("payments");

				JSONArray capturesJSONArray = paymentsJSONObject.getJSONArray(
					"captures");

				JSONObject capturesJSONObject = capturesJSONArray.getJSONObject(
					0);

				transactionCode = capturesJSONObject.getString("id");

				post(
					"Bearer " + jwt.getTokenValue(),
					new JSONObject(
					).put(
						"externalReferenceCode", transactionCode
					).put(
						"clientId", typeSettingsJSONObject.getString("clientId")
					).put(
						"clientSecret",
						typeSettingsJSONObject.getString("clientSecret")
					).put(
						"mode", typeSettingsJSONObject.getString("mode")
					).put(
						"paymentEntryId",
						commercePaymentEntryJSONObject.getLong(
							"commercePaymentEntryId")
					).put(
						"webhookId",
						typeSettingsJSONObject.getString("webhookId")
					).toString(),
					StringBundler.concat(
						lxcDXPServerProtocol, "://", lxcDXPMainDomain,
						"/o/c/b9k3paypalwebhooks"));
			}
		}
		catch (Exception exception) {
			errorMessages = ExceptionUtils.getMessage(exception);

			_log.error(errorMessages);
		}

		return new ResponseEntity<>(
			new JSONObject(
			).put(
				"errorMessages", errorMessages
			).put(
				"paymentStatus", paymentStatus
			).put(
				"transactionCode", transactionCode
			).toString(),
			HttpStatus.OK);
	}

	@Override
	protected String getLXCDXPURL() {
		return "";
	}

	private static final Log _log = LogFactory.getLog(
		CaptureRestController.class);

}