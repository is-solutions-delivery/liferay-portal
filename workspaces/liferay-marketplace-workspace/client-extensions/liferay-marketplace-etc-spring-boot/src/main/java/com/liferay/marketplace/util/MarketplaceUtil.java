/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Category;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.SkuOption;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.marketplace.model.PublisherAssetLink;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.ExternalLink;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.LinkedHashMapBuilder;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Date;
import java.util.Enumeration;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * @author Keven Leone
 * @author Eduardo Diniz
 */
public class MarketplaceUtil {

	public static File addArtifactMetadata(
			File file, String fileName, Map<String, Properties> propertiesMap)
		throws IOException {

		Path tempDirectoryPath = Files.createTempDirectory("marketplace-temp-");

		Path path = tempDirectoryPath.resolve(fileName);

		try (ZipOutputStream zipOutputStream = new ZipOutputStream(
				Files.newOutputStream(path));
			ZipFile zipFile = new ZipFile(file)) {

			_cloneZipFile(zipFile, zipOutputStream);

			addPropertiesToZipFile(propertiesMap, zipOutputStream);
		}

		return path.toFile();
	}

	public static void addPropertiesToZipFile(
			Map<String, Properties> propertiesMap,
			ZipOutputStream zipOutputStream)
		throws IOException {

		for (Map.Entry<String, Properties> entry : propertiesMap.entrySet()) {
			Properties properties = entry.getValue();

			if (properties == null) {
				continue;
			}

			String key = entry.getKey();

			int lastPathIndex = StringUtil.lastIndexOfAny(
				key, new char[] {'/'});

			if (lastPathIndex != -1) {
				try {
					zipOutputStream.putNextEntry(
						new ZipEntry(key.substring(0, lastPathIndex + 1)));

					zipOutputStream.closeEntry();
				}
				catch (ZipException zipException) {
					if (_log.isDebugEnabled()) {
						_log.debug(zipException);
					}
				}
			}

			zipOutputStream.putNextEntry(new ZipEntry(key));

			ByteArrayOutputStream byteArrayOutputStream =
				new ByteArrayOutputStream();

			properties.store(byteArrayOutputStream, null);

			zipOutputStream.write(byteArrayOutputStream.toByteArray());

			zipOutputStream.closeEntry();
		}
	}

	public static ExternalLink[] appendExternalLink(
		ExternalLink[] externalLinks, String domain, String entityId,
		String entityName) {

		if (ArrayUtil.isEmpty(externalLinks)) {
			externalLinks = new ExternalLink[0];
		}

		for (ExternalLink externalLink : externalLinks) {
			if (Objects.equals(externalLink.getDomain(), domain) &&
				Objects.equals(externalLink.getEntityName(), entityName)) {

				if (_log.isInfoEnabled()) {
					_log.info("External link already exists for " + domain);
				}

				return externalLinks;
			}
		}

		ExternalLink externalLink = new ExternalLink();

		externalLink.setDomain(domain);
		externalLink.setEntityId(entityId);
		externalLink.setEntityName(entityName);

		return ArrayUtil.append(externalLinks, externalLink);
	}

	public static JSONArray createCloudProvisioningJSONArray(
		OrderItem[] orderItems) {

		JSONArray jsonArray = new JSONArray();

		for (OrderItem orderItem : orderItems) {
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

	public static byte[] createMarketplaceProperties(
			Map<String, Properties> propertiesMap, Map<String, Path> jars)
		throws IOException {

		ByteArrayOutputStream byteArrayOutputStream =
			new ByteArrayOutputStream();

		try (ZipOutputStream zipOutputStream = new ZipOutputStream(
				byteArrayOutputStream)) {

			addPropertiesToZipFile(propertiesMap, zipOutputStream);

			// Binary Jars

			if (jars != null) {
				for (Map.Entry<String, Path> entry : jars.entrySet()) {
					zipOutputStream.putNextEntry(new ZipEntry(entry.getKey()));

					Files.copy(entry.getValue(), zipOutputStream);

					zipOutputStream.closeEntry();
				}
			}
		}

		return byteArrayOutputStream.toByteArray();
	}

	public static Map<String, Properties> createMarketplaceProperties(
		Product product, Map<String, String> productSpecificationsMap,
		PublisherAssetLink publisherAssetLink, String bundleSymbolicName,
		String bundleVersion, String bundles, String title) {

		// liferay-marketplace.properties

		Properties productProperties = new Properties();

		String category = null;

		if (productSpecificationsMap != null) {
			category = getCategoryName(
				productSpecificationsMap.get("category"));
		}

		if (Validator.isNull(category) && (product != null)) {
			category = getCategoryName(product.getCategories());
		}

		productProperties.setProperty(
			"category", GetterUtil.getString(category));

		if (product != null) {
			productProperties.setProperty(
				"description", getDefaultLocale(product.getDescription()));
		}

		String iconURL = null;

		if (productSpecificationsMap != null) {
			iconURL = productSpecificationsMap.get("icon-url");
		}

		if (Validator.isNull(iconURL) && (product != null)) {
			iconURL = product.getThumbnail();
		}

		productProperties.setProperty(
			"icon-url", GetterUtil.getString(iconURL));

		if (Validator.isNotNull(bundleSymbolicName)) {
			productProperties.setProperty(
				"liferay-marketplace-bundle-symbolic-name", bundleSymbolicName);
		}

		if (Validator.isNotNull(bundleVersion)) {
			productProperties.setProperty(
				"liferay-marketplace-bundle-version", bundleVersion);
		}

		String remoteAppId = null;

		if (productSpecificationsMap != null) {
			remoteAppId = productSpecificationsMap.get("remote-app-id");
		}

		if (Validator.isNull(remoteAppId) && (product != null)) {
			remoteAppId = String.valueOf(product.getId());
		}

		productProperties.setProperty(
			"remote-app-id", GetterUtil.getString(remoteAppId));

		productProperties.setProperty("required", "false");
		productProperties.setProperty("restart-required", "false");

		if (Validator.isNull(title) && (product != null)) {
			title = getDefaultLocale(product.getName());
		}

		productProperties.setProperty("title", GetterUtil.getString(title));

		String version = bundleVersion;

		if (Validator.isNull(version) && (publisherAssetLink != null)) {
			version = publisherAssetLink.getVersion();
		}

		productProperties.setProperty("version", GetterUtil.getString(version));

		if (Validator.isNotNull(bundles)) {
			productProperties.setProperty("bundles", bundles);
		}

		return LinkedHashMapBuilder.<String, Properties>put(
			"liferay-marketplace.properties", productProperties
		).build();
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

	public static void deleteTempFile(
		File file, boolean deleteParentDirectory) {

		try {
			if (file != null) {
				Files.deleteIfExists(file.toPath());

				if (deleteParentDirectory) {
					Files.deleteIfExists(
						file.toPath(
						).getParent());
				}
			}
		}
		catch (Exception exception) {
			_log.error(exception);
		}
	}

	public static String format(Date date) {
		return format(date, "Not Applicable");
	}

	public static String format(Date date, String defaultValue) {
		if (date == null) {
			return defaultValue;
		}

		return date.toInstant(
		).atZone(
			ZoneId.of("UTC")
		).format(
			DateTimeFormatter.ofPattern("MMMM d, yyyy")
		);
	}

	public static String getCategoryName(Category[] categories) {
		if (ArrayUtil.isEmpty(categories)) {
			return "";
		}

		for (Category category : categories) {
			if (_isMarketplaceCategory(category.getVocabulary())) {
				return category.getName();
			}
		}

		return categories[0].getName();
	}

	public static String getCategoryName(String categoryJSON) {
		if (Validator.isNull(categoryJSON)) {
			return categoryJSON;
		}

		try {
			JSONArray jsonArray = new JSONArray(categoryJSON);

			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				if (_isMarketplaceCategory(
						jsonObject.getString("vocabulary"))) {

					return jsonObject.getString("name");
				}
			}

			JSONObject jsonObject = jsonArray.getJSONObject(0);

			return jsonObject.getString("name");
		}
		catch (Exception exception) {
			_log.error(exception);

			return categoryJSON;
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

	public static String getDefaultLocale(Map<String, String> localeMap) {
		return localeMap.get("en_US");
	}

	public static Date getOrderPurchaseEndDate(
		String licenseType, String licenseUsageType) {

		ZonedDateTime zonedDateTime = ZonedDateTime.now();

		if (StringUtil.equalsIgnoreCase(licenseType, "3 Months Limited Beta")) {
			return Date.from(
				zonedDateTime.plusMonths(
					3
				).toInstant());
		}

		if (StringUtil.equalsIgnoreCase(licenseUsageType, "Trial")) {
			return Date.from(
				zonedDateTime.plusMonths(
					1
				).toInstant());
		}

		return Date.from(
			zonedDateTime.plusYears(
				1
			).toInstant());
	}

	public static String getSkuOptionValue(String key, SkuOption[] skuOptions) {
		for (SkuOption skuOption : skuOptions) {
			String skuOptionKey = skuOption.getKey();

			if ((skuOptionKey == null) || !skuOptionKey.endsWith(key)) {
				continue;
			}

			return skuOption.getValue();
		}

		return null;
	}

	public static String getSkuOptionValue(String key, String options) {
		JSONArray optionsJSONArray = new JSONArray(options);

		for (int i = 0; i < optionsJSONArray.length(); i++) {
			JSONObject jsonObject = optionsJSONArray.getJSONObject(i);

			String skuOptionKey = jsonObject.optString("key");

			if (!skuOptionKey.endsWith(key)) {
				continue;
			}

			JSONArray jsonArray = jsonObject.getJSONArray("value");

			return jsonArray.getString(0);
		}

		return null;
	}

	private static void _cloneZipFile(
			ZipFile zipFile, ZipOutputStream zipOutputStream)
		throws IOException {

		Enumeration<? extends ZipEntry> enumeration = zipFile.entries();

		while (enumeration.hasMoreElements()) {
			ZipEntry zipEntry = enumeration.nextElement();

			zipOutputStream.putNextEntry(new ZipEntry(zipEntry.getName()));

			if (!zipEntry.isDirectory()) {
				try (InputStream inputStream = zipFile.getInputStream(
						zipEntry)) {

					inputStream.transferTo(zipOutputStream);
				}
			}

			zipOutputStream.closeEntry();
		}
	}

	private static boolean _isMarketplaceCategory(String vocabulary) {
		if (Objects.equals(vocabulary, "marketplace app category") ||
			Objects.equals(vocabulary, "marketplace category")) {

			return true;
		}

		return false;
	}

	private static final Log _log = LogFactory.getLog(MarketplaceUtil.class);

}