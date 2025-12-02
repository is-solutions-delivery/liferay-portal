/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.SkuOption;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.headless.commerce.admin.order.client.pagination.Page;
import com.liferay.marketplace.MarketplaceRestController;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.StringUtil;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;

import java.util.Enumeration;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * @author Keven Leone
 */
public class MarketplaceUtil {

	public static File addMarketplaceMetadata(
			File file, Map<String, Properties> propertiesMap)
		throws IOException {

		Path filePathWithMarketplaceMetadata = Files.createTempFile(
			"modified-", FileUtil.getExtension(file.getName()));

		try (ZipOutputStream zipOutputStream = new ZipOutputStream(
				Files.newOutputStream(filePathWithMarketplaceMetadata));
			ZipFile originalZipFile = new ZipFile(file)) {

			Enumeration<? extends ZipEntry> entriesEnumeration =
				originalZipFile.entries();

			while (entriesEnumeration.hasMoreElements()) {
				ZipEntry zipEntry = entriesEnumeration.nextElement();

				zipOutputStream.putNextEntry(new ZipEntry(zipEntry.getName()));

				if (!zipEntry.isDirectory()) {
					try (InputStream inputStream =
							originalZipFile.getInputStream(zipEntry)) {

						inputStream.transferTo(zipOutputStream);
					}
				}

				zipOutputStream.closeEntry();
			}

			for (Map.Entry<String, Properties> propertiesEntry :
					propertiesMap.entrySet()) {

				String entryName = propertiesEntry.getKey();

				if (entryName.lastIndexOf('/') != -1) {
					String dir = entryName.substring(
						0, entryName.lastIndexOf('/') + 1);

					ZipEntry dirEntry = new ZipEntry(dir);

					zipOutputStream.putNextEntry(dirEntry);

					zipOutputStream.closeEntry();
				}

				ZipEntry zipEntry = new ZipEntry(entryName);

				zipOutputStream.putNextEntry(zipEntry);

				ByteArrayOutputStream byteArrayOutputStream =
					new ByteArrayOutputStream();

				propertiesEntry.getValue(
				).store(
					byteArrayOutputStream, "Added automatically by Marketplace"
				);

				zipOutputStream.write(byteArrayOutputStream.toByteArray());

				zipOutputStream.closeEntry();
			}
		}

		return filePathWithMarketplaceMetadata.toFile();
	}

	public static JSONArray createCloudProvisioningJSONArray(
		Page<OrderItem> orderItemPage) {

		JSONArray jsonArray = new JSONArray();

		for (OrderItem orderItem : orderItemPage.getItems()) {
			jsonArray.put(
				new JSONObject(
				).put(
					"deployments", new JSONArray()
				).put(
					"orderItemId", orderItem.getId()
				).put(
					"quantity",
					orderItem.getQuantity(
					).intValue()
				).put(
					"shippedQuantity", 0
				).put(
					"sku", orderItem.getSku()
				));
		}

		return jsonArray;
	}

	public static Properties createMarketplaceProperties(
		Product product,
		MarketplaceRestController.PublisherAssetLink publisherAssetLink) {

		Properties properties = new Properties();

		properties.setProperty("product-id", String.valueOf(product.getId()));
		properties.setProperty(
			"product-name",
			product.getName(
			).get(
				"en_US"
			));
		properties.setProperty("license-version", "1.0.0");
		properties.setProperty("product-version-id", "1");

		properties.setProperty(
			"publisher-asset-version", publisherAssetLink.version);

		return properties;
	}

	public static Properties createProductProperties(
		Product product,
		MarketplaceRestController.PublisherAssetLink publisherAssetLink) {

		Properties properties = new Properties();

		properties.setProperty(
			"category",
			product.getCategories(
			).toString());
		properties.setProperty(
			"remote-app-id", String.valueOf(product.getId()));
		properties.setProperty("context-names", "");
		properties.setProperty("version", publisherAssetLink.version);
		properties.setProperty("icon-url", "");
		properties.setProperty("required", "");
		properties.setProperty(
			"title",
			product.getName(
			).get(
				"en_US"
			));
		properties.setProperty("bundles", "");
		properties.setProperty(
			"description",
			product.getDescription(
			).get(
				"en_US"
			));
		properties.setProperty("restart-required", "");

		return properties;
	}

	public static String createTemporaryDeployment(
			Map<String, String> customFields, JSONArray jsonArray,
			JSONObject jsonObject, String projectId)
		throws Exception {

		UUID uuid = UUID.randomUUID();

		jsonObject.put(
			"deployments",
			jsonObject.getJSONArray(
				"deployments"
			).put(
				new JSONObject(
				).put(
					"id", uuid.toString()
				).put(
					"loading", true
				).put(
					"projectId", projectId
				)
			));

		customFields.put("cloud-provisioning", jsonArray.toString());

		return uuid.toString();
	}

	public static void deleteDeployment(
		String deploymentId, JSONObject jsonObject) {

		JSONArray deploymentsJSONArray = jsonObject.getJSONArray("deployments");

		for (int i = 0; i < deploymentsJSONArray.length(); i++) {
			JSONObject deploymentJSONObject =
				deploymentsJSONArray.getJSONObject(i);

			if (Objects.equals(
					deploymentJSONObject.getString("id"), deploymentId)) {

				deploymentsJSONArray.remove(i);
			}
		}
	}

	public static JSONObject getCloudProvisioningJSONObject(
		JSONArray jsonArray, long orderItemId) {

		for (int i = 0; i < jsonArray.length(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);

			if (Objects.equals(
					jsonObject.getLong("orderItemId"), orderItemId)) {

				return jsonObject;
			}
		}

		return new JSONObject();
	}

	public static String getSkuOptionValue(String key, SkuOption[] skuOptions) {
		for (SkuOption skuOption : skuOptions) {
			if (!Objects.equals(key, skuOption.getKey())) {
				continue;
			}

			String value = skuOption.getValue();

			String firstChar = value.substring(0, 1);

			return StringUtil.toUpperCase(firstChar) + value.substring(1);
		}

		return null;
	}

	public static String getSkuOptionValue(String key, String options) {
		JSONArray optionsJSONArray = new JSONArray(options);

		for (int i = 0; i < optionsJSONArray.length(); i++) {
			JSONObject jsonObject = optionsJSONArray.getJSONObject(i);

			if (!Objects.equals(key, jsonObject.getString("key"))) {
				continue;
			}

			JSONArray jsonArray = jsonObject.getJSONArray("value");

			return jsonArray.getString(0);
		}

		return null;
	}

}