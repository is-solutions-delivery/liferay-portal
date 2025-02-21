/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.settings.web.internal.util;

import com.liferay.marketplace.settings.web.internal.constants.MarketplaceActionKeys;
import com.liferay.marketplace.settings.web.internal.constants.MarketplaceAppsPortletKeys;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.service.permission.PortletPermissionUtil;
import com.liferay.portal.kernel.util.ContentTypes;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.HttpUtil;
import com.liferay.portal.kernel.util.PrefsPropsUtil;
import com.liferay.portal.util.PropsValues;

import javax.portlet.PortletPreferences;

/**
 * @author Keven Leone
 */
public class MarketplaceUtil {

	public static JSONObject connect(
			long companyId, String code, String codeVerifier,
			String refreshToken, String serviceURL, String settings)
		throws Exception {

		Http.Options options = new Http.Options();

		options.addHeader(
			"Content-Type", ContentTypes.APPLICATION_X_WWW_FORM_URLENCODED);
		options.addPart("client_id", PropsValues.MARKETPLACE_CLIENT_ID);
		options.addPart("code", code);
		options.addPart(
			"redirect_uri",
			PropsValues.MARKETPLACE_URL + PropsValues.MARKETPLACE_REDIRECT);

		if (refreshToken != null) {
			options.addPart("grant_type", "refresh_token");
			options.addPart("refresh_token", refreshToken);
		}
		else {
			options.addPart("code_verifier", codeVerifier);
			options.addPart("grant_type", "authorization_code");
		}

		options.setLocation(PropsValues.MARKETPLACE_URL + "/o/oauth2/token");
		options.setMethod(Http.Method.POST);

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject(
			HttpUtil.URLtoString(options));

		long accessTokenExpirationTime =
			System.currentTimeMillis() +
				(jsonObject.getLong("expires_in") * 1000);

		jsonObject.put(
			"access_token_expiration_time", accessTokenExpirationTime);

		PortletPreferences portletPreferences = PrefsPropsUtil.getPreferences(
			companyId);

		portletPreferences.setValue(
			"marketplaceAccessToken", jsonObject.getString("access_token"));
		portletPreferences.setValue(
			"marketplaceAccessTokenExpirationTime",
			String.valueOf(accessTokenExpirationTime));
		portletPreferences.setValue("marketplaceCode", code);
		portletPreferences.setValue(
			"marketplaceRefreshToken", jsonObject.getString("refresh_token"));
		portletPreferences.setValue("marketplaceServiceURL", serviceURL);
		portletPreferences.setValue("marketplaceSettings", settings);

		portletPreferences.store();

		return jsonObject;
	}

	public static JSONObject getMarketplacePermissionsJSONObject(
			PermissionChecker permissionChecker)
		throws PortalException {

		JSONObject permissionJSONObject = JSONFactoryUtil.createJSONObject();

		for (String[] permission :
				new String[][] {
					{
							MarketplaceAppsPortletKeys.FRAGMENTS,
							MarketplaceActionKeys.PURCHASE_AND_INSTALL_FREE_APPS
					},
					{
							MarketplaceAppsPortletKeys.FRAGMENTS,
							MarketplaceActionKeys.PURCHASE_AND_INSTALL_PAID_APPS
					},
					{
							MarketplaceAppsPortletKeys.FRAGMENTS,
							MarketplaceActionKeys.VIEW_MARKETPLACE_APP
					},
					{
						MarketplaceAppsPortletKeys.GENERAL,
						MarketplaceActionKeys.CONNECT_TO_MARKETPLACE
					},
					{
						MarketplaceAppsPortletKeys.GENERAL,
						MarketplaceActionKeys.GET_AUTHORIZATION
					}
				}) {

			permissionJSONObject.put(
				permissionAction,
				PortletPermissionUtil.contains(
					permissionChecker, permission[1], permission[0]));
		}

		return permissionJSONObject;
	}

}