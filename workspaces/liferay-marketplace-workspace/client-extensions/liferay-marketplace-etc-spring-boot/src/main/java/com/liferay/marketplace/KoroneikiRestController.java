/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;


import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Product;
import com.liferay.osb.koroneiki.phloem.rest.client.pagination.Page;
import com.liferay.osb.koroneiki.phloem.rest.client.resource.v1_0.ProductResource;
import com.liferay.osb.koroneiki.phloem.rest.client.resource.v1_0.AccountResource;
import com.liferay.osb.koroneiki.phloem.rest.client.resource.v1_0.ProductResource.Builder;
import com.liferay.osb.koroneiki.phloem.rest.client.pagination.Pagination;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import com.liferay.portal.kernel.util.Validator;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
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
@RequestMapping("/koroneiki")
@RestController
public class KoroneikiRestController extends BaseRestController {
    public void _initResource() throws Exception {
        URL url = new URL(_koroneikiAuthURL);

        _productResource = ProductResource.builder().header("API_TOKEN", _koroneikiAuthToken).endpoint(
            url.getHost(), url.getPort(), url.getProtocol()
        ).build();
    }

    @GetMapping(value = "products")
    public String get(
            @RequestParam(defaultValue = "1", required = false) String page,
            @RequestParam(defaultValue = "10", required = false) String pageSize
    ) throws Exception {
        System.out.println("Here");
        _initResource();

        Pagination pagination = Pagination.of(Integer.valueOf(page), Integer.valueOf(pageSize));

        Page<Product> productPage = _productResource.getProductsPage("", "", pagination, "");
        System.out.println("Here1");

        return "Hi";
    }


    private ProductResource _productResource;

    @Value("${com.liferay.lxc.koroneiki.auth.token}")
    private String _koroneikiAuthToken;

    @Value("${com.liferay.lxc.provisioning.auth.url}")
    private String _koroneikiAuthURL;
}