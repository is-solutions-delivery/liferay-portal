/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace.settings.web.internal.application.list;

import com.liferay.application.list.BasePanelCategory;
import com.liferay.application.list.PanelCategory;
import com.liferay.application.list.constants.PanelCategoryKeys;
import com.liferay.marketplace.settings.web.internal.constants.MarketplacePanelCategoryKeys;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.security.permission.PermissionChecker;

import java.util.Locale;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Alessio Antonio Rendina
 */
@Component(
	property = {
		"panel.category.key=" + PanelCategoryKeys.MARKETPLACE,
		"panel.category.order:Integer=500"
	},
	service = PanelCategory.class
)
public class MarketplacePanelCategory extends BasePanelCategory {

	@Override
	public String getKey() {
		return MarketplacePanelCategoryKeys.MARKETPLACE_APPS;
	}

	@Override
	public String getLabel(Locale locale) {
		return _language.get(locale, "apps");
	}

	@Override
	public boolean isShow(PermissionChecker permissionChecker, Group group) {
		return false;
	}

	@Reference
	private Language _language;

}