/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Category;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.SkuOption;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.marketplace.model.PublisherAssetLink;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.ExternalLink;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.StringUtil;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;
import java.util.UUID;
import java.util.jar.Attributes;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import java.util.zip.ZipEntry;
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

			Set<String> existingEntryNames = _cloneZipFile(
				zipFile, zipOutputStream);

			_addPropertiesToZipFile(
				existingEntryNames, propertiesMap, zipOutputStream);
		}

		return path.toFile();
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

	public static File createLPKGFile(
			String fileName, Map<String, File> jarFilesMap,
			Map<String, Properties> propertiesMap)
		throws IOException {

		Path tempDirectoryPath = Files.createTempDirectory("marketplace-temp-");

		Path path = tempDirectoryPath.resolve(fileName);

		try (ZipOutputStream zipOutputStream = new ZipOutputStream(
				Files.newOutputStream(path))) {

			Set<String> existingEntryNames = new HashSet<>();

			for (Map.Entry<String, File> entry : jarFilesMap.entrySet()) {
				String entryName = entry.getKey();

				zipOutputStream.putNextEntry(new ZipEntry(entryName));

				Files.copy(
					entry.getValue(
					).toPath(),
					zipOutputStream);

				zipOutputStream.closeEntry();

				existingEntryNames.add(entryName);
			}

			_addPropertiesToZipFile(
				existingEntryNames, propertiesMap, zipOutputStream);
		}

		return path.toFile();
	}

	public static Properties createMarketplaceProperties(
		Product product, PublisherAssetLink publisherAssetLink) {

		Properties properties = new Properties();

		properties.setProperty("license-version", "1.0.0");
		properties.setProperty(
			"product-id", String.valueOf(product.getProductId()));
		properties.setProperty(
			"product-name", getDefaultLocale(product.getName()));
		properties.setProperty("product-version-id", "1");
		properties.setProperty(
			"publisher-asset-version", publisherAssetLink.getVersion());

		return properties;
	}

	public static Properties createProductProperties(
		Product product, PublisherAssetLink publisherAssetLink) {

		Properties properties = new Properties();

		properties.setProperty("bundles", "");
		properties.setProperty("category", _getCategoryName(product.getCategories()));
		properties.setProperty("context-names", "");
		properties.setProperty(
			"description",
			HtmlUtil.stripHtml(getDefaultLocale(product.getDescription())));
		properties.setProperty("icon-url", product.getThumbnail());
		properties.setProperty(
			"remote-app-id", String.valueOf(product.getId()));
		properties.setProperty("required", "false");
		properties.setProperty("restart-required", "false");
		properties.setProperty("title", getDefaultLocale(product.getName()));
		properties.setProperty("version", publisherAssetLink.getVersion());

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

	public static void deleteTempFile(File file) {
		try {
			if (file != null) {
				Path filePath = file.toPath();

				Files.deleteIfExists(filePath);

				Path parentPath = filePath.getParent();

				if ((parentPath != null) &&
					parentPath.getFileName().toString().startsWith(
						"marketplace-temp-")) {

					Files.deleteIfExists(parentPath);
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

	public static Map<String, Properties> getArtifactPropertiesMap(
		boolean includeProductProperties, Product product,
		Map<String, String> productSpecificationsMap,
		PublisherAssetLink publisherAssetLink) {

		return HashMapBuilder.<String, Properties>put(
			"liferay-marketplace.properties",
			() -> {
				if (includeProductProperties) {
					return createProductProperties(product, publisherAssetLink);
				}

				return null;
			}
		).put(
			"META-INF/marketplace.properties",
			() -> {
				if (Objects.equals(
						productSpecificationsMap.get("price-model"), "Paid")) {

					return createMarketplaceProperties(
						product, publisherAssetLink);
				}

				return null;
			}
		).build();
	}

	public static String getJarType(File file) {
		try (JarFile jarFile = new JarFile(file)) {
			Manifest manifest = jarFile.getManifest();

			if (manifest == null) {
				return "other";
			}

			Attributes attributes = manifest.getMainAttributes();
			
			String bundleSymbolicName = attributes.getValue("Bundle-SymbolicName");

			if (bundleSymbolicName != null) {
				bundleSymbolicName = StringUtil.toLowerCase(bundleSymbolicName);

				if (bundleSymbolicName.contains(".api") || bundleSymbolicName.contains("-api")) {
					return "api";
				}

				if (bundleSymbolicName.contains(".impl") || bundleSymbolicName.contains("-impl")) {
					return "impl";
				}
			}
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(
					"Unable to read manifest for " + file.getName(), exception);
			}
		}

		return "other";
	}

	public static Map<String, Properties> getSubLPKGPropertiesMap(
		Product product, PublisherAssetLink publisherAssetLink) {

		return getArtifactPropertiesMap(
			true, product, Collections.emptyMap(), publisherAssetLink);
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

	public static String getEntityId(
		ExternalLink[] externalLinks, String domain, String entityName) {

		for (ExternalLink externalLink : externalLinks) {
			if (Objects.equals(externalLink.getDomain(), domain) &&
				Objects.equals(externalLink.getEntityName(), entityName)) {

				return externalLink.getEntityId();
			}
		}

		return null;
	}

	public static JSONObject getOrderMetadataJSONObject(Order order) {
		Map<String, String> customFields =
			(Map<String, String>)order.getCustomFields();

		return new JSONObject(
			customFields.getOrDefault("order-metadata", "{}"));
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

	private static void _addPropertiesToZipFile(
			Set<String> existingEntryNames,
			Map<String, Properties> propertiesMap,
			ZipOutputStream zipOutputStream)
		throws IOException {

		for (Map.Entry<String, Properties> entry : propertiesMap.entrySet()) {
			String key = entry.getKey();

			int lastPathIndex = StringUtil.lastIndexOfAny(
				key, new char[] {'/'});

			if (lastPathIndex != -1) {
				String directoryEntryName = key.substring(0, lastPathIndex + 1);

				if (existingEntryNames.add(directoryEntryName)) {
					zipOutputStream.putNextEntry(
						new ZipEntry(directoryEntryName));
					zipOutputStream.closeEntry();
				}
			}

			zipOutputStream.putNextEntry(new ZipEntry(key));

			ByteArrayOutputStream byteArrayOutputStream =
				new ByteArrayOutputStream();

			Properties properties = entry.getValue();

			properties.store(byteArrayOutputStream, null);

			zipOutputStream.write(byteArrayOutputStream.toByteArray());

			zipOutputStream.closeEntry();
		}
	}

	private static Set<String> _cloneZipFile(
			ZipFile zipFile, ZipOutputStream zipOutputStream)
		throws IOException {

		Set<String> entryNames = new HashSet<>();

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

			entryNames.add(zipEntry.getName());
		}

		return entryNames;
	}

	private static String _getCategoryName(Category[] categories) {
		if (ArrayUtil.isEmpty(categories)) {
			return "";
		}

		for (Category category : categories) {
			String vocabulary = category.getVocabulary();

			if (vocabulary != null) {

				if (Objects.equals(vocabulary, "marketplace app category") ||
						Objects.equals(vocabulary, "marketplace category")){
					return category.getName();
				}

			}
		}

		return categories[0].getName();
	}

	private static final Log _log = LogFactory.getLog(MarketplaceUtil.class);

}