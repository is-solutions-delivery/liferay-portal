package com.liferay.marketplace.model;

import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.BillingAddress;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.marketplace.constants.MarketplaceConstants;
import com.liferay.marketplace.util.MarketplaceUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.net.URL;

import java.util.Map;
import java.util.Objects;

import org.json.JSONObject;

public class ProductPurchaseNotificationTemplate {

	public ProductPurchaseNotificationTemplate(
		String liferayHost, Order order, Product product,
		Map<String, String> productSpecificationsMap) {

        _liferayHost = liferayHost;
		_order = order;
		_product = product;
		_productSpecificationsMap = productSpecificationsMap;
	}

	public Map<String, String> getInvoiceOrderSubmitTemplate() throws Exception {
		OrderItem[] orderItems = _order.getOrderItems();

		OrderItem orderItem = orderItems[0];

		com.liferay.headless.commerce.admin.order.client.dto.v1_0.Account
			account = _order.getAccount();

		BillingAddress billingAddress = _order.getBillingAddress();

		Catalog catalog = _product.getCatalog();

		return new HashMapBuilder<>().put(
			"[%ACCOUNT_ID%]", String.valueOf(account.getId())
		).put(
			"[%ACCOUNT_NAME%]", account.getName()
		).put(
			"[%APP_NAME%]",
			_product.getName(
			).get(
				"en_US"
			)
		).put(
			"[%APP_TYPE%]",
			_productSpecificationsMap.get(
				"type"
			).replace(
				"-", " "
			)
		).put(
			"[%BILLING_ADDRESS_FORMATTED%]",
			String.join(
				", ", billingAddress.getStreet1(), billingAddress.getCity(),
				billingAddress.getRegionISOCode(),
				billingAddress.getCountryISOCode())
		).put(
			"[%BILLING_ADDRESS_NAME%]", billingAddress.getName()
		).put(
			"[%BILLING_ADDRESS_PHONE%]", billingAddress.getPhoneNumber()
		).put(
			"[%CATALOG_NAME%]", catalog.getName()
		).put(
			"[%EMAIL_ADDRESS%]", _order.getCreatorEmailAddress()
		).put(
			"[%EXCHANGE_RATE%]", _getExchangeRate()
		).put(
			"[%LICENSE_TYPE%]", _productSpecificationsMap.get("license-type")
		).put(
			"[%NET_PRICE_FORMATTED%]", _order.getSubtotalFormatted()
		).put(
			"[%ORDER_DATE%]", MarketplaceUtil.format(_order.getCreateDate())
		).put(
			"[%ORDER_ID%]", String.valueOf(_order.getId())
		).put(
			"[%ORDER_PAYMENT_METHOD%]",
			MarketplaceConstants.getOrderPaymentMethodLabel(
				_order.getPaymentMethod())
		).put(
			"[%ORDER_STATUS%]",
			MarketplaceConstants.getOrderStatusLabel(_order.getOrderStatus())
		).put(
			"[%PAYMENT_TERMS%]", _order.getPaymentTermDescription()
		).put(
			"[%PRODUCT_THUMBNAIL%]",
			new URL(
                    _liferayHost +
					_product.getThumbnail()
			).toString(
			).replaceAll(
				"(?<=accounts/)-?\\d+(?=/images)", "-1"
			)
		).put(
			"[%SUBSCRIPTION_EXPIRATION_DATE%]",
			MarketplaceUtil.format(
				MarketplaceUtil.getOrderPurchaseEndDate(
					_productSpecificationsMap.get("license-type"),
					MarketplaceUtil.getSkuOptionValue(
						"license-usage-type", orderItem.getOptions())))
		).put(
			"[%SUBSCRIPTION_STARTING_DATE%]",
			MarketplaceUtil.format(_order.getCreateDate())
		).put(
			"[%SUBSCRIPTION_TYPE%]",
			_productSpecificationsMap.get("license-type")
		).put(
			"[%TOTAL_FORMATTED%]", _order.getTotalFormatted()
		).put(
			"[%VAT_FORMATTED%]", _order.getTaxAmountFormatted()
		).put(
			"[%VAT_NUMBER%]", account.getTaxId()
		).build();
	}

	private String _getExchangeRate() {
		Map<String, String> customFields =
			(Map<String, String>)_order.getCustomFields();

		JSONObject orderMetadataJSONObject = new JSONObject(
			customFields.getOrDefault("order-metadata", "{}"));

		if (!Objects.equals(_order.getCurrencyCode(), "USD") ||
			!orderMetadataJSONObject.has("exchangeRate")) {

			return "Not applicable";
		}

		double exchangeRate = orderMetadataJSONObject.getDouble("exchangeRate");

		return "1 USD = " + String.format("%.5f", exchangeRate) + " EUR";
	}

    private final String _liferayHost;
	private final Order _order;
	private final Product _product;
	private final Map<String, String> _productSpecificationsMap;

}