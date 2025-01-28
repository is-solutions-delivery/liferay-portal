/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.settings.web.internal.application.list;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelApp;
import com.liferay.marketplace.settings.web.internal.constants.MarketplaceAppsPortletKeys;
import com.liferay.marketplace.settings.web.internal.constants.MarketplacePanelCategoryKeys;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.security.permission.PermissionChecker;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Stefano Motta
 */
@Component(
	property = {
		"panel.app.order:Integer=100",
		"panel.category.key=" + MarketplacePanelCategoryKeys.MARKETPLACE_APPS
	},
	service = PanelApp.class
)
public class MarketplaceAppsGeneralPermissionsPanelApp extends BasePanelApp {

	@Override
	public Portlet getPortlet() {
		return _portlet;
	}

	@Override
	public String getPortletId() {
		return MarketplaceAppsPortletKeys.GENERAL;
	}

	@Override
	public boolean isShow(PermissionChecker permissionChecker, Group group) {
		return false;
	}

	@Reference(
		target = "(javax.portlet.name=" + MarketplaceAppsPortletKeys.GENERAL + ")"
	)
	private Portlet _portlet;

}