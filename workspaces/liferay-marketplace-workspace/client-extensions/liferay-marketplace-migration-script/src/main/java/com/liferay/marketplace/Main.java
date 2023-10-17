/**
 * SPDX-FileCopyrightText: (c) {$year} Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;

import com.liferay.headless.admin.taxonomy.client.dto.v1_0.TaxonomyCategory;
import com.liferay.headless.admin.taxonomy.client.dto.v1_0.TaxonomyVocabulary;
import com.liferay.headless.admin.taxonomy.client.resource.v1_0.TaxonomyCategoryResource;
import com.liferay.headless.admin.taxonomy.client.resource.v1_0.TaxonomyVocabularyResource;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.*;
import com.liferay.headless.commerce.admin.catalog.client.pagination.Page;
import com.liferay.headless.commerce.admin.catalog.client.pagination.Pagination;
import com.liferay.headless.commerce.admin.catalog.client.resource.v1_0.*;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;

import java.io.InputStream;

import java.math.BigDecimal;
import java.net.URL;
import java.net.URLConnection;

import java.nio.charset.Charset;

import java.rmi.server.ExportException;
import java.util.*;
import java.util.logging.Logger;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import org.json.JSONObject;

/**
 * @author José Abelenda
 */
public class Main {

	public static void main(String[] args) throws Exception {
		try {
			Main main = new Main();

			main._process();
		}
		catch (Exception exception) {
			_log.severe(exception.getMessage());
		}
	}

	public Main() {
		try {
			InputStream inputStream = Main.class.getResourceAsStream(
				"/application.properties");

			_properties.load(inputStream);

			String[] loggers = {"com.liferay.headless", "org.apache.http"};

			for (String loggerName : loggers) {
				ch.qos.logback.classic.Logger logger =
					(ch.qos.logback.classic.Logger)
						org.slf4j.LoggerFactory.getLogger(loggerName);

				logger.setAdditive(false);
				logger.setLevel(ch.qos.logback.classic.Level.INFO);
			}
		}
		catch (Exception exception) {
			_log.severe(exception.getMessage());
		}
	}

	private Catalog _getCatalog(long catalogId, long siteGroupId)
		throws Exception {

		CatalogResource.Builder catalogResourceBuilder =
			CatalogResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		CatalogResource catalogResource = catalogResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		return catalogResource.getCatalog(catalogId);
	}

	private Catalog _getCatalogByExternalReferencecode(
			String externalReferenceCode, long siteGroupId)
		throws Exception {

		CatalogResource.Builder catalogResourceBuilder =
			CatalogResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		CatalogResource catalogResource = catalogResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		try {
			return catalogResource.getCatalogByExternalReferenceCode(
				externalReferenceCode);
		}
		catch (Exception exception) {
			return null;
		}
	}

	private Category[] _getCategories(Product product) {
		Category[] categoriesArray = product.getCategories();

		if (Validator.isNull(categoriesArray)) {
			return null;
		}

		List<Category> categoriesList = new ArrayList<>();

		for (Category category : categoriesArray) {
			Long categoryId = _getTaxonomyCategoryId(
				category.getVocabulary(
				).toLowerCase(),
				category.getName(
				).toLowerCase());

			if (categoryId != null) {
				Category category1 = new Category();

				category1.setId(categoryId);

				categoriesList.add(category1);
			}
		}

		categoriesArray = new Category[categoriesList.size()];

		for (int i = 0; i < categoriesList.size(); i++) {
			categoriesArray[i] = categoriesList.get(i);
		}

		return categoriesArray;
	}

	private long _getGlobalSiteGroupId(long siteGroupId) {
		if (siteGroupId == GetterUtil.getLong(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_MARKETPLACE_SITE_GROUP_ID"))) {

			return GetterUtil.getLong(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_GLOBAL_SITE_GROUP_ID"));
		}

		return GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_DESTINATION_GLOBAL_SITE_GROUP_ID"));
	}

	private String _getLiferayURL(long siteGroupId) {
		if (siteGroupId == GetterUtil.getLong(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_MARKETPLACE_SITE_GROUP_ID"))) {

			return _properties.getProperty("LIFERAY_MARKETPLACE_ORIGIN_URL");
		}

		return _properties.getProperty("LIFERAY_MARKETPLACE_DESTINATION_URL");
	}

	private String _getOAuthAuthorization(long siteGroupId) throws Exception {
		if (siteGroupId == GetterUtil.getLong(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_MARKETPLACE_SITE_GROUP_ID"))) {

			return _getOAuthAuthorization(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_OAUTH_CLIENT_ID"),
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_ORIGIN_OAUTH_CLIENT_SECRET"),
				new URL(
					_properties.getProperty("LIFERAY_MARKETPLACE_ORIGIN_URL")));
		}

		return _getOAuthAuthorization(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_DESTINATION_OAUTH_CLIENT_ID"),
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_DESTINATION_OAUTH_CLIENT_SECRET"),
			new URL(
				_properties.getProperty(
					"LIFERAY_MARKETPLACE_DESTINATION_URL")));
	}

	private String _getOAuthAuthorization(
			String liferayOAuthClientId, String liferayOAuthClientSecret,
			URL liferayURL)
		throws Exception {

		HttpPost httpPost = new HttpPost(liferayURL + "/o/oauth2/token");

		httpPost.setEntity(
			new UrlEncodedFormEntity(
				Arrays.asList(
					new BasicNameValuePair("client_id", liferayOAuthClientId),
					new BasicNameValuePair(
						"client_secret", liferayOAuthClientSecret),
					new BasicNameValuePair(
						"grant_type", "client_credentials"))));
		httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");

		HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();

		try (CloseableHttpClient closeableHttpClient =
				httpClientBuilder.build()) {

			CloseableHttpResponse closeableHttpResponse =
				closeableHttpClient.execute(httpPost);

			StatusLine statusLine = closeableHttpResponse.getStatusLine();

			if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
				JSONObject jsonObject = new JSONObject(
					EntityUtils.toString(
						closeableHttpResponse.getEntity(),
						Charset.defaultCharset()));

				return jsonObject.getString("access_token");
			}

			throw new Exception("Unable to get OAuth authorization");
		}
	}

	private Product _getProductByExternalReferenceCode(
			String externalReferenceCode, long siteGroupId)
		throws Exception {

		ProductResource.Builder productResourceBuilder =
			ProductResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		ProductResource productResource = productResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		try {
			return productResource.getProductByExternalReferenceCode(
				externalReferenceCode);
		}
		catch (Exception exception) {
			_log.info("Product not found.");

			return null;
		}
	}

	private Page<Attachment> _getProductIdImagesPage(
			long productId, long siteGroupId)
		throws Exception {

		AttachmentResource.Builder attachmentResourceBuilder =
			AttachmentResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		AttachmentResource attachmentResource =
			attachmentResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return attachmentResource.getProductIdImagesPage(
			productId, Pagination.of(-1, -1));
	}

	private Page<ProductSpecification> _getProductIdProductSpecificationsPage(
			long productId, long siteGroupId)
		throws Exception {

		ProductSpecificationResource.Builder
			productSpecificationResourceBuilder =
				ProductSpecificationResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		ProductSpecificationResource productSpecificationResource =
			productSpecificationResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		try {
			return productSpecificationResource.
				getProductIdProductSpecificationsPage(
					productId, Pagination.of(-1, -1));
		}
		catch (Exception exception) {
			_log.info("Product Specification not found.");

			return null;
		}
	}

	private Page<Product> _getProductsPage(String filter, long siteGroupId)
		throws Exception {

		ProductResource.Builder productResourceBuilder =
			ProductResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		ProductResource productResource = productResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		return productResource.getProductsPage(
			null, filter, Pagination.of(-1, -1), null);
	}

	private ProductSpecification[] _getProductSpecifications(Product product, long originSiteGroupId) throws Exception {
		long bundledCategoryId = GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_ORIGIN_BUNDLED_CATEGORY_ID"));

		Page<ProductSpecification> originProductSpecifications =
				_getProductIdProductSpecificationsPage(
						product.getProductId(), originSiteGroupId);

		ProductSpecification productSpecification = new ProductSpecification();

		for (ProductSpecification originProductSpecification :
				originProductSpecifications.getItems()) {

			JSONObject jsonObject = new JSONObject(originProductSpecification);

			JSONObject valueJSONObject = (JSONObject) jsonObject.get("value");

			String value = (String) valueJSONObject.get("en_US");

			productSpecification.setSpecificationKey("price-model");

			if(value.equals("Free")){
				productSpecification.setValue(
						HashMapBuilder.put(
								"en_US", "Free"
						).build());
			}else if(value.equals("Paid")){
				productSpecification.setValue(
						HashMapBuilder.put(
								"en_US", "Paid"
						).build());
			}else if(value.equals("Bundled")){
				productSpecification.setValue(
						HashMapBuilder.put(
								"en_US", "Bundled"
						).build());
			}
		}

		ProductSpecification[] productSpecifications =
			product.getProductSpecifications();

		for (Category category : product.getCategories()) {
			if (category.getId(
				).longValue() == bundledCategoryId) {

				if (productSpecifications == null) {
					productSpecifications = new ProductSpecification[1];
				}
				else {
					ProductSpecification[] productSpecifications2 =
						new ProductSpecification
							[productSpecifications.length + 1];

					for (int i = 0; i < productSpecifications.length; i++) {
						productSpecifications2[i] = productSpecifications[i];
					}

					productSpecifications = productSpecifications2;
				}

				productSpecifications[productSpecifications.length - 1] =
					productSpecification;
			}
		}

		return productSpecifications;
	}

	private Sku[] _getSkus(Product product, long originSiteGroupId)
		throws Exception {

		Page<ProductSpecification> originProductSpecifications =
			_getProductIdProductSpecificationsPage(
				product.getProductId(), originSiteGroupId);

		if(originProductSpecifications.getTotalCount() == 0){
			return null;
		}

		Sku[] skus = new Sku[] {new Sku()};

		for (ProductSpecification productSpecification :
				originProductSpecifications.getItems()) {

			JSONObject jsonObject = new JSONObject(productSpecification);

			System.out.println("\n\n\n\t\t\tjsonObject: ============> " + jsonObject + "\n\n\n");

			JSONObject valueJSONObject = (JSONObject) jsonObject.get("value");

			String value = (String) valueJSONObject.get("en_US");

			if (productSpecification.getSpecificationKey().equals("price-model") && value != null) {

				skus[0].setSku("default");
				skus[0].setPurchasable(false);
				skus[0].setNeverExpire(true);

				if(value.equals("Free")) {
					skus[0].setPurchasable(true);
				}

			}
		}
		System.out.println("\n\n\n\t\t\tskus: ============> " + skus + "\n\n\n");
		return skus;
	};

	private com.liferay.headless.admin.taxonomy.client.pagination.Page
		<TaxonomyCategory> _getTaxonomyCategoriesPage(
				String filter, long siteGroupId, long taxonomyVocabularyId)
			throws Exception {

		TaxonomyCategoryResource.Builder taxonomyCategoryResourceBuilder =
			TaxonomyCategoryResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		TaxonomyCategoryResource taxonomyCategoryResource =
			taxonomyCategoryResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return taxonomyCategoryResource.
			getTaxonomyVocabularyTaxonomyCategoriesPage(
				taxonomyVocabularyId, true, null, null, filter,
				com.liferay.headless.admin.taxonomy.client.pagination.
					Pagination.of(-1, -1),
				null);
	}

	private Long _getTaxonomyCategoryId(
		String taxonomyVocabularyName, String taxonomyCategoryName) {

		Map<String, TaxonomyCategory> taxonomyCategoriesMap =
			_taxonomyVocabularyTaxonomyCategoriesMap.get(
				taxonomyVocabularyName);

		if (taxonomyCategoriesMap != null) {
			TaxonomyCategory taxonomyCategory = taxonomyCategoriesMap.get(
				taxonomyCategoryName);

			if (taxonomyCategory != null) {
				return GetterUtil.getLong(taxonomyCategory.getId());
			}
		}

		return null;
	}

	private com.liferay.headless.admin.taxonomy.client.pagination.Page
		<TaxonomyVocabulary> _getTaxonomyVocabulariesPage(
				String filter, long siteGroupId)
			throws Exception {

		TaxonomyVocabularyResource.Builder taxonomyVocabularyResourceBuilder =
			TaxonomyVocabularyResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		TaxonomyVocabularyResource taxonomyVocabularyResource =
			taxonomyVocabularyResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return taxonomyVocabularyResource.getSiteTaxonomyVocabulariesPage(
			_getGlobalSiteGroupId(siteGroupId), null, null, filter,
			com.liferay.headless.admin.taxonomy.client.pagination.Pagination.of(
				-1, -1),
			null);
	}

	private com.liferay.headless.admin.taxonomy.client.pagination.Page
		<TaxonomyCategory> _getTaxonomyVocabularyTaxonomyCategoriesPage(
				long siteGroupId, long taxonomyVocabularyCategory)
			throws Exception {

		TaxonomyCategoryResource.Builder taxonomyCategoryResourceBuilder =
			TaxonomyCategoryResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		TaxonomyCategoryResource taxonomyCategoryResource =
			taxonomyCategoryResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return taxonomyCategoryResource.
			getTaxonomyVocabularyTaxonomyCategoriesPage(
				taxonomyVocabularyCategory, true, null, null, null, null, null);
	}

	private void _loadTaxonomy(long siteGroupId) throws Exception {
		_taxonomyVocabularyTaxonomyCategoriesMap = new HashMap<>();

		com.liferay.headless.admin.taxonomy.client.pagination.Page
			<TaxonomyVocabulary> taxonomyVocabulariesPage =
				_getTaxonomyVocabulariesPage(
					null, _getGlobalSiteGroupId(siteGroupId));

		for (TaxonomyVocabulary taxonomyVocabulary :
				taxonomyVocabulariesPage.getItems()) {

			com.liferay.headless.admin.taxonomy.client.pagination.Page
				<TaxonomyCategory> taxonomyCategoriesPage =
					_getTaxonomyCategoriesPage(
						null, _getGlobalSiteGroupId(siteGroupId),
						taxonomyVocabulary.getId());

			Map<String, TaxonomyCategory> taxonomyCategoriesMap =
				new HashMap<>();

			for (TaxonomyCategory taxonomyCategory :
					taxonomyCategoriesPage.getItems()) {

				taxonomyCategoriesMap.put(
					taxonomyCategory.getName(
					).toLowerCase(),
					taxonomyCategory);
			}

			_taxonomyVocabularyTaxonomyCategoriesMap.put(
				taxonomyVocabulary.getName(
				).toLowerCase(),
				taxonomyCategoriesMap);
		}
	}

	private Catalog _postCatalog(Catalog catalog, long siteGroupId)
		throws Exception {

		CatalogResource.Builder catalogResourceBuilder =
			CatalogResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		CatalogResource catalogResource = catalogResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		return catalogResource.postCatalog(catalog);
	}

	private Product _postProduct(Product product, long siteGroupId)
		throws Exception {

		ProductResource.Builder productResourceBuilder =
			ProductResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		ProductResource productResource = productResourceBuilder.bearerToken(
			_getOAuthAuthorization(siteGroupId)
		).header(
			"User-Agent", "Application"
		).endpoint(
			url.getHost(), url.getPort(), url.getProtocol()
		).build();

		return productResource.postProduct(product);
	}

	private Attachment _postProductIdAttachmentByBase64(
			AttachmentBase64 attachmentBase64, long productId, long siteGroupId)
		throws Exception {

		AttachmentResource.Builder attachmentResourceBuilder =
			AttachmentResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		AttachmentResource attachmentResource =
			attachmentResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return attachmentResource.postProductIdAttachmentByBase64(
			productId, attachmentBase64);
	}

	private Attachment _postProductIdImageByBase64(
			AttachmentBase64 attachmentBase64, long productId, long siteGroupId)
		throws Exception {

		AttachmentResource.Builder attachmentResourceBuilder =
			AttachmentResource.builder();

		URL url = new URL(_getLiferayURL(siteGroupId));

		AttachmentResource attachmentResource =
			attachmentResourceBuilder.bearerToken(
				_getOAuthAuthorization(siteGroupId)
			).header(
				"User-Agent", "Application"
			).endpoint(
				url.getHost(), url.getPort(), url.getProtocol()
			).build();

		return attachmentResource.postProductIdImageByBase64(
			productId, attachmentBase64);
	}

	private void _process() throws Exception {
		long originSiteGroupId = GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_ORIGIN_MARKETPLACE_SITE_GROUP_ID"));
		long destinationSiteGroupId = GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_DESTINATION_MARKETPLACE_SITE_GROUP_ID"));

		long bundledCategoryId = GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_ORIGIN_BUNDLED_CATEGORY_ID"));

		long solutionCategoryId = GetterUtil.getLong(
			_properties.getProperty(
				"LIFERAY_MARKETPLACE_ORIGIN_SOLUTION_CATEGORY_ID"));

		long freeCategoryId = GetterUtil.getLong(
				_properties.getProperty(
						"LIFERAY_MARKETPLACE_ORIGIN_FREE_CATEGORY_ID"));

		_loadTaxonomy(destinationSiteGroupId);

		String filter = String.format(
			"(categoryIds/any(x:" + "(x eq '%d') or (x eq '%d') or (x eq '%d')))",
			bundledCategoryId, solutionCategoryId, freeCategoryId);

		Page<Product> productsPage = _getProductsPage(
			filter, originSiteGroupId);

		System.out.println(
			"\n\n\n\t\t\tCount: " + productsPage.getTotalCount());

		for (Product product : productsPage.getItems()) {
			System.out.println(
				"\t\t\tId: " + product.getId() + "  |  Name: " +
					product.getName() + "  | CatalogId: " +
						product.getCatalogId());

			String productExternalReferenceCode =
				product.getExternalReferenceCode();

			if (Validator.isNull(productExternalReferenceCode)) {
				productExternalReferenceCode = String.valueOf(product.getId());
			}

			Catalog catalog1 = _getCatalog(
				product.getCatalogId(), originSiteGroupId);

			String catalogExternalReferenceCode =
				catalog1.getExternalReferenceCode();

			if (Validator.isNull(catalogExternalReferenceCode)) {
				catalogExternalReferenceCode = String.valueOf(catalog1.getId());
			}

			Catalog catalog2 = _getCatalogByExternalReferencecode(
				catalogExternalReferenceCode, destinationSiteGroupId);

			if (catalog2 == null) {
				catalog2 = new Catalog();

				catalog2.setCurrencyCode(catalog1.getCurrencyCode());
				catalog2.setDefaultLanguageId(catalog1.getDefaultLanguageId());
				catalog2.setExternalReferenceCode(catalogExternalReferenceCode);
				catalog2.setName(catalog1.getName());
				catalog2.setSystem(catalog1.getSystem());

				catalog2 = _postCatalog(catalog2, destinationSiteGroupId);
			}

			Product product2 = new Product();

			product2.setActive(product.getActive());
			product2.setCatalogId(catalog2.getId());
			product2.setCategories(_getCategories(product));
			product2.setDescription(product.getDescription());
			product2.setExpando(product.getExpando());
			product2.setExternalReferenceCode(productExternalReferenceCode);
			product2.setMetaDescription(product.getMetaDescription());
			product2.setMetaKeyword(product.getMetaKeyword());
			product2.setMetaTitle(product.getMetaTitle());
			product2.setName(product.getName());
			product2.setProductSpecifications(
				_getProductSpecifications(product, originSiteGroupId));
			product2.setProductType(product.getProductType());
			product2.setShortDescription(product.getShortDescription());
			product2.setSkus(_getSkus(product, originSiteGroupId));

			product2 = _postProduct(product2, destinationSiteGroupId);

			_log.info(
				"Product ID: " + product2.getId() + " " + product2.getName() +
					" saved.");

			_log.info("Saving attachments.");

			Page<Attachment> attachmentPage = _getProductIdImagesPage(
				product.getProductId(), originSiteGroupId);

			for (Attachment attachment : attachmentPage.getItems()) {
				System.out.println("Src: " + attachment.getSrc());

				AttachmentBase64 attachmentBase64 = new AttachmentBase64();

				String attachmentExternalReferenceCode =
					attachment.getExternalReferenceCode();

				if (Validator.isNull(attachmentExternalReferenceCode)) {
					attachmentExternalReferenceCode = String.valueOf(
						attachment.getId());
				}

				attachmentBase64.setContentType(attachment.getContentType());
				attachmentBase64.setCustomFields(attachment.getCustomFields());
				attachmentBase64.setDisplayDate(attachment.getDisplayDate());
				attachmentBase64.setExpirationDate(
					attachment.getExpirationDate());
				attachmentBase64.setExternalReferenceCode(
					attachmentExternalReferenceCode);
				attachmentBase64.setNeverExpire(attachment.getNeverExpire());
				attachmentBase64.setOptions(attachment.getOptions());
				attachmentBase64.setPriority(attachment.getPriority());
				attachmentBase64.setTitle(attachment.getTitle());
				attachmentBase64.setType(1);

				String src = attachment.getSrc();

				if (Validator.isNotNull(src)) {
					src = StringUtil.replace(src, "/accounts/-", "/accounts/");

					URL url = new URL(src);

					URLConnection urlConnection = url.openConnection();

					urlConnection.setRequestProperty(
						"User-Agent", "Application");

					byte[] bytes = IOUtils.toByteArray(
						urlConnection.getInputStream());

					String encodedBase64 = Base64.getEncoder(
					).encodeToString(
						bytes
					);

					attachmentBase64.setAttachment(encodedBase64);

					_postProductIdImageByBase64(
						attachmentBase64, product2.getProductId(),
						destinationSiteGroupId);
				}
			}
		}
	}

	private static final Logger _log = Logger.getLogger(Main.class.getName());

	private final Properties _properties = new Properties();
	private Map<String, Map<String, TaxonomyCategory>>
		_taxonomyVocabularyTaxonomyCategoriesMap;

}