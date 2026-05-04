/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;
import com.liferay.headless.admin.user.client.dto.v1_0.Account;
import com.liferay.headless.admin.user.client.dto.v1_0.AccountRole;
import com.liferay.headless.admin.user.client.dto.v1_0.PostalAddress;
import com.liferay.headless.admin.user.client.dto.v1_0.UserAccount;
import com.liferay.headless.admin.user.client.resource.v1_0.AccountResource;
import com.liferay.headless.admin.user.client.resource.v1_0.AccountRoleResource;
import com.liferay.headless.admin.user.client.resource.v1_0.PostalAddressResource;
import com.liferay.headless.admin.user.client.resource.v1_0.UserAccountResource;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Currency;
import com.liferay.headless.commerce.admin.catalog.client.dto.v1_0.Product;
import com.liferay.headless.commerce.admin.catalog.client.resource.v1_0.CurrencyResource;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.BillingAddress;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.OrderItem;
import com.liferay.headless.commerce.admin.order.client.pagination.Page;
import com.liferay.headless.commerce.admin.order.client.pagination.Pagination;
import com.liferay.headless.commerce.admin.order.client.resource.v1_0.OrderItemResource;
import com.liferay.headless.commerce.admin.order.client.resource.v1_0.OrderResource;
import com.liferay.marketplace.model.PublisherAssetLink;
import com.liferay.marketplace.permission.DefaultServiceAccountPermission;
import com.liferay.marketplace.service.MarketplaceService;
import com.liferay.marketplace.service.ProvisioningService;
import com.liferay.marketplace.util.MarketplaceUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LinkedHashMapBuilder;
import com.liferay.portal.kernel.util.StringUtil;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;

import java.math.BigDecimal;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;
import java.util.Set;
import java.util.jar.Attributes;
import java.util.jar.JarFile;
import java.util.jar.Manifest;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * @author Keven Leone
 */
@RequestMapping("/marketplace")
@RestController
public class MarketplaceRestController extends BaseRestController {

	@PostMapping("/create-lpkg")
	public ResponseEntity<StreamingResponseBody> createLpkg(
			@RequestParam("file") MultipartFile file)
		throws Exception {

		String originalName = file.getOriginalFilename();

		byte[] lpkgBytes;

		try (InputStream inputStream = file.getInputStream()) {
			lpkgBytes = _buildLpkg(
				inputStream, originalName, Collections.emptyMap(), null, null);
		}

		String name = StringUtil.replace(
			originalName, new String[] {".jar", ".zip"}, new String[] {"", ""});

		String finalName = name + ".lpkg";

		return ResponseEntity.ok(
		).header(
			HttpHeaders.CONTENT_DISPOSITION,
			"attachment; filename=\"" + finalName + "\""
		).contentType(
			MediaType.APPLICATION_OCTET_STREAM
		).body(
			outputStream -> outputStream.write(lpkgBytes)
		);
	}

	@GetMapping("orders/export")
	public ResponseEntity<StreamingResponseBody> getOrdersExport(
			@RequestParam(defaultValue = "", name = "filters", required = false)
				String filterString)
		throws Exception {

		StreamingResponseBody streamingResponseBody = outputStream -> {
			try (CSVPrinter csvPrinter = new CSVPrinter(
					new BufferedWriter(new OutputStreamWriter(outputStream)),
					CSVFormat.DEFAULT.builder(
					).setHeader(
						"Account ERC", "Account Name", "Create Date",
						"Creator Email", "Order ID", "Order Type",
						"Product Name", "Total"
					).build())) {

				OrderResource orderResource =
					_marketplaceService.getOrderResource();

				for (int i = 1;; i++) {
					Page<Order> page = orderResource.getOrdersPage(
						"", filterString, Pagination.of(i, 200), "");

					for (Order order : page.getItems()) {
						String orderItemName = "";

						for (OrderItem orderItem : order.getOrderItems()) {
							orderItemName = orderItem.getName(
							).get(
								"en_US"
							);

							break;
						}

						com.liferay.headless.commerce.admin.order.client.dto.
							v1_0.Account account = order.getAccount();

						csvPrinter.printRecord(
							account.getExternalReferenceCode(),
							account.getName(), order.getCreateDate(),
							order.getCreatorEmailAddress(), order.getId(),
							order.getOrderTypeExternalReferenceCode(),
							orderItemName, order.getTotalFormatted());
					}

					if (i >= page.getLastPage()) {
						break;
					}
				}

				csvPrinter.flush();
			}
			catch (Exception exception) {
				throw new IOException(exception);
			}
		};

		return ResponseEntity.ok(
		).header(
			HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=orders.csv"
		).contentType(
			MediaType.TEXT_PLAIN
		).body(
			streamingResponseBody
		);
	}

	@PostMapping("/account")
	public ResponseEntity<Account> postAccount(
			@RequestPart("account") String accountJSON,
			@RequestPart(name = "file", required = false) MultipartFile file,
			@AuthenticationPrincipal Jwt jwt)
		throws Exception {

		if (_log.isInfoEnabled()) {
			_log.info("POST account " + accountJSON);
		}

		Account account = Account.toDTO(accountJSON);

		if (file != null) {
			Base64.Encoder encoder = Base64.getEncoder();

			account.setLogoBase64(
				() -> encoder.encodeToString(file.getBytes()));
		}

		AccountResource accountResource =
			_marketplaceService.getAccountResource();

		com.liferay.headless.admin.user.client.pagination.Page<Account>
			accountsPage = accountResource.getAccountsPage(
				"", "name eq '" + account.getName() + "'",
				com.liferay.headless.admin.user.client.pagination.Pagination.of(
					1, 1),
				"");

		if (accountsPage.getTotalCount() > 0) {
			throw new ResponseStatusException(
				HttpStatus.CONFLICT, "Account already exists");
		}

		account = accountResource.postAccount(account);

		PostalAddressResource postalAddressesResource =
			_marketplaceService.getPostalAddressResource();

		PostalAddress postalAddress =
			postalAddressesResource.getAccountPostalAddressesPage(
				account.getId()
			).fetchFirstItem();

		if (postalAddress != null) {
			accountResource.patchAccount(
				account.getId(),
				new Account() {
					{
						setDefaultBillingAddressId(postalAddress::getId);
					}
				});
		}

		UserAccountResource userAccountResource =
			_marketplaceService.getUserAccountResource();

		UserAccount userAccount = userAccountResource.getUserAccount(
			GetterUtil.getLong(jwt.getClaimAsString("sub")));

		String emailAddress = userAccount.getEmailAddress();

		userAccountResource.postAccountUserAccountByEmailAddress(
			account.getId(), emailAddress);

		Long accountRoleId = _getAccountAdministratorRoleId(account.getId());

		if (accountRoleId != null) {
			AccountRoleResource accountRoleResource =
				_marketplaceService.getAccountRoleResource();

			accountRoleResource.
				postAccountByExternalReferenceCodeAccountRoleUserAccountByEmailAddress(
					account.getExternalReferenceCode(), accountRoleId,
					emailAddress);
		}

		if (_log.isInfoEnabled()) {
			_log.info(
				StringBundler.concat(
					"User ", emailAddress, " associated with account ",
					account.getName()));
		}

		return ResponseEntity.ok(account);
	}

	@PostMapping("/tax-calculate/{orderId}")
	public void postTaxCalculate(@PathVariable long orderId) throws Exception {
		if (_log.isInfoEnabled()) {
			_log.info("POST tax calculate for order " + orderId);
		}

		Order order = _marketplaceService.getOrder(orderId);

		BillingAddress billingAddress = _marketplaceService.getBillingAddress(
			orderId);

		if (billingAddress == null) {
			return;
		}

		com.liferay.headless.commerce.admin.order.client.dto.v1_0.Account
			account = order.getAccount();

		BigDecimal subtotalAmount = BigDecimal.valueOf(
			order.getSubtotalAmount());

		BigDecimal taxAmount = BigDecimal.ZERO;

		BigDecimal total = subtotalAmount.add(taxAmount);

		if ((Objects.equals(account.getType(), _ACCOUNT_TYPE_BUSINESS) &&
			 Objects.equals(billingAddress.getCountryISOCode(), "IE")) ||
			(Objects.equals(account.getType(), _ACCOUNT_TYPE_PERSON) &&
			 _europeanCountriesISOCode.contains(
				 billingAddress.getCountryISOCode()))) {

			OrderResource orderResource =
				_marketplaceService.getOrderResource();

			OrderItemResource orderItemResource =
				_marketplaceService.getOrderItemResource();

			taxAmount = subtotalAmount.multiply(
				BigDecimal.valueOf(_MARKETPLACE_TAX_PERCENTAGE));

			total = subtotalAmount.add(taxAmount);
			BigDecimal finalTaxAmount = taxAmount;

			BigDecimal finalTotal = total;

			for (OrderItem orderItem : order.getOrderItems()) {
				orderItemResource.patchOrderItem(
					orderItem.getId(),
					new OrderItem() {
						{
							setFinalPrice(orderItem::getFinalPrice);
							setFinalPriceWithTaxAmount(
								() -> orderItem.getFinalPrice(
								).add(
									orderItem.getFinalPrice(
									).multiply(
										BigDecimal.valueOf(
											_MARKETPLACE_TAX_PERCENTAGE)
									)
								));
							setPriceManuallyAdjusted(() -> true);
						}
					});
			}

			_setExchangeRate(order);

			orderResource.patchOrder(
				orderId,
				new Order() {
					{
						setCustomFields(order::getCustomFields);
						setTaxAmount(() -> finalTaxAmount);
						setTotal(() -> finalTotal);
					}
				});
		}
	}

	@PostMapping("/process-publisher-asset-links/{productId}")
	public void processPublisherAssetLinks(@PathVariable long productId) {
		if (_log.isInfoEnabled()) {
			_log.info(
				"POST process publisher asset links for product " + productId);
		}

		try {
			Product product = _marketplaceService.getProduct(productId);

			Map<String, String> productSpecificationsMap =
				_marketplaceService.getProductSpecificationsMap(productId);

			List<PublisherAssetLink> publisherAssetLinks =
				_getPublisherAssetLinks(
					_marketplaceService.getPublisherAssetsJSONObject(
						productId));

			if (publisherAssetLinks.isEmpty()) {
				if (_log.isInfoEnabled()) {
					_log.info(
						"No publisher asset links to process for product " +
							productId);
				}

				return;
			}

			boolean dxp = Objects.equals(
				productSpecificationsMap.get("type"), "dxp");

			for (PublisherAssetLink publisherAssetLink : publisherAssetLinks) {
				if (dxp) {
					_processPublisherAssetLinkDxp(
						product, productSpecificationsMap, publisherAssetLink);
				}
				else {
					_processPublisherAssetLink(
						product, productSpecificationsMap, publisherAssetLink);
				}
			}
		}
		catch (WebClientResponseException webClientResponseException) {
			_log.error(
				"Unable to process publisher asset links for product " +
					productId);

			_log.error(webClientResponseException.getResponseBodyAsString());
		}
		catch (Exception exception) {
			_log.error(
				"Unable to process publisher asset links for product " +
					productId,
				exception);
		}
	}

	/**
	 * Assembles the master (suite) LPKG containing one API sub-package and/or
	 * one Impl sub-package, plus the master marketplace.properties.
	 *
	 * <p>Whether license properties are injected into each sub-LPKG is
	 * determined by the presence of {@code META-INF/marketplace.properties}
	 * inside each JAR — paid bundles ship that file, free ones do not.
	 *
	 * <p>All JARs (API + Impl) are listed in the {@code bundles} property of
	 * every sub-LPKG, matching the structure expected by the DXP runtime.
	 */
	private byte[] _assembleMasterLpkg(
			List<JarMetadata> apiJars, List<JarMetadata> implJars, Path apiDir,
			Path implDir, Map<String, String> productSpecificationsMap,
			Product product, PublisherAssetLink publisherAssetLink)
		throws IOException {

		ByteArrayOutputStream byteArrayOutputStream =
			new ByteArrayOutputStream();

		try (ZipOutputStream masterzipOutputStream = new ZipOutputStream(
				byteArrayOutputStream)) {

			List<String> sublpkgNames = new ArrayList<>();

			if (!apiJars.isEmpty()) {
				JarMetadata main = apiJars.get(0);

				Map<String, Path> jars =
					LinkedHashMapBuilder.<String, Path>create(
						apiJars.size()
					).build();

				List<String> bundleEntries = new ArrayList<>();

				for (JarMetadata jar : apiJars) {
					jars.put(jar._fileName, apiDir.resolve(jar._fileName));

					bundleEntries.add(
						StringBundler.concat(
							jar._symbolicName, "#", jar._version, "##"));
				}

				String name = main._bundleName + " - API.lpkg";

				masterzipOutputStream.putNextEntry(new ZipEntry(name));

				Map<String, Properties> propertiesMap =
					MarketplaceUtil.createMarketplaceProperties(
						product, productSpecificationsMap, publisherAssetLink,
						main._symbolicName + ".api", main._version,
						String.join(",", bundleEntries), main._bundleName);

				masterzipOutputStream.write(
					MarketplaceUtil.createMarketplaceProperties(
						propertiesMap, jars));

				masterzipOutputStream.closeEntry();

				sublpkgNames.add(name);
			}

			if (!implJars.isEmpty()) {
				JarMetadata main = implJars.get(0);

				Map<String, Path> jars =
					LinkedHashMapBuilder.<String, Path>create(
						implJars.size()
					).build();

				List<String> bundleEntries = new ArrayList<>();

				for (JarMetadata jar : implJars) {
					jars.put(jar._fileName, implDir.resolve(jar._fileName));

					bundleEntries.add(
						StringBundler.concat(
							jar._symbolicName, "#", jar._version, "##"));
				}

				String name = main._bundleName + " - Impl.lpkg";

				masterzipOutputStream.putNextEntry(new ZipEntry(name));

				Map<String, Properties> propertiesMap =
					MarketplaceUtil.createMarketplaceProperties(
						product, productSpecificationsMap, publisherAssetLink,
						main._symbolicName + ".impl", main._version,
						String.join(",", bundleEntries), main._bundleName);

				masterzipOutputStream.write(
					MarketplaceUtil.createMarketplaceProperties(
						propertiesMap, jars));

				masterzipOutputStream.closeEntry();

				sublpkgNames.add(name);
			}
		}

		return byteArrayOutputStream.toByteArray();
	}

	/**
	 * Builds a master LPKG byte array from a ZIP (containing JARs) or a single
	 * JAR InputStream. Inspects each JAR's OSGi manifest to split bundles into
	 * API and Impl sub-packages, then assembles the master LPKG with a
	 * liferay-marketplace.properties descriptor.
	 *
	 * @param  inputStream the raw bytes of the uploaded file
	 * @param  originalFileName used to decide whether the stream is a bare JAR
	 *         or a ZIP containing multiple JARs
	 * @param  productSpecificationsMap product specifications used to determine
	 *         whether license properties should be injected into sub-LPKGs
	 * @return the master LPKG as a byte array
	 */
	private byte[] _buildLpkg(
			InputStream inputStream, String originalFileName,
			Map<String, String> productSpecificationsMap, Product product,
			PublisherAssetLink publisherAssetLink)
		throws IOException {

		Path workDir = Files.createTempDirectory("lpkg-build-");

		Path apiDir = Files.createDirectories(workDir.resolve("api"));
		Path implDir = Files.createDirectories(workDir.resolve("impl"));

		List<JarMetadata> apiJars = new ArrayList<>();
		List<JarMetadata> implJars = new ArrayList<>();

		// Resolve license properties once — injected into each JAR for Paid
		// products, null for Free (JARs remain untouched)

		Properties licenseProperties = null;

		if (Objects.equals(
				productSpecificationsMap.get("price-model"), "Paid") &&
			Objects.equals(productSpecificationsMap.get("type"), "dxp")) {

			licenseProperties = new Properties();

			licenseProperties.setProperty(
				"product-id",
				productSpecificationsMap.getOrDefault("product-erc", ""));
			licenseProperties.setProperty("license-version", "1.0.0");
			licenseProperties.setProperty(
				"security-manager-set-context-class-loader", "true");
			licenseProperties.setProperty("product-version-id", "1");
		}

		try {
			if (originalFileName.endsWith(".jar")) {
				_processJar(
					originalFileName, inputStream, workDir, apiJars, implJars,
					apiDir, implDir, licenseProperties);
			}
			else {
				ZipInputStream zipInputStream = new ZipInputStream(inputStream);
				ZipEntry entry;

				while ((entry = zipInputStream.getNextEntry()) != null) {
					if (!entry.isDirectory() &&
						entry.getName(
						).endsWith(
							".jar"
						)) {

						_processJar(
							entry.getName(), zipInputStream, workDir, apiJars,
							implJars, apiDir, implDir, licenseProperties);
					}

					zipInputStream.closeEntry();
				}
			}

			if (apiJars.isEmpty() && implJars.isEmpty()) {
				throw new IOException(
					"No valid OSGi bundles found in the uploaded file");
			}

			return _assembleMasterLpkg(
				apiJars, implJars, apiDir, implDir, productSpecificationsMap,
				product, publisherAssetLink);
		}
		finally {
			FileSystemUtils.deleteRecursively(workDir);
		}
	}

	private Long _getAccountAdministratorRoleId(long accountId)
		throws Exception {

		AccountRoleResource accountRoleResource =
			_marketplaceService.getAccountRoleResource();

		com.liferay.headless.admin.user.client.pagination.Page<AccountRole>
			accountRolesPage = accountRoleResource.getAccountAccountRolesPage(
				accountId, null, "name eq 'Account Administrator'",
				com.liferay.headless.admin.user.client.pagination.Pagination.of(
					1, 1),
				null);

		AccountRole accountRole = accountRolesPage.fetchFirstItem();

		if (accountRole == null) {
			return null;
		}

		return accountRole.getId();
	}

	private String _getOrderTypeName(Order order) {
		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "AI_HUB")) {

			return "AI Hub Beta";
		}

		if (Objects.equals(
				order.getOrderTypeExternalReferenceCode(), "CMP_BETA")) {

			return "CMP Beta";
		}

		return null;
	}

	private File _getPublisherAssetFile(String publisherAssetURL)
		throws Exception {

		Path path = Files.createTempFile("publisher_asset_", ".zip");

		File file = path.toFile();

		try (InputStream inputStream =
				_marketplaceService.getPublisherAssetInputStream(
					publisherAssetURL);
			FileOutputStream fileOutputStream = new FileOutputStream(file)) {

			inputStream.transferTo(fileOutputStream);
		}

		return file;
	}

	private List<PublisherAssetLink> _getPublisherAssetLinks(
		JSONObject jsonObject) {

		List<PublisherAssetLink> publisherAssetLinks = new ArrayList<>();

		JSONArray itemsJSONArray = jsonObject.optJSONArray("items");

		for (int i = 0; i < itemsJSONArray.length(); i++) {
			JSONObject itemJSONObject = itemsJSONArray.getJSONObject(i);

			JSONArray attachmentsJSONArray = itemJSONObject.getJSONArray(
				"publisherAssetsToAttachment");

			for (int j = 0; j < attachmentsJSONArray.length(); j++) {
				JSONObject attachmentJSONObject =
					attachmentsJSONArray.getJSONObject(j);

				if (attachmentJSONObject.getBoolean("processed")) {
					continue;
				}

				JSONObject sourceCodeJSONObject =
					attachmentJSONObject.getJSONObject("sourceCode");

				JSONObject linkJSONObject = sourceCodeJSONObject.getJSONObject(
					"link");

				publisherAssetLinks.add(
					new PublisherAssetLink(
						attachmentJSONObject.getLong("id"),
						sourceCodeJSONObject.getString("name"),
						linkJSONObject.getString("href"),
						itemJSONObject.optString("version", "")));
			}
		}

		return publisherAssetLinks;
	}

	/**
	 * Rewrites {@code sourceJar} into {@code targetJar}, copying every existing
	 * entry verbatim and appending {@code META-INF/marketplace.properties} with
	 * the given license properties. If the entry already exists in the source
	 * JAR it is replaced, so the method is idempotent.
	 */
	private void _injectMarketplacePropertiesIntoJar(
			Path sourceJar, Path targetJar, Properties licenseProperties)
		throws IOException {

		try (ZipInputStream zipInputStream = new ZipInputStream(
				Files.newInputStream(sourceJar));
			ZipOutputStream zipOutputStream = new ZipOutputStream(
				Files.newOutputStream(targetJar))) {

			boolean propertiesWritten = false;

			ZipEntry entry;

			while ((entry = zipInputStream.getNextEntry()) != null) {
				if (Objects.equals(
						entry.getName(), "META-INF/marketplace.properties")) {

					// Replace existing entry with the new one

					MarketplaceUtil.addPropertiesToZipFile(
						Collections.singletonMap(
							"META-INF/marketplace.properties",
							licenseProperties),
						zipOutputStream);

					propertiesWritten = true;
				}
				else {
					zipOutputStream.putNextEntry(new ZipEntry(entry.getName()));

					zipInputStream.transferTo(zipOutputStream);

					zipOutputStream.closeEntry();
				}

				zipInputStream.closeEntry();
			}

			// Entry did not exist in the source JAR — append it

			if (!propertiesWritten) {
				MarketplaceUtil.addPropertiesToZipFile(
					Collections.singletonMap(
						"META-INF/marketplace.properties", licenseProperties),
					zipOutputStream);
			}
		}
	}

	@PostMapping("request-product-feedback/{orderId}")
	private void _postRequestProductFeedback(
			@AuthenticationPrincipal Jwt jwt, @PathVariable long orderId)
		throws Exception {

		if (_log.isInfoEnabled()) {
			_log.info("POST request product feedback " + orderId);
		}

		_defaultServiceAccountPermission.check(jwt);

		Order order = _marketplaceService.getOrder(orderId);

		OrderItem[] orderItems = order.getOrderItems();

		OrderItem orderItem = orderItems[0];

		if (orderItem == null) {
			return;
		}

		Product product = _marketplaceService.getProductBySkuId(
			orderItem.getSkuId());

		Map<String, String> productSpecificationsMap =
			_marketplaceService.getProductSpecificationsMap(
				product.getProductId());

		_marketplaceService.postNotificationQueueEntry(
			order.getCreatorEmailAddress(),
			"MARKETPLACE-REQUEST-PRODUCT-FEEDBACK",
			HashMapBuilder.put(
				"[%CATALOG_NAME%]",
				product.getCatalog(
				).getName()
			).put(
				"[%EMAIL_BODY%]",
				StringBundler.concat(
					"<p>It has been a few weeks since you started using <b>",
					_getOrderTypeName(order),
					"</b> via the Marketplace. We hope it’s helping you ",
					"streamline your Liferay operations. Could you spare <b>5 ",
					"minutes</b> to let us know how we’re doing?</p>")
			).put(
				"[%MARKETPLACE_HOST%]",
				lxcDXPServerProtocol + "://" + lxcDXPMainDomain
			).put(
				"[%ORDER_ID%]", String.valueOf(orderId)
			).put(
				"[%PRODUCT_NAME%]",
				product.getName(
				).get(
					"en_US"
				)
			).put(
				"[%PRODUCT_THUMBNAIL%]",
				_marketplaceService.getProductThumbnail(product)
			).put(
				"[%PRODUCT_TYPE%]", productSpecificationsMap.get("app-beta")
			).build());
	}

	/**
	 * Inspects a single JAR stream, reads its OSGi manifest, and places it in
	 * either the API or Impl bucket. For Paid products ({@code licenseProperties}
	 * non-null), rewrites the JAR injecting {@code META-INF/marketplace.properties}
	 * so the DXP runtime can enforce license validation at install time.
	 * Free product JARs are copied verbatim.
	 */
	private void _processJar(
			String entryName, InputStream inputStream, Path workDir,
			List<JarMetadata> apiJars, List<JarMetadata> implJars, Path apiDir,
			Path implDir, Properties licenseProperties)
		throws IOException {

		String fileName = new File(
			entryName
		).getName();

		Path tempFile = workDir.resolve("temp_" + System.nanoTime() + ".jar");

		Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING);

		try (JarFile jarFile = new JarFile(tempFile.toFile())) {
			Manifest mf = jarFile.getManifest();

			if (mf == null) {
				return;
			}

			Attributes attributes = mf.getMainAttributes();

			String rawBsn = attributes.getValue("Bundle-SymbolicName");

			if (rawBsn == null) {
				return;
			}

			JarMetadata meta = new JarMetadata();

			meta._symbolicName = rawBsn.split(";")[0].trim();
			meta._version = Objects.toString(
				attributes.getValue("Bundle-Version"), "0.0.0");
			meta._bundleName = Objects.toString(
				attributes.getValue("Bundle-Name"), meta._symbolicName);
			meta._fileName = fileName;

			// For Paid products, rewrite the JAR injecting
			// META-INF/marketplace.properties inside it.
			// Free product JARs are moved verbatim.

			Path targetDir =
				meta._symbolicName.contains(".api") ? apiDir : implDir;

			if (licenseProperties != null) {
				Path injectedJar = workDir.resolve(
					"injected_" + System.nanoTime() + ".jar");

				_injectMarketplacePropertiesIntoJar(
					tempFile, injectedJar, licenseProperties);

				Files.move(
					injectedJar, targetDir.resolve(fileName),
					StandardCopyOption.REPLACE_EXISTING);

				Files.deleteIfExists(tempFile);
			}
			else {
				Files.move(
					tempFile, targetDir.resolve(fileName),
					StandardCopyOption.REPLACE_EXISTING);
			}

			if (meta._symbolicName.contains(".api")) {
				apiJars.add(meta);
			}
			else {
				implJars.add(meta);
			}
		}
	}

	/**
	 * Processes a single publisher asset link for non-DXP product types
	 * (e.g. "cloud"). Downloads the asset, adds artifact metadata, posts it as
	 * a virtual file entry, optionally attaches it, and marks it as processed.
	 */
	private void _processPublisherAssetLink(
			Product product, Map<String, String> productSpecificationsMap,
			PublisherAssetLink publisherAssetLink)
		throws Exception {

		File publisherAssetArtifactFile = null;
		File publisherAssetFile = null;

		try {
			publisherAssetFile = _getPublisherAssetFile(
				publisherAssetLink.getHREF());

			publisherAssetArtifactFile = MarketplaceUtil.addArtifactMetadata(
				publisherAssetFile, publisherAssetLink.getFileName(),
				MarketplaceUtil.createMarketplaceProperties(
					product, productSpecificationsMap, publisherAssetLink, null,
					null, null, null));

			_marketplaceService.postVirtualFileEntry(
				publisherAssetArtifactFile, product.getProductId(),
				publisherAssetLink.getVersion());

			if (Objects.equals(productSpecificationsMap.get("type"), "cloud")) {
				_marketplaceService.postProductAttachment(
					publisherAssetArtifactFile,
					publisherAssetLink.getFileName(), product.getProductId());
			}

			_marketplaceService.patchPublisherAssetAttachment(
				new JSONObject(
				).put(
					"processed", true
				).toString(),
				publisherAssetLink.getAttachmentId());
		}
		finally {
			MarketplaceUtil.deleteTempFile(publisherAssetArtifactFile, true);
			MarketplaceUtil.deleteTempFile(publisherAssetFile, false);
		}
	}

	/**
	 * Processes a single publisher asset link for DXP product type. Downloads
	 * the asset (ZIP or JAR), builds a master LPKG via {@link #_buildLpkg},
	 * merges the artifact metadata properties into the existing
	 * liferay-marketplace.properties entry inside the LPKG (avoiding a
	 * duplicate-entry error), posts it as a virtual file entry, and marks the
	 * original asset as processed.
	 */
	private void _processPublisherAssetLinkDxp(
			Product product, Map<String, String> productSpecificationsMap,
			PublisherAssetLink publisherAssetLink)
		throws Exception {

		File publisherAssetFile = null;
		File lpkgFile = null;

		try {
			publisherAssetFile = _getPublisherAssetFile(
				publisherAssetLink.getHREF());

			// Build the LPKG from the downloaded ZIP/JAR.
			// Enrich the specifications map with the product ERC so
			// _buildLpkg can use it as product-id in the license properties.

			Map<String, String> enrichedSpecificationsMap =
				HashMapBuilder.putAll(
					productSpecificationsMap
				).put(
					"product-erc", product.getExternalReferenceCode()
				).build();

			byte[] lpkgBytes;

			try (InputStream inputStream = Files.newInputStream(
					publisherAssetFile.toPath())) {

				lpkgBytes = _buildLpkg(
					inputStream, publisherAssetLink.getFileName(),
					enrichedSpecificationsMap, product, publisherAssetLink);
			}

			// Write the final LPKG bytes to a temp file

			Path tempDir = Files.createTempDirectory("lpkg-upload-");

			String appName = MarketplaceUtil.getDefaultLocale(
				product.getName());

			String fileNameWithoutExtension = StringUtil.replace(
				StringUtil.toLowerCase(appName), ' ', '-');

			String fileName = fileNameWithoutExtension + ".lpkg";

			Path lpkgPath = tempDir.resolve(fileName);

			lpkgFile = lpkgPath.toFile();

			Files.write(lpkgPath, lpkgBytes);

			_marketplaceService.postVirtualFileEntry(
				lpkgFile, product.getProductId(),
				publisherAssetLink.getVersion());

			_marketplaceService.patchPublisherAssetAttachment(
				new JSONObject(
				).put(
					"processed", true
				).toString(),
				publisherAssetLink.getAttachmentId());
		}
		finally {
			MarketplaceUtil.deleteTempFile(publisherAssetFile, false);
			MarketplaceUtil.deleteTempFile(lpkgFile, true);
		}
	}

	private void _setExchangeRate(Order order) throws Exception {
		Map<String, String> customFields =
			(Map<String, String>)order.getCustomFields();

		JSONObject orderMetadataJSONObject = new JSONObject(
			customFields.getOrDefault("order-metadata", "{}"));

		if (orderMetadataJSONObject.has("exchangeRate")) {
			return;
		}

		CurrencyResource currencyResource =
			_marketplaceService.getCurrencyResource();

		com.liferay.headless.commerce.admin.catalog.client.pagination.Page
			<Currency> currenciesPage = currencyResource.getCurrenciesPage(
				null, "code eq 'EUR'",
				com.liferay.headless.commerce.admin.catalog.client.pagination.
					Pagination.of(1, 1),
				null);

		Currency currency = currenciesPage.fetchFirstItem();

		if (currency == null) {
			return;
		}

		customFields.put(
			"order-metadata",
			orderMetadataJSONObject.put(
				"exchangeRate", currency.getRate()
			).toString());
	}

	/**
	 * Holds OSGi manifest metadata for a single JAR during LPKG assembly.
	 * {@code marketplaceProperties} is non-null only for licensed (paid) DXP
	 * bundles that ship a {@code META-INF/marketplace.properties} file.
	 */
	private static class JarMetadata {

		private String _bundleName;
		private String _fileName;
		private Properties _marketplaceProperties;
		private String _symbolicName;
		private String _version;

	}

	private static final int _ACCOUNT_TYPE_PERSON = 1;

	private static final double _MARKETPLACE_TAX_PERCENTAGE = 0.20;

	private static final Log _log = LogFactory.getLog(
		MarketplaceRestController.class);

	@Autowired
	private DefaultServiceAccountPermission _defaultServiceAccountPermission;

	private final Set<String> _europeanCountriesISOCode = Set.of(
		"AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR",
		"HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO",
		"SE", "SI", "SK");

	@Autowired
	private MarketplaceService _marketplaceService;

	@Autowired
	private ProvisioningService _provisioningService;

	private static final int _ACCOUNT_TYPE_BUSINESS = 2;

}