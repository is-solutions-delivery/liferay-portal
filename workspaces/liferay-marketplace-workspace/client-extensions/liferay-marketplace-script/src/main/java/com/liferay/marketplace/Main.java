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

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Category;
import com.liferay.headless.commerce.admin.catalog.client.pagination.Page;
import org.springframework.web.reactive.function.BodyInserters;
import com.liferay.headless.commerce.admin.catalog.client.serdes.v1_0.ProductSerDes;
import com.liferay.headless.commerce.admin.catalog.client.serdes.v1_0.CatalogSerDes;
import java.io.InputStream;

import java.net.URL;

import java.nio.charset.Charset;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.HashMap;
import java.util.Properties;

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
import org.springframework.http.MediaType;
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
				appProps.getProperty("LIFERAY_MARKETPLACE_SOURCE_OAUTH_CLIENT_ID"),
				appProps.getProperty("LIFERAY_MARKETPLACE_SOURCE_OAUTH_CLIENT_SECRET"),
				new URL(
						appProps.getProperty("LIFERAY_MARKETPLACE_SOURCE_LIFERAY_URL")),
				appProps.getProperty("LIFERAY_MARKETPLACE_TARGET_OAUTH_CLIENT_ID"),
				appProps.getProperty("LIFERAY_MARKETPLACE_TARGET_OAUTH_CLIENT_SECRET"),
				new URL(
						appProps.getProperty("LIFERAY_MARKETPLACE_TARGET_LIFERAY_URL"))
			);
		}
		catch (Exception exception) {
			_log.error("Error: " + exception.getMessage());
		}
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
			String liferayMarketplaceSourceOAuthClientId, String liferayMarketplaceSourceOAuthClientSecret,
			URL liferaySourceURL, String liferayMarketplaceTargetOAuthClientId,
			String liferayMarketplaceTargetOAuthClientSecret, URL liferayTargetURL)
		throws Exception {

		_liferaySourceOAuthClientId = liferayMarketplaceSourceOAuthClientId;
		_liferaySourceOAuthClientSecret = liferayMarketplaceSourceOAuthClientSecret;

		_liferaySourceURL = liferaySourceURL;

		if (_log.isInfoEnabled()) {
			_log.info("Liferay URL: " + _liferaySourceURL);
		}

		_liferayTargetOAuthClientId = liferayMarketplaceTargetOAuthClientId;
		_liferayTargetOAuthClientSecret = liferayMarketplaceTargetOAuthClientSecret;

		_liferayTargetURL = liferayTargetURL;

		if (_log.isInfoEnabled()) {
			_log.info("Liferay URL: " + liferayTargetURL);
		}

		String products = WebClient.create(
		).get(
		).uri(
			_liferaySourceURL + "/o/headless-commerce-admin-catalog/v1.0/products"
		).accept(
			MediaType.APPLICATION_JSON
		).header(
			"Authorization", "Bearer " + _getOAuthAuthorization(
					_liferaySourceOAuthClientId, _liferaySourceOAuthClientSecret,
					_liferaySourceURL)
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		if (products == null) {
			throw new RuntimeException("No response");
		}

		Page<Product> productPage = Page.of(products, ProductSerDes::toDTO);

		_productsPage = productPage;
		String catalogTargetResponse = WebClient.create(
		).get(
		).uri(
				_liferayTargetURL + "/o/headless-commerce-admin-catalog/v1.0/catalog/by-externalReferenceCode/" +
						"MKT-CATALOG-1"
		).accept(
				MediaType.APPLICATION_JSON
		).header(
				"Authorization", "Bearer " + _getOAuthAuthorization(
						_liferayTargetOAuthClientId, _liferayTargetOAuthClientSecret,
						_liferayTargetURL)
		).retrieve(
		).bodyToMono(
				String.class
		).block();
		Product[] productsArray = new Product[(int) _productsPage.getTotalCount()];
		Catalog catalog = Catalog.toDTO(catalogTargetResponse);
		int i = 0;
		for (Product product : _productsPage.getItems()) {
			product.setCatalogId(catalog.getId());
			productsArray[i] = product;
			i++;
		}

		Product[] productTest = new Product[1];
		productTest[0] = productsArray[12];

		String siteResponse = WebClient.create(
		).get(
		).uri(
				_liferayTargetURL + "/o/headless-admin-user/v1.0/sites/by-friendly-url-path/global"
		).accept(
				MediaType.APPLICATION_JSON
		).header(
				"Authorization", "Bearer " + _getOAuthAuthorization(
						_liferayTargetOAuthClientId, _liferayTargetOAuthClientSecret,
						_liferayTargetURL)
		).retrieve(
		).bodyToMono(
				String.class
		).block();
		JSONObject pageJSONObject = new JSONObject(siteResponse);
		Long siteId = Long.valueOf(pageJSONObject.get("id"));
		Map<Long, Long> categoriesMap = new HashMap<>();
		Category[] categories = productTest[0].getCategories();
		categoriesMap.put(449736583l, 43152l);// marketplace product type - Solution
		categoriesMap.put(449603965l, 43156l);// marketplace solution category - Analytics and Optimization
		categoriesMap.put(449603986l, 43174l);// marketplace solution category - Extensibility and Integration
		categoriesMap.put(449854755l, 43305l);// marketplace solution tags - IOT
		categoriesMap.put(449875575l, 43251l);// marketplace solution tags - Datalake
		for (Category category : productTest[0].getCategories()) {
			if(categoriesMap.containsKey(category.getId())){
				category.setExternalReferenceCode("MKT-catalog-" + i);
				category.setId(categoriesMap.get(category.getId()));
			}
			i++;
		}
		String test = WebClient.create(
		).post(
		).uri(
				_liferayTargetURL + "/o/headless-commerce-admin-catalog/v1.0/products"
		).accept(
				MediaType.APPLICATION_JSON
		).contentType(
				MediaType.APPLICATION_JSON
		).header(
				"Authorization", "Bearer " + _getOAuthAuthorization(
						_liferayTargetOAuthClientId, _liferayTargetOAuthClientSecret,
						_liferayTargetURL)
		).body(
				BodyInserters.fromValue(productTest[0])
		).retrieve(
		).bodyToMono(
				String.class
		).block();
//		String batchResponse = WebClient.create(
//		).post(
//		).uri(
//				_liferayTargetURL + "/o/headless-commerce-admin-catalog/v1.0/products/batch"
//		).accept(
//				MediaType.APPLICATION_JSON
//		).contentType(
//				MediaType.APPLICATION_JSON
//		).header(
//				"Authorization", "Bearer " + _getOAuthAuthorization(
//						_liferayTargetOAuthClientId, _liferayTargetOAuthClientSecret,
//						_liferayTargetURL)
//		).body(
//				BodyInserters.fromValue(productsArray)
//		).retrieve(
//		).bodyToMono(
//				String.class
//		).block();
	}

	private static final Log _log = LogFactory.getLog(Main.class);

	private static String _liferaySourceOAuthClientId;
	private static String _liferaySourceOAuthClientSecret;
	private static URL _liferaySourceURL;
	private static String _liferayTargetOAuthClientId;
	private static String _liferayTargetOAuthClientSecret;
	private static URL _liferayTargetURL;
	private static Page<Product> _productsPage;
}