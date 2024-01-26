/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.partner;

import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringUtil;

import java.net.URI;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;

/**
 * @author Jair Medeiros
 */
@Component
public class PartnerCommandLineRunner implements CommandLineRunner {

	public static final String ACCOUNT_ROLE_NAME_PARTNER_MANAGER =
		"[Account] Partner Manager (PM)";

	public static final String ACCOUNT_ROLE_NAME_PARTNER_MARKETING_USER =
		"[Account] Partner Marketing User (PMU)";

	public static final String ACCOUNT_ROLE_NAME_PARTNER_SALES_USER =
		"[Account] Partner Sales User (PSU)";

	public static final String REGULAR_ROLE_NAME_PARTNER_MANAGER =
		"Partner Manager (PM)";

	public static final String REGULAR_ROLE_NAME_PARTNER_MARKETING_USER =
		"Partner Marketing User (PMU)";

	public static final String REGULAR_ROLE_NAME_PARTNER_SALES_USER =
		"Partner Sales User (PSU)";

	@Override
	public void run(String... args) throws Exception {
		ZonedDateTime zonedDateTime = ZonedDateTime.now();

		Map<String, String> countriesISOcodes = _getISOCountries();
		Map<String, Long> regularRolesIDs = _getRegularRolesIDs();
		ArrayList<String> accountsErcFilters = new ArrayList<>();

		JSONObject koroneikiAccountsJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/koroneiki-rest/v1.0/accounts"
			).queryParam(
				"filter",
				"externalLinkEntityNames/any(s:s eq 'salesforce_account') and dateModified ge " +
					_toString(zonedDateTime.minusDays(4))
			).queryParam(
				"pageSize", "-1"
			).queryParam(
				"nestedFields", "customerContacts.contactRoles"
			).build(),
			_koroneikiServerProtocol, _koroneikiAuthURL, "API_Token",
			_koroneikiAuthToken);

		if (koroneikiAccountsJSONObject.getInt("totalCount") > 0) {
			JSONArray koroneikiAccountJSONArray =
				koroneikiAccountsJSONObject.getJSONArray("items");

			for (int i = 0; i < koroneikiAccountJSONArray.length(); i++) {
				JSONObject koroneikiAccountSONObject =
					koroneikiAccountJSONArray.getJSONObject(i);

				String accountName = koroneikiAccountSONObject.getString(
					"name");
				String accountCountry = _fetchAccountCountryISOCode(
					koroneikiAccountSONObject, countriesISOcodes);
				String salesforceAccountKey = _fetchSalesforceAccountKey(
					koroneikiAccountSONObject);

				if (!salesforceAccountKey.isEmpty() &&
					!accountCountry.isEmpty() && !accountName.isEmpty()) {

					JSONObject accountJSONObject = new JSONObject();

					accountJSONObject.put(
						"externalReferenceCode", salesforceAccountKey);
					accountJSONObject.put("name", accountName);
					accountJSONObject.put("partnerCountry", accountCountry);

					_put(
						accountJSONObject.toString(),
						"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
							salesforceAccountKey,
						_lxcDXPServerProtocol, _lxcDXPMainDomain);

					String accountExternalReferenceCode =
						accountJSONObject.getString("externalReferenceCode");

					accountsErcFilters.add(
						"salesforceID eq '" + accountExternalReferenceCode +
							"'");

					JSONArray customerContactsJSONArray =
						koroneikiAccountSONObject.getJSONArray(
							"customerContacts");

					for (int l = 0; l < customerContactsJSONArray.length();
						 l++) {

						JSONObject customerContactJSONObject =
							customerContactsJSONArray.getJSONObject(l);

						JSONArray contactRolesJSONArray =
							customerContactJSONObject.getJSONArray(
								"contactRoles");

						for (int m = 0; m < contactRolesJSONArray.length();
							 m++) {

							JSONObject contactRoleJONObject =
								contactRolesJSONArray.getJSONObject(m);

							if (StringUtil.equalsIgnoreCase(
									contactRoleJONObject.getString("type"),
									"Account Customer")) {

								String customerContactFirstName =
									customerContactJSONObject.getString(
										"firstName");
								String customerContactLastName =
									customerContactJSONObject.getString(
										"lastName");
								String customerContactEmailAddress =
									customerContactJSONObject.getString(
										"emailAddress");

								if (!customerContactFirstName.isEmpty() &&
									!customerContactLastName.isEmpty() &&
									!customerContactEmailAddress.isEmpty()) {

									JSONObject userAccountJSONObject =
										new JSONObject();

									userAccountJSONObject.put(
										"emailAddress",
										customerContactEmailAddress);
									userAccountJSONObject.put(
										"familyName", customerContactLastName);
									userAccountJSONObject.put(
										"givenName", customerContactFirstName);

									Map<String, Long> accountRolesIDs =
										_getAccountRolesIDs(
											accountExternalReferenceCode);

									String userAccountEmailAddress =
										userAccountJSONObject.getString(
											"emailAddress");

									if (StringUtil.equalsIgnoreCase(
											contactRoleJONObject.getString(
												"name"),
											"Partner Member")) {

										Long userAccontID = _assignUserAccount(
											accountExternalReferenceCode,
											userAccountJSONObject);

										_assignUserAccountToRegularRole(
											regularRolesIDs.get(
												REGULAR_ROLE_NAME_PARTNER_MARKETING_USER),
											userAccontID);
										_assignUserAccountToRegularRole(
											regularRolesIDs.get(
												REGULAR_ROLE_NAME_PARTNER_SALES_USER),
											userAccontID);

										_assignUserAccountToAccountRole(
											accountRolesIDs.get(
												ACCOUNT_ROLE_NAME_PARTNER_MARKETING_USER),
											accountExternalReferenceCode,
											userAccountEmailAddress);
										_assignUserAccountToAccountRole(
											accountRolesIDs.get(
												ACCOUNT_ROLE_NAME_PARTNER_SALES_USER),
											accountExternalReferenceCode,
											userAccountEmailAddress);
									}

									if (StringUtil.equalsIgnoreCase(
											contactRoleJONObject.getString(
												"name"),
											"Partner Manager")) {

										Long userAccontID = _assignUserAccount(
											accountExternalReferenceCode,
											userAccountJSONObject);

										_assignUserAccountToRegularRole(
											regularRolesIDs.get(
												REGULAR_ROLE_NAME_PARTNER_MANAGER),
											userAccontID);

										_assignUserAccountToAccountRole(
											accountRolesIDs.get(
												ACCOUNT_ROLE_NAME_PARTNER_MANAGER),
											accountExternalReferenceCode,
											userAccountEmailAddress);
									}
								}
							}
						}
					}
				}
			}
		}

		if (!accountsErcFilters.isEmpty()) {
			String accountsErcFilter = String.join(" or ", accountsErcFilters);

			JSONObject accountsfsJSONObject = _get(
				uriBuilder -> uriBuilder.path(
					"/o/c/accountsfs/"
				).queryParam(
					"filter", accountsErcFilter
				).queryParam(
					"pageSize", "-1"
				).build(),
				_lxcDXPServerProtocol, _lxcDXPMainDomain,
				HttpHeaders.AUTHORIZATION,
				"Bearer " + _oAuth2AccessToken.getTokenValue());

			Map<String, String> partnerLevelERCs = _fetchPartnerLevelERCs();
			Map<String, Long> regionsIDs = _fetchRegionsIDs();

			if (accountsfsJSONObject.getInt("totalCount") > 0) {
				JSONArray accountsfJSONArray =
					accountsfsJSONObject.getJSONArray("items");

				JSONObject accountJSONObject = new JSONObject();

				for (int n = 0; n < accountsfJSONArray.length(); n++) {
					JSONObject accountsfJSONObject =
						accountsfJSONArray.getJSONObject(n);

					String accountExternalReferenceCode =
						accountsfJSONObject.getString("externalReferenceCode");

					if (accountsfJSONObject.has("partnerLevelType")) {
						JSONObject partnerLevelTypeJSONObject =
							accountsfJSONObject.getJSONObject(
								"partnerLevelType");

						String partnerLevelType =
							partnerLevelTypeJSONObject.getString("key");

						accountJSONObject.put(
							"r_prtLvlToAcc_c_partnerLevelERC",
							partnerLevelERCs.get(partnerLevelType));
					}

					if (accountsfJSONObject.has("currency")) {
						JSONObject accountCurrencyJSONObject =
							accountsfJSONObject.getJSONObject("currency");

						String accountCurrency =
							accountCurrencyJSONObject.getString("key");

						accountJSONObject.put("currency", accountCurrency);
					}

					accountJSONObject.put(
						"externalReferenceCode", accountExternalReferenceCode);

					JSONObject accountResponseJSONObject = _patch(
						accountJSONObject.toString(),
						"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
							accountExternalReferenceCode,
						_lxcDXPServerProtocol, _lxcDXPMainDomain);

					if (accountsfJSONObject.has("region") &&
						(accountResponseJSONObject != null)) {

						String accountRegion = accountsfJSONObject.getString(
							"region");
						Long regionID = regionsIDs.get(
							accountsfJSONObject.getString("region"));

						if (regionID != null) {
							_assignAccountToRegion(
								accountResponseJSONObject, accountRegion,
								regionID);
						}
					}
				}
			}
		}
	}

	private void _assignAccountToRegion(
		JSONObject accountJSONObject, String accountRegion, Long regionID) {

		JSONArray organizationIds = accountJSONObject.getJSONArray(
			"organizationIds");
		String accountExternalReferenceCode = accountJSONObject.getString(
			"externalReferenceCode");
		String accountName = accountJSONObject.getString("name");

		if (organizationIds.isEmpty()) {
			try {
				_post(
					"",
					"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
						accountExternalReferenceCode + "/organizations/" +
							regionID,
					_lxcDXPServerProtocol, _lxcDXPMainDomain);

				StringBundler sb = new StringBundler(6);

				if (_log.isInfoEnabled()) {
					sb.append("Account: ");
					sb.append(accountName);
					sb.append(" (");
					sb.append(accountExternalReferenceCode);
					sb.append(") assigned to: ");
					sb.append(accountRegion);

					_log.info(sb.toString());
				}
			}
			catch (Exception exception) {
				_log.error(exception);
			}
		}
		else if (organizationIds.getLong(0) != regionID) {
			JSONArray accountExternalReferenceCodeJSONArray = new JSONArray();

			accountExternalReferenceCodeJSONArray.put(
				accountExternalReferenceCode);

			try {
				_patch(
					accountExternalReferenceCodeJSONArray.toString(),
					"/o/headless-admin-user/v1.0/organizations/move-accounts/" +
						organizationIds.getLong(0) + "/" + regionID +
							"/by-external-reference-code",
					_lxcDXPServerProtocol, _lxcDXPMainDomain);

				StringBundler sb = new StringBundler(6);

				if (_log.isInfoEnabled()) {
					sb.append("Account: ");
					sb.append(accountName);
					sb.append(" (");
					sb.append(accountExternalReferenceCode);
					sb.append(") moved to: ");
					sb.append(accountRegion);

					_log.info(sb.toString());
				}
			}
			catch (Exception exception) {
				_log.error(exception);
			}
		}
	}

	private Long _assignUserAccount(
		String accountExternalReferenceCode, JSONObject userAccountJSONObject) {

		String emailAddress = userAccountJSONObject.getString("emailAddress");

		_post(
			"",
			"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
				accountExternalReferenceCode +
					"/user-accounts/by-email-address/" + emailAddress,
			_lxcDXPServerProtocol, _lxcDXPMainDomain);

		JSONObject userAccountResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/headless-admin-user/v1.0/user-accounts/by-email-address/" +
					emailAddress
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		Long userAccountId = userAccountResponseJSONObject.getLong("id");

		_patch(
			userAccountJSONObject.toString(),
			"/o/headless-admin-user/v1.0/user-accounts/" + userAccountId,
			_lxcDXPServerProtocol, _lxcDXPMainDomain);

		return userAccountResponseJSONObject.getLong("id");
	}

	private void _assignUserAccountToAccountRole(
		Long accountRoleID, String accountExternalReferenceCode,
		String userAccountEmailAddress) {

		_post(
			"",
			"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
				accountExternalReferenceCode + "/account-roles/" +
					accountRoleID + "/user-accounts/by-email-address/" +
						userAccountEmailAddress,
			_lxcDXPServerProtocol, _lxcDXPMainDomain);
	}

	private void _assignUserAccountToRegularRole(
		Long regularRoleID, Long userAccontID) {

		_post(
			"",
			"/o/headless-admin-user/v1.0/roles/" + regularRoleID +
				"/association/user-account/" + userAccontID,
			_lxcDXPServerProtocol, _lxcDXPMainDomain);
	}

	private String _fetchAccountCountryISOCode(
		JSONObject accountJSONObject, Map<String, String> countries) {

		JSONArray postalAddressesJSONArray = accountJSONObject.getJSONArray(
			"postalAddresses");
		String countryISOcode = "";

		for (int k = 0; k < postalAddressesJSONArray.length(); k++) {
			JSONObject postalAddressesJSONObject =
				postalAddressesJSONArray.getJSONObject(k);

			Boolean primary = postalAddressesJSONObject.getBoolean("primary");

			if (primary) {
				String addressCountry = postalAddressesJSONObject.getString(
					"addressCountry");

				countryISOcode = countries.get(addressCountry);
			}
		}

		return countryISOcode;
	}

	private Map<String, String> _fetchPartnerLevelERCs() {
		JSONObject partnerLevelResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/c/partnerlevels/"
			).queryParam(
				"pageSize", "-1"
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		Map<String, String> partnerLevelERCs = new HashMap<>();

		if (partnerLevelResponseJSONObject.getInt("totalCount") > 0) {
			JSONArray partnerLevelJSONArray =
				partnerLevelResponseJSONObject.getJSONArray("items");

			for (int r = 0; r < partnerLevelJSONArray.length(); r++) {
				JSONObject partnerLevelJSONObject =
					partnerLevelJSONArray.getJSONObject(r);

				JSONObject partnerLevelTypeJSONObject =
					partnerLevelJSONObject.getJSONObject("partnerLevelType");

				String partnerLevelType = partnerLevelTypeJSONObject.optString(
					"key");
				String partnerLevelERC = partnerLevelJSONObject.getString(
					"externalReferenceCode");

				partnerLevelERCs.put(partnerLevelType, partnerLevelERC);
			}
		}

		return partnerLevelERCs;
	}

	private Map<String, Long> _fetchRegionsIDs() {
		Map<String, Long> regionsIDs = new HashMap<>();

		JSONObject globalOrganizationResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/headless-admin-user/v1.0/organizations/by-external-reference-code/PRM-ORG-GLOBAL"
			).queryParam(
				"pageSize", "-1"
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		Long globalOrganizationId =
			globalOrganizationResponseJSONObject.getLong("id");

		JSONObject organizationsResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/headless-admin-user/v1.0/organizations/" +
					globalOrganizationId + "/child-organizations"
			).queryParam(
				"pageSize", "-1"
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		if (organizationsResponseJSONObject.getInt("totalCount") > 0) {
			JSONArray organizationsJSONArray =
				organizationsResponseJSONObject.getJSONArray("items");

			for (int o = 0; o < organizationsJSONArray.length(); o++) {
				JSONObject organizationJSONObject =
					organizationsJSONArray.getJSONObject(o);

				String organizationName = organizationJSONObject.getString(
					"name");
				Long organizationID = organizationJSONObject.getLong("id");

				regionsIDs.put(organizationName, organizationID);
			}
		}

		return regionsIDs;
	}

	private String _fetchSalesforceAccountKey(JSONObject accountJSONObject) {
		JSONArray entitlementsJSONArray = accountJSONObject.getJSONArray(
			"entitlements");

		JSONArray externalLinksJSONArray = accountJSONObject.getJSONArray(
			"externalLinks");

		String salesforceAccountKey = "";

		for (int t = 0; t < externalLinksJSONArray.length(); t++) {
			JSONObject externalLinkJSONObject =
				externalLinksJSONArray.getJSONObject(t);

			if (StringUtil.equalsIgnoreCase(
					externalLinkJSONObject.getString("entityName"),
					"account")) {

				salesforceAccountKey = externalLinkJSONObject.getString(
					"entityId");

				break;
			}
		}

		return salesforceAccountKey;
	}

	private JSONObject _get(
		Function<UriBuilder, URI> uriFunction, String serverProtocol,
		String mainDomain, String headerName, String headerValues) {

		return new JSONObject(
			_getWebClient(
				serverProtocol, mainDomain
			).get(
			).uri(
				uriBuilder -> uriFunction.apply(uriBuilder)
			).accept(
				MediaType.APPLICATION_JSON
			).header(
				headerName, headerValues
			).retrieve(
			).bodyToMono(
				String.class
			).block());
	}

	private Map<String, Long> _getAccountRolesIDs(
		String accountExternalReferenceCode) {

		JSONObject accountRolesResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/headless-admin-user/v1.0/accounts/by-external-reference-code/" +
					accountExternalReferenceCode + "/account-roles"
			).queryParam(
				"pageSize", "-1"
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		Map<String, Long> accountRoles = new HashMap<>();

		if (accountRolesResponseJSONObject.getInt("totalCount") > 0) {
			JSONArray accountRolesJSONArray =
				accountRolesResponseJSONObject.getJSONArray("items");

			for (int r = 0; r < accountRolesJSONArray.length(); r++) {
				JSONObject accountRoleJSONObject =
					accountRolesJSONArray.getJSONObject(r);

				String roleName = accountRoleJSONObject.getString("name");
				Long roleID = accountRoleJSONObject.getLong("id");

				accountRoles.put(roleName, roleID);
			}
		}

		return accountRoles;
	}

	private Map<String, String> _getISOCountries() {
		Map<String, String> countries = new HashMap<>();

		for (String iso : Locale.getISOCountries()) {
			Locale locale = new Locale("", iso);

			countries.put(locale.getDisplayCountry(), iso);
		}

		return countries;
	}

	private Map<String, Long> _getRegularRolesIDs() {
		JSONObject regularRolesResponseJSONObject = _get(
			uriBuilder -> uriBuilder.path(
				"/o/headless-admin-user/v1.0/roles"
			).queryParam(
				"pageSize", "-1"
			).build(),
			_lxcDXPServerProtocol, _lxcDXPMainDomain, HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue());

		Map<String, Long> regularRoles = new HashMap<>();

		if (regularRolesResponseJSONObject.getInt("totalCount") > 0) {
			JSONArray regularRolesJSONArray =
				regularRolesResponseJSONObject.getJSONArray("items");

			for (int r = 0; r < regularRolesJSONArray.length(); r++) {
				JSONObject regularRoleJSONObject =
					regularRolesJSONArray.getJSONObject(r);

				String roleName = regularRoleJSONObject.getString("name");
				Long roleID = regularRoleJSONObject.getLong("id");

				regularRoles.put(roleName, roleID);
			}
		}

		return regularRoles;
	}

	private WebClient _getWebClient(String serverProtocol, String mainDomain) {
		return WebClient.builder(
		).baseUrl(
			serverProtocol + "://" + mainDomain
		).exchangeStrategies(
			ExchangeStrategies.builder(
			).codecs(
				clientCodecConfigurer -> clientCodecConfigurer.defaultCodecs(
				).maxInMemorySize(
					5 * 1024 * 1024
				)
			).build()
		).build();
	}

	private JSONObject _patch(
		String bodyValue, String path, String serverProtocol,
		String mainDomain) {

		String response = _getWebClient(
			serverProtocol, mainDomain
		).patch(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			MediaType.APPLICATION_JSON
		).contentType(
			MediaType.APPLICATION_JSON
		).header(
			HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue()
		).bodyValue(
			bodyValue
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		if (response == null) {
			return null;
		}

		return new JSONObject(response);
	}

	private JSONObject _post(
		String bodyValue, String path, String serverProtocol,
		String mainDomain) {

		String response = _getWebClient(
			serverProtocol, mainDomain
		).post(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			MediaType.APPLICATION_JSON
		).contentType(
			MediaType.APPLICATION_JSON
		).header(
			HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue()
		).bodyValue(
			bodyValue
		).retrieve(
		).bodyToMono(
			String.class
		).block();

		if (response == null) {
			return null;
		}

		return new JSONObject(response);
	}

	private void _put(
		String bodyValue, String path, String serverProtocol,
		String mainDomain) {

		_getWebClient(
			serverProtocol, mainDomain
		).put(
		).uri(
			uriBuilder -> uriBuilder.path(
				path
			).build()
		).accept(
			MediaType.APPLICATION_JSON
		).contentType(
			MediaType.APPLICATION_JSON
		).header(
			HttpHeaders.AUTHORIZATION,
			"Bearer " + _oAuth2AccessToken.getTokenValue()
		).bodyValue(
			bodyValue
		).retrieve(
		).bodyToMono(
			Void.class
		).block();
	}

	private String _toString(ZonedDateTime zonedDateTime) {
		return zonedDateTime.format(
			DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'"));
	}

	private static final Log _log = LogFactory.getLog(
		PartnerCommandLineRunner.class);

	@Value("${liferay.partner.koroneiki.auth.token}")
	private String _koroneikiAuthToken;

	@Value("${liferay.partner.koroneiki.auth.url}")
	private String _koroneikiAuthURL;

	@Value("${liferay.partner.koroneiki.server.protocol}")
	private String _koroneikiServerProtocol;

	@Value("${com.liferay.lxc.dxp.mainDomain}")
	private String _lxcDXPMainDomain;

	@Value("${com.liferay.lxc.dxp.server.protocol}")
	private String _lxcDXPServerProtocol;

	@Autowired
	private OAuth2AccessToken _oAuth2AccessToken;

}