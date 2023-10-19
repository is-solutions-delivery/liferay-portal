/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;


import com.liferay.osb.provisioning.marketplace.rest.client.dto.v1_0.AppLicenseKey;
import com.liferay.osb.provisioning.marketplace.rest.client.function.UnsafeSupplier;
import com.liferay.osb.provisioning.marketplace.rest.client.pagination.Page;
import com.liferay.osb.provisioning.marketplace.rest.client.pagination.Pagination;
import com.liferay.osb.provisioning.marketplace.rest.client.resource.v1_0.AppLicenseKeyResource;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import com.liferay.portal.kernel.util.Validator;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;


import java.net.URL;

/**
 * @author Keven Leone
 * @author Nilton
 */
@RequestMapping("/provisioning")
@RestController
public class ProvisioningRestController extends BaseRestController {
    public void _initResource() throws Exception {
        String authorization = _getOAuthAuthorization();

        AppLicenseKeyResource.Builder AppLicenseKeyResourceBuilder = AppLicenseKeyResource.builder();

        URL url = new URL(_provisioningAuthURL);

        _appLicenseKeyResource = AppLicenseKeyResourceBuilder.header("Authorization", authorization).endpoint(
            url.getHost(), url.getPort(), url.getProtocol()
        ).build();
    }

    private String _getOAuthAuthorization() throws Exception {
        if (Validator.isNotNull(_oauthAccessToken) &&_oauthExpirationMillis < System.currentTimeMillis() ) {
            return _oauthAccessToken;
        }

        HttpPost httpPost = new HttpPost(new URL(_provisioningAuthURL) + "/o/oauth2/token");

        httpPost.setEntity(
                new UrlEncodedFormEntity(
                        Arrays.asList(
                                new BasicNameValuePair("client_id", _provisioningAuthClientId),
                                new BasicNameValuePair(
                                        "client_secret", _provisioningAuthClientSecret),
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

                _oauthExpirationMillis =
                        jsonObject.getLong("expires_in") + System.currentTimeMillis();

                _oauthAccessToken = jsonObject.getString("token_type") + " " +
                        jsonObject.getString("access_token");

                return _oauthAccessToken;
            }

            throw new Exception("Unable to get OAuth authorization");
        }
    }


    @GetMapping
    public String get() throws Exception {
        return "Provisioning API" + _provisioningAuthURL;
    }

    @GetMapping(value = "license-keys")
    public Page<AppLicenseKey> getLicenseKeys(
            @RequestParam(defaultValue = "1", required = false) String page,
            @RequestParam(defaultValue = "10", required = false) String pageSize
        ) throws Exception {
        _initResource();

        Pagination pagination = Pagination.of(Integer.valueOf(page), Integer.valueOf(pageSize));

        Page<AppLicenseKey> appLicenseKeyPage = _appLicenseKeyResource.getAppLicenseKeysPage("", "", pagination, "");

        return appLicenseKeyPage;
    }

    @PostMapping(value = "license-keys")
    public AppLicenseKey createLicenseKey(
            @RequestBody String json
    ) throws Exception {
        _initResource();

        JSONObject jsonObject = new JSONObject(json);

        AppLicenseKey appLicenseKey = new AppLicenseKey();

        System.out.println("Hostname" + jsonObject.getString("hostname"));

        appLicenseKey.setActive(true);
        appLicenseKey.setHostName("localhost");
        appLicenseKey.setExpirationDate(new Date());
        appLicenseKey.setDescription("License Description");
        appLicenseKey.setIpAddresses("123.45.67.89");
        appLicenseKey.setLicenseType(AppLicenseKey.LicenseType.DEVELOPER);
        appLicenseKey.setMacAddresses("0A-1B-2C-3D-4E-5F-6E");
        appLicenseKey.setOrderId("10");
        appLicenseKey.setOwner("keven");
        appLicenseKey.setProductName("Marketplace Product Name for QA Test");
        appLicenseKey.setProductId("10");
        appLicenseKey.setProductVersion("1");
        appLicenseKey.setStartDate(new Date());

        appLicenseKey = _appLicenseKeyResource.postAppLicenseKey(
                "Keven", "0123", appLicenseKey
        );

        return appLicenseKey;
    }

    @PostMapping(value = "license-keys/activate/{id}")
    public String activateLicenseKey(@PathVariable("id") String id) throws Exception {
        _initResource();

        Long[] licenseKeyIds = new Long[]{Long.valueOf(id)};

        _appLicenseKeyResource.putAppLicenseKeyActivate("Liferay", "User", licenseKeyIds);

        return "ok";
    }

    @GetMapping(value = "license-keys/{id}")
    public AppLicenseKey getLicenseKey(@PathVariable("id") String id) throws Exception {
        _initResource();

        AppLicenseKey appLicenseKey = _appLicenseKeyResource.getAppLicenseKey(Long.valueOf(id));

        return appLicenseKey;
    }

    private AppLicenseKeyResource _appLicenseKeyResource;
    private long _oauthExpirationMillis;
    private String _oauthAccessToken;

    @Value("${com.liferay.lxc.provisioning.auth.client.id}")
    private String _provisioningAuthClientId;

    @Value("${com.liferay.lxc.provisioning.auth.client.secret}")
    private String _provisioningAuthClientSecret;

    @Value("${com.liferay.lxc.provisioning.auth.url}")
    private String _provisioningAuthURL;
}