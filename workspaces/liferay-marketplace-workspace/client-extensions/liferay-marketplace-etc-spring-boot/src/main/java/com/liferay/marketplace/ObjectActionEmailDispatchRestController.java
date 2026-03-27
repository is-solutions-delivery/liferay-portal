/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.marketplace.util.MarketplaceUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.net.URL;

import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Keven Leone
 */
@RequestMapping("/object/action/email/dispatch")
@RestController
public class ObjectActionEmailDispatchRestController
	extends BaseRestController {

	@PostMapping
	public void post(@RequestBody String json) throws Exception {
		if (_log.isInfoEnabled()) {
			_log.info("POST email dispatch " + json);
		}

		JSONObject jsonObject = new JSONObject(json);

		if (jsonObject.has("objectEntryDTOProductFeedback")) {
			_postProductFeedback(
				jsonObject.getJSONObject("objectEntryDTOProductFeedback"));

			return;
		}

		if (!jsonObject.has("modelDTOProduct")) {
			return;
		}

		String objectActionTriggerKey = jsonObject.getString(
			"objectActionTriggerKey");

		if (!Objects.equals(objectActionTriggerKey, "onAfterAdd")) {
			return;
		}

		JSONObject modelCPDefinitionJSONObject = jsonObject.getJSONObject(
			"modelCPDefinition");

		Product product = _marketplaceService.getProduct(
			modelCPDefinitionJSONObject.getLong("CProductId"));

		_marketplaceService.postNotificationQueueEntry(
			null, "MARKETPLACE-PRODUCT-SUBMIT-TEMPLATE",
			new HashMapBuilder<String, Object>().put(
				"[%CATALOG_NAME%]",
				() -> {
					Catalog catalog = product.getCatalog();

					return catalog.getName();
				}
			).put(
				"[%CREATE_DATE%]",
				MarketplaceUtil.format(product.getCreateDate())
			).put(
				"[%DASHBOARD_URL%]",
				new URL(
					StringBundler.concat(
						lxcDXPServerProtocol, "://", lxcDXPMainDomain,
						"/web/marketplace/administrator-dashboard#/apps/",
						product.getProductId())
				).toString()
			).put(
				"[%PRODUCT_NAME%]",
				product.getName(
				).get(
					modelCPDefinitionJSONObject.getString("defaultLanguageId")
				)
			).put(
				"[%PRODUCT_THUMBNAIL%]",
				new URL(
					"http://" + lxcDXPMainDomain + product.getThumbnail()
				).toString()
			).build());
	}

	private void _postProductFeedback(JSONObject jsonObject) throws Exception {
		JSONObject productFeedbackJSONObject = jsonObject.getJSONObject(
			"properties");

		Order order = _marketplaceService.getOrder(
			productFeedbackJSONObject.getLong(
				"r_orderToProductFeedback_commerceOrderId"));

		String orderTypeExternalReferenceCode =
			order.getOrderTypeExternalReferenceCode();

		if (_log.isInfoEnabled()) {
			_log.info(
				"Processing order type: " + orderTypeExternalReferenceCode);
		}

		String notificationEmailAddress = null;

		if (Objects.equals(orderTypeExternalReferenceCode, "CMP_BETA")) {
			notificationEmailAddress = _CMP_BETA_NOTIFICATION_EMAIL_ADDRESSES;
		}
		else if (Objects.equals(orderTypeExternalReferenceCode, "AI_HUB")) {
			notificationEmailAddress = _AI_HUB_NOTIFICATION_EMAIL_ADDRESSES;
		}

		if (notificationEmailAddress == null) {
			if (_log.isInfoEnabled()) {
				_log.info(
					"No product feedback template configured for order type: " +
						orderTypeExternalReferenceCode);
			}

			return;
		}

		if (_log.isInfoEnabled()) {
			_log.info("Sending notification to: " + notificationEmailAddress);
		}

		long productId = 0;

		if (productFeedbackJSONObject.has(
				"r_productEntryToProductFeedback_CProductId")) {

			productId = productFeedbackJSONObject.getLong(
				"r_productEntryToProductFeedback_CProductId");
		}
		else {
			productId = productFeedbackJSONObject.getLong(
				"r_productEntryToProductFeedback_CPDefinitionId");
		}

		Product product = _marketplaceService.getProduct(productId);

		_marketplaceService.postNotificationQueueEntry(
			notificationEmailAddress,
			"MARKETPLACE-PRODUCT-FEEDBACK-SUBMIT-TEMPLATE",
			new HashMapBuilder<String, Object>().put(
				"[%PRODUCTFEEDBACK_COMPANYNAME%]",
				productFeedbackJSONObject.optString("companyName")
			).put(
				"[%PRODUCTFEEDBACK_FULLNAME%]",
				productFeedbackJSONObject.optString("fullName")
			).put(
				"[%PRODUCTFEEDBACK_JOBTITLE%]",
				productFeedbackJSONObject.optString("jobTitle")
			).put(
				"[%PRODUCTFEEDBACK_EMAILADDRESS%]",
				productFeedbackJSONObject.optString("emailAddress")
			).put(
				"[%PRODUCT_NAME%]",
				product.getName(
				).get(
					"en_US"
				)
			).put(
				"[%PRODUCTFEEDBACK_RATINGEASEOFUSE%]",
				productFeedbackJSONObject.optString("ratingEaseOfUse")
			).put(
				"[%PRODUCTFEEDBACK_RATINGSATISFACTION%]",
				productFeedbackJSONObject.optString("ratingSatisfaction")
			).put(
				"[%PRODUCTFEEDBACK_RATINGUSEFULNESS%]",
				productFeedbackJSONObject.optString("ratingUsefulness")
			).put(
				"[%PRODUCTFEEDBACK_SUGGESTIONFEATURES%]",
				productFeedbackJSONObject.optString("suggestionFeatures")
			).put(
				"[%PRODUCTFEEDBACK_SUGGESTIONIMPROVEMENTS%]",
				productFeedbackJSONObject.optString("suggestionImprovements")
			).put(
				"[%PRODUCTFEEDBACK_SUGGESTIONSATISFACTION%]",
				productFeedbackJSONObject.optString("suggestionSatisfaction")
			).build());
	}

	private static final String _AI_HUB_NOTIFICATION_EMAIL_ADDRESSES =
		"paulina.diaz@liferay.com, pablo.agulla@liferay.com";

	private static final String _CMP_BETA_NOTIFICATION_EMAIL_ADDRESSES =
		"paulina.diaz@liferay.com, luiz.jardim@liferay.com, " +
			"ana.buchmann@liferay.com";

	private static final Log _log = LogFactory.getLog(
		ObjectActionEmailDispatchRestController.class);

	@Autowired
	private MarketplaceService _marketplaceService;

}