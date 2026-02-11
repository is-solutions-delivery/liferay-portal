package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.headless.admin.user.client.dto.v1_0.Account;
import com.liferay.headless.admin.user.client.dto.v1_0.UserAccount;
import com.liferay.headless.admin.user.client.resource.v1_0.AccountResource;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.marketplace.constants.MarketplaceConstants;
import com.liferay.marketplace.model.ProductPurchaseNotificationTemplate;
import com.liferay.marketplace.model.SalesforceOpportunity;
import com.liferay.marketplace.service.KoroneikiService;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.marketplace.service.SalesforceService;
import com.liferay.marketplace.util.MarketplaceUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.net.URL;

import java.util.Map;
import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Keven Leone
 */
@RestController
public class ObjectActionProductPurchaseRestController
	extends BaseRestController {

	@PostMapping("/object/action/product-purchase")
	public void post(@AuthenticationPrincipal Jwt jwt, @RequestBody String json)
		throws Exception {

		if (_log.isInfoEnabled()) {
			_log.info("POST product purchase " + json);
		}

		JSONObject jsonObject = new JSONObject(json);

		JSONObject commerceOrderJSONObject = jsonObject.getJSONObject(
			"commerceOrder");

		Order order = _marketplaceService.getOrder(
			commerceOrderJSONObject.getLong("id"));

		int paymentStatus = commerceOrderJSONObject.getInt("paymentStatus");

		_sendNotificationEmail(order);

		if ((paymentStatus !=
				MarketplaceConstants.ORDER_PAYMENT_STATUS_COMPLETED) &&
			(paymentStatus !=
				MarketplaceConstants.ORDER_PAYMENT_STATUS_NOT_REQUIRED)) {

			if (_log.isInfoEnabled()) {
				_log.info(
					"Skipping POST product purchase for order " +
						commerceOrderJSONObject.getLong("id") +
							" because payment status is not completed");
			}

			return;
		}

		_marketplaceService.updateOrder(
			null, order.getId(), MarketplaceConstants.ORDER_STATUS_PROCESSING);

		String orderTypeExternalReferenceCode =
			order.getOrderTypeExternalReferenceCode();
		Map<String, String> productSpecificationsMap =
			_marketplaceService.getProductSpecificationsMap(
				_marketplaceService.getOrderProductId(order));

		if (Objects.equals(orderTypeExternalReferenceCode, "ADDONS")) {
			_setUpAddOns(jwt, order, productSpecificationsMap);

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);
		}

		if (Objects.equals(orderTypeExternalReferenceCode, "CLOUD_APP") ||
			Objects.equals(orderTypeExternalReferenceCode, "COMPOSITE_APP") ||
			Objects.equals(
				orderTypeExternalReferenceCode, "LOW_CODE_CONFIGURATION") ||
			Objects.equals(orderTypeExternalReferenceCode, "OTHER")) {

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);
		}

		if (Objects.equals(
				orderTypeExternalReferenceCode, "CLIENT_EXTENSION") ||
			Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "DXP_APP")) {

			if (Objects.equals(
					productSpecificationsMap.get("price-model"), "Free")) {

				_marketplaceService.updateOrder(
					null, order.getId(),
					MarketplaceConstants.ORDER_STATUS_COMPLETED);

				return;
			}

			_setUpProductEntitlements(
				jwt, productSpecificationsMap.get("license-type"), order);
		}
	}

	private void _sendNotificationEmail(Order order) throws Exception {
		String paymentMethod = order.getPaymentMethod();
		int paymentStatus = order.getPaymentStatus();

		OrderItem orderItem = order.getOrderItems()[0];

		Product product = _marketplaceService.getProductBySkuId(
			orderItem.getSkuId());

		Map<String, String> productSpecificationsMap =
			_marketplaceService.getProductSpecificationsMap(
				product.getProductId());

		ProductPurchaseNotificationTemplate
			productPurchaseNotificationTemplate =
				new ProductPurchaseNotificationTemplate(
					lxcDXPServerProtocol + "://" + lxcDXPMainDomain, order,
					product, productSpecificationsMap);

		if ((Objects.equals(
				paymentMethod,
				MarketplaceConstants.ORDER_PAYMENT_METHOD_MONEY_ORDER) &&
			 (paymentStatus ==
				 MarketplaceConstants.ORDER_PAYMENT_STATUS_PENDING)) ||
			(Objects.equals(
				paymentMethod,
				MarketplaceConstants.ORDER_PAYMENT_METHOD_PAYPAL) &&
			 (paymentStatus ==
				 MarketplaceConstants.ORDER_PAYMENT_STATUS_COMPLETED))) {

			_marketplaceService.postNotificationQueueEntry(
				null, "MARKETPLACE-INVOICE-ORDER-SUBMIT-TEMPLATE",
				productPurchaseNotificationTemplate.
					getInvoiceOrderSubmitTemplate());
		}

		if (Objects.equals(
				paymentMethod,
				MarketplaceConstants.ORDER_PAYMENT_METHOD_PAYPAL) &&
			(paymentStatus ==
				MarketplaceConstants.ORDER_PAYMENT_STATUS_COMPLETED)) {

			_sendOrderConfirmationNotification(order);
		}

		if (Objects.equals(
				paymentMethod,
				MarketplaceConstants.ORDER_PAYMENT_METHOD_MONEY_ORDER) &&
			(paymentStatus ==
				MarketplaceConstants.ORDER_PAYMENT_STATUS_COMPLETED)) {

			_sendPaymentApprovedNotification(order);
		}
	}

	private void _sendOrderConfirmationNotification(Order order)
		throws Exception {

		String orderTypeExternalReferenceCode =
			order.getOrderTypeExternalReferenceCode();
		String emailDescription = "";

		Map<String, String> productSpecificationsMap =
			_marketplaceService.getProductSpecificationsMap(
				_marketplaceService.getOrderProductId(order));

		if (Objects.equals(orderTypeExternalReferenceCode, "CDP")) {
			emailDescription =
				"<p>Your workspace is being created now!</p>" +
					"<p>Click the button below to go to your dashboard and check the status of your environment. " +
						"You can start using it as soon as it is ready.</p>";
		}
		else if (Objects.equals(orderTypeExternalReferenceCode, "DXP")) {
			String priceModel = productSpecificationsMap.get("price-model");

			if (Objects.equals(priceModel, "Free")) {
				emailDescription =
					"<p>Your app is ready for download.</p>" +
						"<p>To find your app download, find your Order ID and choose Manage, " +
							"then Download LPKG.</p>";
			}
			else if (Objects.equals(priceModel, "Paid")) {
				emailDescription =
					"<p>Your app is ready for download.</p>" +
						"<p>To access your download, find your Order ID and select Manage, " +
							"then <b>Download LPKG.</b> " +
								"Please note that a <b>valid license is also required to activate </b> " +
									"and use the application." + "</p>";
			}
		}

		OrderItem[] orderItems = order.getOrderItems();

		OrderItem orderItem = orderItems[0];

		if (orderItem == null) {
			return;
		}

		if (_log.isInfoEnabled()) {
			_log.info(
				"Sending order confirmation notification for order " +
					order.getId());
		}

		Product product = _marketplaceService.getProductBySkuId(
			orderItem.getSkuId());

		Catalog catalog = _marketplaceService.getCatalog(
			product.getCatalogId());

		_marketplaceService.postNotificationQueueEntry(
			order.getCreatorEmailAddress(), "MARKETPLACE-ORDER-CONFIRMATION",
			new HashMapBuilder<String, String>().put(
				"[%APP_NAME%]",
				product.getName(
				).get(
					"en_US"
				)
			).put(
				"[%CATALOG_NAME%]", catalog.getName()
			).put(
				"[%COMMERCEORDER_AUTHOR_EMAIL_ADDRESS%]",
				order.getCreatorEmailAddress()
			).put(
				"[%ORDER_ID%]", String.valueOf(order.getId())
			).put(
				"[%PRODUCT_THUMBNAIL%]",
				new URL(
					StringBundler.concat(
						lxcDXPServerProtocol, "://", lxcDXPMainDomain,
						product.getThumbnail())
				).toString(
				).replaceAll(
					"(?<=accounts/)-?\\d+(?=/images)", "-1"
				)
			).put(
				"[%EMAIL_DESCRIPTION%]", emailDescription
			).put(
				"[%BUTTON_TEXT%]", "Go to Dashboard"
			).put(
				"[%APP_PRICE%]", order.getTotalFormatted()
			).put(
				"[%CPDEFINITION_ID%]", String.valueOf(product.getProductId())
			).build());
	}

	private void _sendPaymentApprovedNotification(Order order)
		throws Exception {

		OrderItem[] orderItems = order.getOrderItems();

		OrderItem orderItem = orderItems[0];

		if (orderItem == null) {
			return;
		}

		if (_log.isInfoEnabled()) {
			_log.info(
				"Sending payment approved notification for order " +
					order.getId());
		}

		Product product = _marketplaceService.getProductBySkuId(
			orderItem.getSkuId());

		Catalog catalog = _marketplaceService.getCatalog(
			product.getCatalogId());

		_marketplaceService.postNotificationQueueEntry(
			null, "MARKETPLACE-PAYMENT-APPROVED",
			new HashMapBuilder<String, String>().put(
				"[%APP_NAME%]",
				product.getName(
				).get(
					"en_US"
				)
			).put(
				"[%CATALOG_NAME%]", catalog.getName()
			).put(
				"[%COMMERCEORDER_AUTHOR_EMAIL_ADDRESS%]",
				order.getCreatorEmailAddress()
			).put(
				"[%APP_NET_PRICE%]", order.getSubtotalFormatted()
			).put(
				"[%ORDER_ID%]", String.valueOf(order.getId())
			).put(
				"[%PRODUCT_THUMBNAIL%]",
				new URL(
					StringBundler.concat(
						lxcDXPServerProtocol, "://", lxcDXPMainDomain,
						product.getThumbnail())
				).toString(
				).replaceAll(
					"(?<=accounts/)-?\\d+(?=/images)", "-1"
				)
			).put(
				"[%EMAIL_DESCRIPTION%]",
				"<p>You are all set 🚀 You <b>can start using all the premium features </b> " +
					"of your Customer Data Platform right away. " +
						"Click the button below to access your CDP and enjoy the full experience." +
							"</p>"
			).put(
				"[%BUTTON_TEXT%]", "Launch LDP"
			).put(
				"[%APP_TOTAL_PRICE%]", order.getTotalFormatted()
			).put(
				"[%APP_VAT%]", order.getTaxAmountFormatted()
			).put(
				"[%CPDEFINITION_ID%]", String.valueOf(product.getProductId())
			).build());
	}

	private void _setUpAddOns(
			Jwt jwt, Order order, Map<String, String> productSpecificationsMap)
		throws Exception {

		String solutionType = productSpecificationsMap.get("solution-type");

		if (Objects.equals(solutionType, "analytics")) {
			_setUpAnalyticsAddOn(jwt, order);

			return;
		}

		if (Objects.equals(solutionType, "ai-hub") ||
			Objects.equals(solutionType, "content-data-platform")) {

			_setUpCustomAddOn(
				productSpecificationsMap.get("license-type"), order);
		}
	}

	private void _setUpAnalyticsAddOn(Jwt jwt, Order order) throws Exception {
		if (!order.getAccountExternalReferenceCode(
			).startsWith(
				"KOR-"
			)) {

			return;
		}

		Map<String, String> customFields =
			(Map<String, String>)order.getCustomFields();

		JSONObject orderMetadataJSONObject = new JSONObject(
			customFields.getOrDefault("order-metadata", "{}"));

		if (_koroneikiService.hasEntitlement(
				_koroneikiService.getKoroneikiAccount(
					order.getAccountExternalReferenceCode()),
				MarketplaceConstants.KORONEIKI_AC_ENTITLEMENTS)) {

			_koroneikiService.linkProductPurchaseToOpportunity(
				jwt, String.valueOf(order.getId()),
				orderMetadataJSONObject.getString("productPurchaseKey"));

			return;
		}

		for (OrderItem orderItem : order.getOrderItems()) {
			if (!Objects.equals(
					orderItem.getSkuExternalReferenceCode(),
					orderMetadataJSONObject.getString("productKey"))) {

				continue;
			}

			_koroneikiService.postAccountAccountKeyProductPurchase(
				order.getAccountExternalReferenceCode(), jwt, "Subscription",
				MarketplaceUtil.getSkuOptionValue(
					"license-usage-type", orderItem.getOptions()),
				orderItem);
		}
	}

	private void _setUpCustomAddOn(String licenseType, Order order)
		throws Exception {

		OrderItem[] orderItems = order.getOrderItems();

		OrderItem orderItem = orderItems[0];

		if (orderItem == null) {
			return;
		}

		UserAccount userAccount = _marketplaceService.getUserAccount(
			order.getCreatorEmailAddress());

		Product product = _marketplaceService.getProductBySkuId(
			orderItem.getSkuId());

		_salesforceService.postSalesforceOpportunity(
			new SalesforceOpportunity(
				licenseType, order, orderItem, product, userAccount));
	}

	private void _setUpProductEntitlements(
			Jwt jwt, String licenseType, Order order)
		throws Exception {

		String accountExternalReferenceCode =
			order.getAccountExternalReferenceCode();

		if (!accountExternalReferenceCode.startsWith("KOR-")) {
			AccountResource accountResource =
				_marketplaceService.getAccountResource();

			Account account = accountResource.getAccount(order.getAccountId());

			account.setExternalReferenceCode(
				() -> _koroneikiService.postKoroneikiAccount(
					account, jwt
				).getKey());

			accountResource.patchAccount(account.getId(), account);
		}

		try {
			for (OrderItem orderItem : order.getOrderItems()) {
				_koroneikiService.postAccountAccountKeyProductPurchase(
					accountExternalReferenceCode, jwt, licenseType,
					MarketplaceUtil.getSkuOptionValue(
						"license-usage-type", orderItem.getOptions()),
					orderItem);
			}

			_marketplaceService.updateOrder(
				null, order.getId(),
				MarketplaceConstants.ORDER_STATUS_COMPLETED);
		}
		catch (Exception exception) {
			_log.error("Unable to create account product purchase", exception);
		}
	}

	private static final Log _log = LogFactory.getLog(
		ObjectActionProductPurchaseRestController.class);

	@Autowired
	private KoroneikiService _koroneikiService;

	@Autowired
	private MarketplaceService _marketplaceService;

	@Autowired
	private SalesforceService _salesforceService;

}