/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.service;

import com.liferay.client.extension.util.spring.boot3.service.BaseService;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Product;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.ProductPurchase;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Caleb Hall
 */
public class ProvisioningHubService extends BaseService {

	public void provision(Order order, ProductPurchase productPurchase)
		throws Exception {

		Product product = productPurchase.getProduct();

		if (Objects.equals(product.getName(), "Liferay Data Platform")) {

			// TODO

		}
	}

	@Autowired
	private AnalyticsService _analyticsService;

}