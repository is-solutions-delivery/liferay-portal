/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.pubsub;

import com.google.cloud.pubsub.v1.AckReplyConsumer;
import com.google.cloud.pubsub.v1.MessageReceiver;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.PubsubMessage;

import com.liferay.headless.admin.user.client.custom.field.CustomField;
import com.liferay.headless.admin.user.client.custom.field.CustomValue;
import com.liferay.headless.admin.user.client.dto.v1_0.Account;
import com.liferay.headless.admin.user.client.dto.v1_0.PostalAddress;
import com.liferay.headless.admin.user.client.pagination.Page;
import com.liferay.headless.admin.user.client.pagination.Pagination;
import com.liferay.headless.admin.user.client.resource.v1_0.AccountResource;
import com.liferay.headless.admin.user.client.resource.v1_0.PostalAddressResource;
import com.liferay.headless.commerce.admin.channel.client.dto.v1_0.Channel;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.marketplace.constants.MarketplaceConstants;
import com.liferay.marketplace.service.KoroneikiService;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Entitlement;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.ExternalLink;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Product;
import com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.ProductPurchase;
import com.liferay.petra.string.StringBundler;

import java.math.BigDecimal;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author Caleb Hall
 */
public class MarketplaceMessageReceiver implements MessageReceiver {

	public MarketplaceMessageReceiver(
		Channel channel, KoroneikiService koroneikiService,
		MarketplaceService marketplaceService, String topicName) {

		_channel = channel;
		_koroneikiService = koroneikiService;
		_marketplaceService = marketplaceService;
		_topicName = topicName;
	}

	@Override
	public void receiveMessage(
		PubsubMessage pubsubMessage, AckReplyConsumer ackReplyConsumer) {

		ByteString byteString = pubsubMessage.getData();

		JSONObject jsonObject = new JSONObject(byteString.toStringUtf8());

		try {
			if (Objects.equals(
					_topicName,
					MarketplaceConstants.
						PUBSUB_TOPIC_NAME_KORONEIKI_ACCOUNT_CREATE)) {

				// TODO

			}
			else if (Objects.equals(
						_topicName,
						MarketplaceConstants.
							PUBSUB_TOPIC_NAME_KORONEIKI_ACCOUNT_UPDATE)) {

				com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Account
					koroneikiAccount =
						com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.
							Account.toDTO(
								jsonObject.getJSONObject(
									"account"
								).toString());

				_processKoroneikiAccountUpdate(koroneikiAccount);
			}
			else if (Objects.equals(
						_topicName,
						MarketplaceConstants.
							PUBSUB_TOPIC_NAME_KORONEIKI_ENTITLEMENT_CREATE)) {

				com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Account
					account =
						com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.
							Account.toDTO(
								jsonObject.getJSONObject(
									"account"
								).toString());
				Entitlement entitlement = Entitlement.toDTO(
					jsonObject.getJSONObject(
						"entitlement"
					).toString());

				_processKoroneikiEntitlementCreate(account, entitlement);
			}

			ackReplyConsumer.ack();
		}
		catch (Exception exception) {
			_log.error(
				StringBundler.concat(
					"Unable to process ", jsonObject, " for topic ",
					_topicName),
				exception);

			ackReplyConsumer.nack();
		}
	}

	private Account _getAccount(String externalReferenceCode) throws Exception {
		AccountResource accountResource =
			_marketplaceService.getAccountResource();

		Page<Account> accountsPage = accountResource.getAccountsPage(
			externalReferenceCode, "", Pagination.of(0, -1), "");

		for (Account account : accountsPage.getItems()) {
			if (Objects.equals(
					account.getExternalReferenceCode(),
					externalReferenceCode)) {

				return account;
			}
		}

		return null;
	}

	private PostalAddress _getPostalAddress(
		Account account, String streetAddressLine1) {

		for (PostalAddress postalAddress : account.getPostalAddresses()) {
			if (Objects.equals(
					postalAddress.getStreetAddressLine1(),
					streetAddressLine1)) {

				return postalAddress;
			}
		}

		return null;
	}

	private void _processKoroneikiAccountUpdate(
			com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Account
				koroneikiAccount)
		throws Exception {

		Account account = _getAccount(koroneikiAccount.getKey());

		if (account == null) {
			if (_log.isInfoEnabled()) {
				_log.info(
					"Account \"" + koroneikiAccount.getKey() +
						"\" not found in Marketplace");
			}

			return;
		}

		PostalAddressResource postalAddressResource =
			_marketplaceService.getPostalAddressResource();

		for (com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.PostalAddress
				koroneikiPostalAddress :
					koroneikiAccount.getPostalAddresses()) {

			PostalAddress postalAddress = _getPostalAddress(
				account, koroneikiPostalAddress.getStreetAddressLine1());

			if (postalAddress != null) {
				continue;
			}

			postalAddress = PostalAddress.toDTO(
				koroneikiPostalAddress.toString());

			postalAddress.setAddressType(() -> "billing-and-shipping");

			postalAddressResource.postAccountPostalAddress(
				account.getId(), postalAddress);
		}

		AccountResource accountResource =
			_marketplaceService.getAccountResource();

		accountResource.patchAccount(
			account.getId(),
			new Account() {

				private final CustomField[] _customFields = {
					new CustomField() {
						{
							setCustomValue(
								new CustomValue() {
									{
										setData(
											koroneikiAccount.
												getParentAccountKey());
									}
								});
							setName("koroneiki-parent-account-key");
						}
					},
					new CustomField() {
						{
							setCustomValue(
								new CustomValue() {
									{
										setData(
											_koroneikiService.
												getSalesforceAccountKey(
													koroneikiAccount));
									}
								});
							setName("salesforce-account-key");
						}
					}
				};

				{
					setCustomFields(() -> _customFields);
					setDescription(koroneikiAccount::getDescription);
					setName(koroneikiAccount::getName);
				}
			});

		if (_log.isInfoEnabled()) {
			_log.info(
				"Account \"" + koroneikiAccount.getKey() +
					"\" updated in Marketplace");
		}
	}

	private void _processKoroneikiEntitlementCreate(
		com.liferay.osb.koroneiki.phloem.rest.client.dto.v1_0.Account account,
		Entitlement entitlement) {

		String name = entitlement.getName();

		if (!_productNames.contains(name)) {
			return;
		}

		String accountKey = account.getKey();

		try {
			com.liferay.osb.koroneiki.phloem.rest.client.pagination.Page
				<ProductPurchase> productPurchasePage =
					_koroneikiService.getAccountAccountKeyProductPurchasesPage(
						accountKey,
						com.liferay.osb.koroneiki.phloem.rest.client.pagination.
							Pagination.of(1, -1));

			List<ProductPurchase> productPurchaseItems = new ArrayList<>(
				productPurchasePage.getItems());

			ProductPurchase productPurchase = null;

			for (ProductPurchase productPurchaseItem : productPurchaseItems) {
				Product product = productPurchaseItem.getProduct();

				for (ExternalLink externalLink : product.getExternalLinks()) {
					if (!externalLink.getEntityId(
						).contains(
							name
						)) {

						continue;
					}

					productPurchase = productPurchaseItem;

					break;
				}
			}

			if (productPurchase == null) {
				return;
			}

			Product product = productPurchase.getProduct();

			_marketplaceService.postOrder(
				new Order() {
					{
						setAccountExternalReferenceCode(() -> accountKey);
						setChannelId(_channel::getId);
						setCurrencyCode(() -> "USD");
						setOrderItems(
							() -> new OrderItem[] {
								new OrderItem() {
									{
										setQuantity(() -> BigDecimal.ONE);
										setSkuExternalReferenceCode(
											product::getKey);
									}
								}
							});
						setOrderTypeExternalReferenceCode(
							() -> "SALESFORCE-ORDER");
					}
				});
		}
		catch (Exception exception) {
			_log.error("Could not create order on Marketplace", exception);
		}
	}

	private static final Log _log = LogFactory.getLog(
		MarketplaceMessageReceiver.class);

	private final Channel _channel;
	private final KoroneikiService _koroneikiService;
	private final MarketplaceService _marketplaceService;

	@Value("${liferay.marketplace.product.names}")
	private String _productNames;

	private final String _topicName;

}