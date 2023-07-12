/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.marketplace;

import com.liferay.headless.admin.taxonomy.client.dto.v1_0.TaxonomyCategory;
import com.liferay.headless.admin.taxonomy.client.dto.v1_0.TaxonomyVocabulary;
import com.liferay.headless.admin.taxonomy.client.serdes.v1_0.TaxonomyCategorySerDes;
import com.liferay.headless.admin.taxonomy.client.serdes.v1_0.TaxonomyVocabularySerDes;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Category;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.CustomField;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.pagination.Page;
import com.liferay.headless.commerce.admin.catalog.client.serdes.v1_0.ProductSerDes;

import java.io.InputStream;

import java.net.URL;

import java.nio.charset.Charset;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.stream.Collectors;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * @author Thiago Oliveira
 */
public class Main {

	public static void main(String[] args) throws Exception {
		try {
			InputStream inputStream = Main.class.getResourceAsStream(
				"/application.properties");
			Properties appProps = new Properties();

			appProps.load(inputStream);

			_process(
				appProps.getProperty(
					"LIFERAY_MARKETPLACE_TARGET_OAUTH_CLIENT_ID"),
				appProps.getProperty(
					"LIFERAY_MARKETPLACE_TARGET_OAUTH_CLIENT_SECRET"),
				new URL(
					appProps.getProperty(
						"LIFERAY_MARKETPLACE_TARGET_LIFERAY_URL")),
				Long.valueOf(
					appProps.getProperty(
						"LIFERAY_MARKETPLACE_TARGET_SITE_GROUP_ID")));
		}
		catch (Exception exception) {
			_log.error("Error: " + exception.getMessage());
		}
	}

	@Bean
	public static WebClient webClient() {
		int size = 100000000;
		ExchangeStrategies strategies = ExchangeStrategies.builder(
		).codecs(
			codecs -> codecs.defaultCodecs(
			).maxInMemorySize(
				size
			)
		).build();

		return WebClient.builder(
		).exchangeStrategies(
			strategies
		).build();
	}

	private static String _getOAuthAuthorization(
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

	private static void _process(
			String liferayMarketplaceTargetOAuthClientId,
			String liferayMarketplaceTargetOAuthClientSecret,
			URL liferayTargetURL, long liferayMarketplaceTargetSiteGroupId)
		throws Exception {

		_liferaySourceURL = new URL("https://www-uat.liferay.com");

		if (_log.isInfoEnabled()) {
			_log.info("Liferay URL: " + _liferaySourceURL);
		}

		_liferayTargetOAuthClientId = liferayMarketplaceTargetOAuthClientId;
		_liferayTargetOAuthClientSecret =
			liferayMarketplaceTargetOAuthClientSecret;

		_liferayTargetURL = liferayTargetURL;

		_liferayMarketplaceTargetSiteGroupId =
			liferayMarketplaceTargetSiteGroupId;

		if (_log.isInfoEnabled()) {
			_log.info("Liferay URL: " + liferayTargetURL);
		}

		List<Product> productList = fetchProductsFromSource();

		List<TaxonomyVocabulary> vocabularySourceList =
			fetchVocabulariesFromSource();

		_vocabularyTargetList = fetchVocabulariesFromTarget();

		Map<String, String> taxonomyVocabularyMap = new HashMap();

		String targetCatalog = getTargetCatalog();

		Catalog catalog = Catalog.toDTO(targetCatalog);

		List<TaxonomyCategory> taxonomyCategoryList =
			fetchCategoriesFromTarget();

		Map<Long, String> pricingMap = new HashMap<>();

		for (Product product : productList) {
			product.setCatalogId(catalog.getId());

			//			for(CustomField cf : product.getCustomFields()){
			//				if(cf.getName().equals("Profile") && cf.getCustomValue().getData() != null){
			//					Map<String, String> localizedText = new HashMap<>();

			//					localizedText.put("en_US", String.valueOf(cf.getCustomValue().getData()));
			//					cf.getCustomValue().setData_i18n(localizedText);
			//				}
			//			}

			List<Category> newCategories = new ArrayList<>();

			for (Category sourceCategory : product.getCategories()) {
				Optional<TaxonomyCategory> taxonomyCategory =
					taxonomyCategoryList.stream(
					).filter(
						cat -> isSameCategory(cat, sourceCategory)
					).findFirst();

				if (taxonomyCategory.isPresent()) {
					sourceCategory.setExternalReferenceCode(
						taxonomyCategory.get(
						).getExternalReferenceCode());
					sourceCategory.setId(
						Long.valueOf(
							taxonomyCategory.get(
							).getId()));

					newCategories.add(sourceCategory);
				}
				else {
					if (sourceCategory.getVocabulary(
						).equals(
							MARKETPLACE_PRICE_VOCABULARY
						)) {

						pricingMap.put(
							product.getId(), sourceCategory.getName());
						newCategories.removeIf(
							cat -> cat.getVocabulary(
							).equals(
								MARKETPLACE_PRICE_VOCABULARY
							));
					}
					else {
						TaxonomyVocabulary taxonomyVocabulary =
							getTaxonomyVocabularyByName(
								sourceCategory.getVocabulary());

						if (taxonomyVocabulary != null) {
							addCategory(
								sourceCategory, taxonomyVocabulary.getId());

							newCategories.add(sourceCategory);
						}
					}
				}
			}

			Category[] categoriesArray = new Category[newCategories.size()];

			int index = 0;

			for (Category newCat : newCategories) {
				categoriesArray[index] = newCat;
				index++;
			}

			product.setCategories(categoriesArray);
		}

		insertProductBatchAtTarget(productList);

		//		for(Map.Entry<Long, String> set : pricingMap.entrySet()){
		//
		//			Optional<Product> foundProduct = productList.stream().filter(product -> product.getId() == set.getKey()).findFirst();
		//
		//			if(foundProduct.isPresent()){
		//				linkSpecificationToProduct(foundProduct.get().getId(), "price-model", set.getValue());
		//			}
		//
		//		}

		//		for(Product product : productList){
		//			handleCustomFieldsMapping(product);
		//		}

	}

	private static void addCategory(Category category, Long id)
		throws Exception {

		JSONObject taxonomyCategoryJson = new JSONObject(category);

		TaxonomyCategory taxonomyCategory = TaxonomyCategorySerDes.toDTO(
			taxonomyCategoryJson.toString());

		String response = WebClient.create(
		).post(
		).uri(
			_liferayTargetURL +
				String.format(
					"/o/headless-admin-taxonomy/v1.0/taxonomy-vocabularies" +
						"/%d/taxonomy-categories/",
					id)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).contentType(
			MediaType.APPLICATION_JSON
		).body(
			BodyInserters.fromObject(taxonomyCategory)
		).exchange(
		).block(
		).bodyToMono(
			String.class
		).block();

		System.out.println(response);
	}

	private static TaxonomyVocabulary createTaxonomyVocabulary(String name)
		throws Exception {

		JSONObject taxonomyCategory = new JSONObject(
			String.format("{name: %s}", name));

		String response = WebClient.create(
		).post(
		).uri(
			_liferayTargetURL +
				String.format(
					"/o/headless-admin-taxonomy/v1.0/sites/%d/taxonomy-vocabularies",
					20121)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).contentType(
			MediaType.APPLICATION_JSON
		).body(
			BodyInserters.fromObject(name)
		).exchange(
		).block(
		).bodyToMono(
			String.class
		).block();

		return TaxonomyVocabularySerDes.toDTO(response);
	}

	private static List<TaxonomyCategory> fetchCategoriesFromTarget()
		throws Exception {

		String categories = WebClient.create(
		).get(
		).uri(
			_liferayTargetURL +
				"/o/headless-admin-taxonomy/v1.0/taxonomy-categories/ranked?pageSize=-1"
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		Page<TaxonomyCategory> taxonomyCategoryPage = Page.of(
			categories, TaxonomyCategorySerDes::toDTO);

		return taxonomyCategoryPage.getItems(
		).stream(
		).collect(
			Collectors.toList()
		);
	}

	private static List<Product> fetchProductsFromSource() throws Exception {
		String products = webClient(
		).get(
		).uri(
			_liferaySourceURL +
				String.format(
					"/o/headless-commerce-admin-catalog/v1.0/products?filter=categoryIds/any(x:(x eq '%d'))&pageSize=-1",
					449736583)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferaySourceOAuthClientId,
					_liferaySourceOAuthClientSecret, _liferaySourceURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		Page<Product> productPage = Page.of(products, ProductSerDes::toDTO);

		return productPage.getItems(
		).stream(
		).collect(
			Collectors.toList()
		);
	}

	private static List<TaxonomyVocabulary> fetchVocabulariesFromSource()
		throws Exception {

		String vocabularies = WebClient.create(
		).get(
		).uri(
			_liferaySourceURL +
				String.format(
					"/o/headless-admin-taxonomy/v1.0/sites/%d/taxonomy-vocabularies",
					10195)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferaySourceOAuthClientId,
					_liferaySourceOAuthClientSecret, _liferaySourceURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		Page<TaxonomyVocabulary> taxonomyVocabularyPage = Page.of(
			vocabularies, TaxonomyVocabularySerDes::toDTO);

		return taxonomyVocabularyPage.getItems(
		).stream(
		).collect(
			Collectors.toList()
		);
	}

	private static List<TaxonomyVocabulary> fetchVocabulariesFromTarget()
		throws Exception {

		String vocabularies = WebClient.create(
		).get(
		).uri(
			_liferayTargetURL +
				String.format(
					"/o/headless-admin-taxonomy/v1.0/sites/%d/taxonomy-vocabularies",
					_liferayMarketplaceTargetSiteGroupId)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		Page<TaxonomyVocabulary> taxonomyVocabularyPage = Page.of(
			vocabularies, TaxonomyVocabularySerDes::toDTO);

		return taxonomyVocabularyPage.getItems(
		).stream(
		).collect(
			Collectors.toList()
		);
	}

	private static String getTargetCatalog() throws Exception {
		return WebClient.create(
		).get(
		).uri(
			_liferayTargetURL +
				"/o/headless-commerce-admin-catalog/v1.0/catalog/by-externalReferenceCode/MKT-CATALOG-1"
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();
	}

	private static TaxonomyVocabulary getTaxonomyVocabularyByName(String name)
		throws Exception {

		Optional<TaxonomyVocabulary> vocabulary = _vocabularyTargetList.stream(
		).filter(
			voc -> voc.getName(
			).toLowerCase(
			).equals(
				name
			)
		).findFirst();

		if (vocabulary.isPresent())

			return vocabulary.get();
		//		else {
		//			return createTaxonomyVocabulary(name);
		//		}

		return null;
	}

	private static void handleCustomFieldsMapping(Product product)
		throws Exception {

		for (CustomField customField : product.getCustomFields()) {
			if (CUSTOM_FIELD_TO_SPECIFICATION.containsKey(
					customField.getName())) {

				linkSpecificationToProduct(
					product.getId(),
					CUSTOM_FIELD_TO_SPECIFICATION.get(customField.getName()),
					String.valueOf(
						customField.getCustomValue(
						).getData()));
			}
		}
	}

	private static void insertProductBatchAtTarget(List<Product> products)
		throws Exception {

		String response = WebClient.create(
		).post(
		).uri(
			_liferayTargetURL +
				"/o/headless-commerce-admin-catalog/v1.0/products/batch"
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).contentType(
			MediaType.APPLICATION_JSON
		).body(
			BodyInserters.fromObject(products)
		).exchange(
		).block(
		).bodyToMono(
			String.class
		).block();

		System.out.println(response);
	}

	private static boolean isSameCategory(
		TaxonomyCategory taxonomyCategory, Category sourceTaxonomyCategory) {

		if (taxonomyCategory.getName(
			).equals(
				sourceTaxonomyCategory.getName()
			) &&
			taxonomyCategory.getParentTaxonomyVocabulary(
			).getName(
			).toLowerCase(
			).equals(
				sourceTaxonomyCategory.getVocabulary()
			)) {

			return true;
		}

		return false;
	}

	private static void linkSpecificationToProduct(
			Long productId, String specificationKey, String specificationValue)
		throws Exception {

		JSONObject jsonObject = new JSONObject(
			String.format(
				"{specificationKey: %1$s, value: '{en_US=%2$s}'}",
				specificationKey, specificationValue));

		String response = WebClient.create(
		).post(
		).uri(
			_liferayTargetURL +
				String.format(
					"/o/headless-commerce-admin-catalog/v1.0/products/%d/productSpecifications",
					productId)
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).contentType(
			MediaType.APPLICATION_JSON
		).body(
			BodyInserters.fromObject(jsonObject)
		).exchange(
		).block(
		).bodyToMono(
			String.class
		).block();

		System.out.println(response);
	}

	private void addProduct(Product product) throws Exception {
		String response = WebClient.create(
		).post(
		).uri(
			_liferayTargetURL +
				"/o/headless-commerce-admin-catalog/v1.0/products"
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization",
			"Bearer " +
				_getOAuthAuthorization(
					_liferayTargetOAuthClientId,
					_liferayTargetOAuthClientSecret, _liferayTargetURL)
		).contentType(
			MediaType.APPLICATION_JSON
		).body(
			BodyInserters.fromObject(product)
		).exchange(
		).block(
		).bodyToMono(
			String.class
		).block();

		System.out.println(response);
	}

	private JSONObject handleTaxonomyVocabularyFields(
		JSONObject taxonomyVocabularyJson) {

		taxonomyVocabularyJson.remove("actions");

		return taxonomyVocabularyJson;
	}

	private static final Map<String, String> CUSTOM_FIELD_TO_SPECIFICATION =
		new HashMap<String, String>() {
			{
				put("Developer Name", "developer-name");
				put("Source Code URL", "source-code-url");
		};

		};

	private static final String MARKETPLACE_PRICE_VOCABULARY =
		"marketplace price";

	private static final Log _log = LogFactory.getLog(Main.class);

	private static long _liferayMarketplaceTargetSiteGroupId;
	private static final String _liferaySourceOAuthClientId =
		"id-b47b6f30-a3c4-674f-28a9-5135948a6c20";
	private static final String _liferaySourceOAuthClientSecret =
		"secret-8f3e54f4-65af-1ad3-2a6f-1c3b565e6bfc";
	private static URL _liferaySourceURL;
	private static String _liferayTargetOAuthClientId;
	private static String _liferayTargetOAuthClientSecret;
	private static URL _liferayTargetURL;
	private static Page<Product> _productsPage;
	private static List<TaxonomyVocabulary> _vocabularyTargetList;

	@Autowired
	private WebClient webClient;

}