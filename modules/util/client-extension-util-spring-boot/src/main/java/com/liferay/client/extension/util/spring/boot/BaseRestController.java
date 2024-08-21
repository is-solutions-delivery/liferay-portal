/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.client.extension.util.spring.boot;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

import org.apache.commons.logging.Log;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.Disposable;
import reactor.core.publisher.Mono;

/**
 * @author Nilton Vieira
 */
public abstract class BaseRestController {

	protected Disposable asyncDelete(
		String authorization, String body, String path) {

		return _getWebClient(
		).method(
			HttpMethod.DELETE
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).subscribe();
	}

	protected Disposable asyncGet(String authorization, String path) {
		return _getWebClient(
		).get(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).subscribe();
	}

	protected Disposable asyncPatch(
		String authorization, String body, String path) {

		return _getWebClient(
		).patch(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).subscribe();
	}

	protected Disposable asyncPost(
		String authorization, String body, String path) {

		return _getWebClient(
		).post(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).subscribe();
	}

	protected Disposable asyncPut(
		String authorization, String body, String path) {

		return _getWebClient(
		).put(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).subscribe();
	}

	protected String delete(String authorization, String body, String path) {
		return _getWebClient(
		).method(
			HttpMethod.DELETE
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).block();
	}

	protected JSONObject deleteAsJSONObject(
		String authorization, String body, String path) {

		return new JSONObject(delete(authorization, body, path));
	}

	protected String get(String authorization, String path) {
		return _getWebClient(
		).get(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).block();
	}

	protected MediaType getAcceptMediaType() {
		return _acceptMediaType;
	}

	protected JSONObject getAsJSONObject(String authorization, String path) {
		return new JSONObject(get(authorization, path));
	}

	protected MediaType getContentTypeMediaType() {
		return _contentTypeMediaType;
	}

	protected String getLXCDXPURL() {
		return lxcDXPServerProtocol + "://" + lxcDXPMainDomain;
	}

	protected void log(Jwt jwt, Log log) {
		if (log.isInfoEnabled()) {
			log.info("JWT Claims: " + jwt.getClaims());
			log.info("JWT ID: " + jwt.getId());
			log.info("JWT Subject: " + jwt.getSubject());
		}
	}

	protected void log(Jwt jwt, Log log, Map<String, String> parameters) {
		if (log.isInfoEnabled()) {
			log.info("JWT Claims: " + jwt.getClaims());
			log.info("JWT ID: " + jwt.getId());
			log.info("JWT Subject: " + jwt.getSubject());
			log.info("Parameters: " + parameters);
		}
	}

	protected void log(Jwt jwt, Log log, String json) {
		if (log.isInfoEnabled()) {
			try {
				JSONObject jsonObject = new JSONObject(json);

				log.info("JSON: " + jsonObject.toString(4));
			}
			catch (Exception exception) {
				log.error("JSON: " + json, exception);
			}

			log.info("JWT Claims: " + jwt.getClaims());
			log.info("JWT ID: " + jwt.getId());
			log.info("JWT Subject: " + jwt.getSubject());
		}
	}

	protected String patch(String authorization, String body, String path) {
		return _getWebClient(
		).patch(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).block();
	}

	protected JSONObject patchAsJSONObject(
		String authorization, String body, String path) {

		return new JSONObject(patch(authorization, body, path));
	}

	protected String post(String authorization, String body, String path) {
		return _getWebClient(
		).post(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).block();
	}

	protected JSONObject postAsJSONObject(
		String authorization, String body, String path) {

		return new JSONObject(post(authorization, body, path));
	}

	protected String put(String authorization, String body, String path) {
		return _getWebClient(
		).put(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			_acceptMediaType
		).contentType(
			_contentTypeMediaType
		).header(
			HttpHeaders.AUTHORIZATION, authorization
		).headers(
			httpHeaders -> httpHeaders.putAll(_customHttpHeaders)
		).bodyValue(
			body
		).exchangeToMono(
			_getExchangeToMonoFunction()
		).block();
	}

	protected void putAdditionalHttpHeader(String key, String... values) {
		_customHttpHeaders.put(key, Arrays.asList(values));
	}

	protected JSONObject putAsJSONObject(
		String authorization, String body, String path) {

		return new JSONObject(put(authorization, body, path));
	}

	protected void setAcceptMediaType(MediaType acceptMediaType) {
		_acceptMediaType = acceptMediaType;
	}

	protected void setContentTypeMediaType(MediaType contentTypeMediaType) {
		_contentTypeMediaType = contentTypeMediaType;
	}

	@Value("${com.liferay.lxc.dxp.mainDomain}")
	protected String lxcDXPMainDomain;

	@Value("${com.liferay.lxc.dxp.server.protocol}")
	protected String lxcDXPServerProtocol;

	private Function<ClientResponse, Mono<String>>
		_getExchangeToMonoFunction() {

		return clientResponse -> {
			HttpStatus httpStatus = clientResponse.statusCode();

			if (Objects.equals(
					clientResponse.statusCode(), HttpStatus.NO_CONTENT)) {

				if (Objects.equals(
						_acceptMediaType, MediaType.APPLICATION_JSON_VALUE)) {

					return Mono.just("{}");
				}

				return Mono.just("");
			}
			else if (httpStatus.is2xxSuccessful()) {
				return clientResponse.bodyToMono(String.class);
			}
			else if (httpStatus.is4xxClientError()) {
				return Mono.just(httpStatus.getReasonPhrase());
			}

			Mono<WebClientResponseException> mono =
				clientResponse.createException();

			return mono.flatMap(Mono::error);
		};
	}

	private WebClient _getWebClient() {
		return WebClient.builder(
		).baseUrl(
			getLXCDXPURL()
		).exchangeStrategies(
			ExchangeStrategies.builder(
			).codecs(
				clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs(
				).maxInMemorySize(
					16 * 1024 * 1024
				)
			).build()
		).build();
	}

	private MediaType _acceptMediaType = MediaType.APPLICATION_JSON;
	private MediaType _contentTypeMediaType = MediaType.APPLICATION_JSON;
	private final Map<String, List<String>> _customHttpHeaders =
		new HashMap<>();

}