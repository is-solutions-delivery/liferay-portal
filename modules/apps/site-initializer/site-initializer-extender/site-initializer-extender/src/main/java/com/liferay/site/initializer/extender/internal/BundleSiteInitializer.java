/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.site.initializer.extender.internal;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.liferay.asset.list.model.AssetListEntry;
import com.liferay.asset.list.service.AssetListEntryLocalService;
import com.liferay.document.library.kernel.service.DLAppLocalServiceUtil;
import com.liferay.document.library.util.DLURLHelper;
import com.liferay.dynamic.data.mapping.constants.DDMTemplateConstants;
import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalService;
import com.liferay.dynamic.data.mapping.service.DDMTemplateLocalService;
import com.liferay.dynamic.data.mapping.util.DefaultDDMStructureHelper;
import com.liferay.fragment.importer.FragmentsImporter;
import com.liferay.headless.admin.taxonomy.dto.v1_0.TaxonomyCategory;
import com.liferay.headless.admin.taxonomy.dto.v1_0.TaxonomyVocabulary;
import com.liferay.headless.admin.taxonomy.resource.v1_0.TaxonomyCategoryResource;
import com.liferay.headless.admin.taxonomy.resource.v1_0.TaxonomyVocabularyResource;
import com.liferay.headless.commerce.admin.catalog.dto.v1_0.Catalog;
import com.liferay.headless.commerce.admin.catalog.resource.v1_0.CatalogResource;
import com.liferay.headless.commerce.admin.channel.dto.v1_0.Channel;
import com.liferay.headless.commerce.admin.channel.resource.v1_0.ChannelResource;
import com.liferay.headless.delivery.dto.v1_0.Document;
import com.liferay.headless.delivery.dto.v1_0.DocumentFolder;
import com.liferay.headless.delivery.dto.v1_0.StructuredContentFolder;
import com.liferay.headless.delivery.resource.v1_0.DocumentFolderResource;
import com.liferay.headless.delivery.resource.v1_0.DocumentResource;
import com.liferay.headless.delivery.resource.v1_0.StructuredContentFolderResource;
import com.liferay.journal.constants.JournalArticleConstants;
import com.liferay.journal.constants.JournalFolderConstants;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalService;
import com.liferay.layout.page.template.importer.LayoutPageTemplatesImporter;
import com.liferay.layout.page.template.model.LayoutPageTemplateEntry;
import com.liferay.layout.page.template.model.LayoutPageTemplateStructure;
import com.liferay.layout.page.template.service.LayoutPageTemplateEntryLocalService;
import com.liferay.layout.page.template.service.LayoutPageTemplateStructureLocalService;
import com.liferay.layout.util.LayoutCopyHelper;
import com.liferay.layout.util.structure.LayoutStructure;
import com.liferay.object.admin.rest.dto.v1_0.ObjectDefinition;
import com.liferay.object.admin.rest.resource.v1_0.ObjectDefinitionResource;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.LayoutSet;
import com.liferay.portal.kernel.model.Theme;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.LayoutLocalService;
import com.liferay.portal.kernel.service.LayoutSetLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ThemeLocalService;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.template.TemplateConstants;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.CalendarFactoryUtil;
import com.liferay.portal.kernel.util.FileUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.MimeTypesUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.SetUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.UnicodeProperties;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.kernel.zip.ZipWriter;
import com.liferay.portal.kernel.zip.ZipWriterFactoryUtil;
import com.liferay.portal.vulcan.multipart.BinaryFile;
import com.liferay.portal.vulcan.multipart.MultipartBody;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.segments.constants.SegmentsExperienceConstants;
import com.liferay.site.exception.InitializationException;
import com.liferay.site.initializer.SiteInitializer;
import com.liferay.site.navigation.menu.item.layout.constants.SiteNavigationMenuItemTypeConstants;
import com.liferay.site.navigation.model.SiteNavigationMenu;
import com.liferay.site.navigation.service.SiteNavigationMenuItemLocalService;
import com.liferay.site.navigation.service.SiteNavigationMenuLocalService;
import com.liferay.site.navigation.type.SiteNavigationMenuItemType;
import com.liferay.site.navigation.type.SiteNavigationMenuItemTypeRegistry;
import com.liferay.style.book.zip.processor.StyleBookEntryZipProcessor;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.LayoutConstants;


import java.io.File;
import java.io.InputStream;

import java.net.URL;
import java.net.URLConnection;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import javax.servlet.ServletContext;

import org.osgi.framework.Bundle;
import org.osgi.framework.wiring.BundleWiring;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Brian Wing Shun Chan
 */
public class BundleSiteInitializer implements SiteInitializer {

	public BundleSiteInitializer(
		AssetListEntryLocalService assetListEntryLocalService, Bundle bundle,
		CatalogResource.Factory catalogResourceFactory,
		ChannelResource.Factory channelResourceFactory,
		DDMStructureLocalService ddmStructureLocalService,
		DDMTemplateLocalService ddmTemplateLocalService,
		DefaultDDMStructureHelper defaultDDMStructureHelper,
		DLURLHelper dlURLHelper,
		DocumentFolderResource.Factory documentFolderResourceFactory,
		DocumentResource.Factory documentResourceFactory,
		FragmentsImporter fragmentsImporter,
		GroupLocalService groupLocalService,
		JournalArticleLocalService journalArticleLocalService,
		JSONFactory jsonFactory,
		LayoutCopyHelper layoutCopyHelper,
		LayoutLocalService layoutLocalService,
		LayoutPageTemplateEntryLocalService layoutPageTemplateEntryLocalService,
		LayoutPageTemplatesImporter layoutPageTemplatesImporter,
		LayoutPageTemplateStructureLocalService
			layoutPageTemplateStructureLocalService,
		LayoutSetLocalService layoutSetLocalService,
		ObjectDefinitionResource.Factory objectDefinitionResourceFactory,
		Portal portal, ServletContext servletContext,
		SiteNavigationMenuItemLocalService siteNavigationMenuItemLocalService,
		SiteNavigationMenuItemTypeRegistry siteNavigationMenuItemTypeRegistry,
		SiteNavigationMenuLocalService siteNavigationMenuLocalService,
		StructuredContentFolderResource.Factory
			structuredContentFolderResourceFactory,
		StyleBookEntryZipProcessor styleBookEntryZipProcessor,
		TaxonomyCategoryResource.Factory taxonomyCategoryResourceFactory,
		TaxonomyVocabularyResource.Factory taxonomyVocabularyResourceFactory,
		ThemeLocalService themeLocalService,
		UserLocalService userLocalService) {

		_assetListEntryLocalService = assetListEntryLocalService;
		_bundle = bundle;
		_catalogResourceFactory = catalogResourceFactory;
		_channelResourceFactory = channelResourceFactory;
		_ddmStructureLocalService = ddmStructureLocalService;
		_ddmTemplateLocalService = ddmTemplateLocalService;
		_defaultDDMStructureHelper = defaultDDMStructureHelper;
		_dlURLHelper = dlURLHelper;
		_documentFolderResourceFactory = documentFolderResourceFactory;
		_documentResourceFactory = documentResourceFactory;
		_fragmentsImporter = fragmentsImporter;
		_groupLocalService = groupLocalService;
		_journalArticleLocalService = journalArticleLocalService;
		_jsonFactory = jsonFactory;
		_layoutCopyHelper = layoutCopyHelper;
		_layoutLocalService = layoutLocalService;
		_layoutPageTemplateEntryLocalService =
			layoutPageTemplateEntryLocalService;
		_layoutPageTemplatesImporter = layoutPageTemplatesImporter;
		_layoutPageTemplateStructureLocalService = layoutPageTemplateStructureLocalService;
		_layoutSetLocalService = layoutSetLocalService;
		_objectDefinitionResourceFactory = objectDefinitionResourceFactory;
		_portal = portal;
		_servletContext = servletContext;
		_siteNavigationMenuItemLocalService = siteNavigationMenuItemLocalService;
		_siteNavigationMenuItemTypeRegistry = siteNavigationMenuItemTypeRegistry;
		_siteNavigationMenuLocalService = siteNavigationMenuLocalService;
		_structuredContentFolderResourceFactory =
			structuredContentFolderResourceFactory;
		_styleBookEntryZipProcessor = styleBookEntryZipProcessor;
		_taxonomyCategoryResourceFactory = taxonomyCategoryResourceFactory;
		_taxonomyVocabularyResourceFactory = taxonomyVocabularyResourceFactory;
		_themeLocalService = themeLocalService;
		_userLocalService = userLocalService;

		BundleWiring bundleWiring = _bundle.adapt(BundleWiring.class);

		_classLoader = bundleWiring.getClassLoader();
	}

	@Override
	public String getDescription(Locale locale) {
		return StringPool.BLANK;
	}

	@Override
	public String getKey() {
		return _bundle.getSymbolicName();
	}

	@Override
	public String getName(Locale locale) {
		Dictionary<String, String> headers = _bundle.getHeaders(
			StringPool.BLANK);

		return GetterUtil.getString(headers.get("Bundle-Name"));
	}

	@Override
	public String getThumbnailSrc() {
		return _servletContext.getContextPath() + "/images/thumbnail.png";
	}

	@Override
	public void initialize(long groupId) throws InitializationException {
		try {
			User user = _userLocalService.getUser(
				PrincipalThreadLocal.getUserId());

			ServiceContext serviceContext = new ServiceContext() {
				{
					setAddGroupPermissions(true);
					setAddGuestPermissions(true);
					setCompanyId(user.getCompanyId());
					setScopeGroupId(groupId);
					setTimeZone(user.getTimeZone());
					setUserId(user.getUserId());
				}
			};

			_addDDMStructures(serviceContext);

			Map<String, String> documentsStringUtilReplaceValues =
				_addDocuments(serviceContext);

			_addAssetListEntries(serviceContext);
			_addCommerceCatalogs(serviceContext);
			_addCommerceChannels(serviceContext);
			_addDDMTemplates(serviceContext);
			_addFragmentEntries(serviceContext);
			_addJournalArticles(
				documentsStringUtilReplaceValues, serviceContext);
			_addObjectDefinitions(serviceContext);

			Map<String, List<SiteNavigationMenu>> layoutsSiteNavigationMenuMap =
				new HashMap<>();

			_addSiteNavigationMenus(
				layoutsSiteNavigationMenuMap, serviceContext);

			_addLayoutPageTemplateEntries(serviceContext);

			_setDefaultLayoutPageTemplateEntries(serviceContext);

			_addLayouts(layoutsSiteNavigationMenuMap, serviceContext);

			_addStyleBookEntries(serviceContext);
			_addTaxonomyVocabularies(serviceContext);

			_updateLayoutSetLookAndFeel("private", serviceContext);
			_updateLayoutSetLookAndFeel("public", serviceContext);
		}
		catch (Exception exception) {
			throw new InitializationException(exception);
		}
	}

	@Override
	public boolean isActive(long companyId) {
		return true;
	}

	private void _addAssetListEntries(ServiceContext serviceContext)
		throws Exception {

		String json = _read("/site-initializer/asset-list-entries.json");

		if (json == null) {
			return;
		}

		JSONArray assetListJSONArray = JSONFactoryUtil.createJSONArray(json);

		for (int i = 0; i < assetListJSONArray.length(); i++) {
			JSONObject assetListJSONObject = assetListJSONArray.getJSONObject(
				i);

			_addAssetListEntry(assetListJSONObject, serviceContext);
		}
	}

	private void _updateLayoutSetLookAndFeel(String type, ServiceContext serviceContext) throws Exception {
		boolean privateLayoutSet = false;

		if (Objects.equals(type, "private")) {
			privateLayoutSet = true;
		}

		LayoutSet layoutSet = _layoutSetLocalService.fetchLayoutSet(
			serviceContext.getScopeGroupId(), privateLayoutSet);

		UnicodeProperties settingsUnicodeProperties =
			layoutSet.getSettingsProperties();

		UnicodeProperties themeSettingsUnicodeProperties =
			new UnicodeProperties(true);

		themeSettingsUnicodeProperties.fastLoad(
			_read("site-initializer/layout-set/" + type + "/theme.properties"));

		settingsUnicodeProperties.putAll(themeSettingsUnicodeProperties);

		_layoutSetLocalService.updateSettings(
			serviceContext.getScopeGroupId(), privateLayoutSet,
			settingsUnicodeProperties.toString());

		_layoutSetLocalService.updateLookAndFeel(
			serviceContext.getScopeGroupId(), privateLayoutSet,
			layoutSet.getThemeId(), layoutSet.getColorSchemeId(),
			_read("site-initializer/layout-set/" + type + "/css.css"));

		URL logoURL = _bundle.getEntry(
			StringBundler.concat( "site-initializer/layout-set/", type, "/logo.png"));

		if (logoURL != null) {
			File file = FileUtil.createTempFile(logoURL.openStream());

			_layoutSetLocalService.updateLogo(
				serviceContext.getScopeGroupId(), privateLayoutSet, true,
				file);
		}
	}

	private void _addLayouts(Map<String, List<SiteNavigationMenu>> layoutsSiteNavigationMenuMap, ServiceContext serviceContext) throws Exception {

		JSONArray layoutsJSONArray = JSONFactoryUtil.createJSONArray(
			_read("/site-initializer/layouts/layouts.json"));

		Map<String, String> resourcesMap = _getResourcesMap(serviceContext);

		for (int i = 0; i < layoutsJSONArray.length(); i++) {
			JSONObject jsonObject = layoutsJSONArray.getJSONObject(i);

			String path = jsonObject.getString("path");

			JSONObject pageJSONObject = JSONFactoryUtil.createJSONObject(
				_read(StringBundler.concat("/site-initializer/layouts/", path, "/page.json")));

			String type = StringUtil.toLowerCase(
				pageJSONObject.getString("type"));

			Layout layout = null;

			if (StringUtil.equals(LayoutConstants.TYPE_CONTENT, type) ||
				StringUtil.equals(LayoutConstants.TYPE_COLLECTION, type)) {

				String pageDefinitionJSON = StringUtil.replace(
					_read(
						StringBundler.concat(
							"/site-initializer/layouts/", path, "/page-definition.json")),
					"\"[$", "$]\"", resourcesMap);

				layout = _addContentLayout(
					pageJSONObject,
					JSONFactoryUtil.createJSONObject(pageDefinitionJSON),
					resourcesMap, serviceContext);
			}
			else {
				layout = _layoutLocalService.addLayout(
					serviceContext.getUserId(), serviceContext.getScopeGroupId(),
					false, LayoutConstants.DEFAULT_PARENT_LAYOUT_ID,
					HashMapBuilder.put(
						LocaleUtil.getSiteDefault(), pageJSONObject.getString("name")
					).build(),
					new HashMap<>(), new HashMap<>(), new HashMap<>(), new HashMap<>(),
					LayoutConstants.TYPE_PORTLET, null, false, false, new HashMap<>(),
					serviceContext);
			}

			_addNavigationMenuItems(layout, layoutsSiteNavigationMenuMap, serviceContext);

		}
	}

	private Map<String, String> _getResourcesMap(ServiceContext serviceContext) {
		Map<String, String> resourcesMap = new HashMap<>();

		List<JournalArticle> articles = _journalArticleLocalService.getArticles(
			serviceContext.getScopeGroupId());

		for (JournalArticle article : articles) {
			resourcesMap.put(
				article.getArticleId(),
				String.valueOf(article.getResourcePrimKey()));
		}

		List<AssetListEntry> assetListEntries =
			_assetListEntryLocalService.getAssetListEntries(
				serviceContext.getScopeGroupId());

		for (AssetListEntry assetListEntry : assetListEntries) {
			resourcesMap.put(
				StringUtil.toUpperCase(assetListEntry.getAssetListEntryKey()),
				String.valueOf(assetListEntry.getAssetListEntryId()));
		}

		return resourcesMap;
	}

	private Layout _addContentLayout(
		JSONObject pageJSONObject, JSONObject pageDefinitionJSONObject,
		Map<String, String> resourcesMap, ServiceContext serviceContext)
		throws Exception {

		String type = StringUtil.toLowerCase(pageJSONObject.getString("type"));

		Layout layout = _layoutLocalService.addLayout(
			serviceContext.getUserId(), serviceContext.getScopeGroupId(),
			pageJSONObject.getBoolean("private"),
			LayoutConstants.DEFAULT_PARENT_LAYOUT_ID,
			HashMapBuilder.put(
				LocaleUtil.getSiteDefault(), pageJSONObject.getString("name")
			).build(),
			new HashMap<>(), new HashMap<>(), new HashMap<>(), new HashMap<>(),
			type, null, false, false, new HashMap<>(), serviceContext);

		Layout draftLayout = layout.fetchDraftLayout();

		_importPageDefinition(draftLayout, pageDefinitionJSONObject);

		if (Objects.equals(LayoutConstants.TYPE_COLLECTION, type)) {
			UnicodeProperties typeSettingsUnicodeProperties =
				draftLayout.getTypeSettingsProperties();

			typeSettingsUnicodeProperties.setProperty(
				"collectionPK",
				resourcesMap.get(pageJSONObject.getString("collectionKey")));
			typeSettingsUnicodeProperties.setProperty(
				"collectionType",
				"com.liferay.item.selector.criteria." +
				"InfoListItemSelectorReturnType");

			draftLayout = _layoutLocalService.updateLayout(
				serviceContext.getScopeGroupId(),
				draftLayout.isPrivateLayout(), draftLayout.getLayoutId(),
				typeSettingsUnicodeProperties.toString());
		}

		JSONObject settingsJSONObject = pageDefinitionJSONObject.getJSONObject(
			"settings");

		if (settingsJSONObject != null) {
			draftLayout = _updateLayoutTypeSettings(
				draftLayout, settingsJSONObject);
		}

		layout = _layoutCopyHelper.copyLayout(draftLayout, layout);

		_layoutLocalService.updateStatus(
			layout.getUserId(), layout.getPlid(),
			WorkflowConstants.STATUS_APPROVED, serviceContext);

		_layoutLocalService.updateStatus(
			layout.getUserId(), draftLayout.getPlid(),
			WorkflowConstants.STATUS_APPROVED, serviceContext);

		return layout;
	}

	private void _importPageDefinition(
		Layout draftLayout, JSONObject pageDefinitionJSONObject)
		throws Exception {

		if (!pageDefinitionJSONObject.has("pageElement")) {
			return;
		}

		JSONObject jsonObject = pageDefinitionJSONObject.getJSONObject(
			"pageElement");

		String type = jsonObject.getString("type");

		if (Validator.isNull(type) || !Objects.equals(type, "Root")) {
			return;
		}

		LayoutPageTemplateStructure layoutPageTemplateStructure =
			_layoutPageTemplateStructureLocalService.
				fetchLayoutPageTemplateStructure(
					draftLayout.getGroupId(), draftLayout.getPlid(), true);

		LayoutStructure layoutStructure = LayoutStructure.of(
			layoutPageTemplateStructure.getData(
				SegmentsExperienceConstants.ID_DEFAULT));

		JSONArray pageElementsJSONArray = jsonObject.getJSONArray(
			"pageElements");

		for (int j = 0; j < pageElementsJSONArray.length(); j++) {
			_layoutPageTemplatesImporter.importPageElement(
				draftLayout, layoutStructure, layoutStructure.getMainItemId(),
				pageElementsJSONArray.getString(j), j);
		}
	}

	private Layout _updateLayoutTypeSettings(
		Layout layout, JSONObject settingsJSONObject)
		throws Exception {

		UnicodeProperties unicodeProperties =
			layout.getTypeSettingsProperties();

		JSONObject themeSettingsJSONObject = settingsJSONObject.getJSONObject(
			"themeSettings");

		Set<Map.Entry<String, String>> entrySet = unicodeProperties.entrySet();

		entrySet.removeIf(
			entry -> {
				String key = entry.getKey();

				return key.startsWith("lfr-theme:");
			});

		if (themeSettingsJSONObject != null) {
			for (String key : themeSettingsJSONObject.keySet()) {
				unicodeProperties.put(
					key, themeSettingsJSONObject.getString(key));
			}

			layout = _layoutLocalService.updateLayout(
				layout.getGroupId(), layout.isPrivateLayout(),
				layout.getLayoutId(), unicodeProperties.toString());

			layout.setTypeSettingsProperties(unicodeProperties);
		}

		String themeId = layout.getThemeId();

		String themeName = settingsJSONObject.getString("themeName");

		if (Validator.isNotNull(themeName)) {
			themeId = _getThemeId(layout.getCompanyId(), themeName);
		}

		String colorSchemeName = settingsJSONObject.getString(
			"colorSchemeName", layout.getColorSchemeId());

		String css = settingsJSONObject.getString("css", layout.getCss());

		layout = _layoutLocalService.updateLookAndFeel(
			layout.getGroupId(), layout.isPrivateLayout(), layout.getLayoutId(),
			themeId, colorSchemeName, css);

		JSONObject masterPageJSONObject = settingsJSONObject.getJSONObject(
			"masterPage");

		if (masterPageJSONObject != null) {
			LayoutPageTemplateEntry masterLayoutPageTemplateEntry =
				_layoutPageTemplateEntryLocalService.
					fetchLayoutPageTemplateEntry(
						layout.getGroupId(),
						masterPageJSONObject.getString("key"));

			if (masterLayoutPageTemplateEntry != null) {
				layout = _layoutLocalService.updateMasterLayoutPlid(
					layout.getGroupId(), layout.isPrivateLayout(),
					layout.getLayoutId(),
					masterLayoutPageTemplateEntry.getPlid());
			}
		}

		return layout;
	}

	private String _getThemeId(long companyId, String themeName) {
		List<Theme> themes = ListUtil.filter(
			_themeLocalService.getThemes(companyId),
			theme -> Objects.equals(theme.getName(), themeName));

		if (ListUtil.isNotEmpty(themes)) {
			Theme theme = themes.get(0);

			return theme.getThemeId();
		}

		return null;
	}

	private void _addNavigationMenuItems(Layout layout, Map<String, List<SiteNavigationMenu>> layoutsSiteNavigationMenuMap, ServiceContext serviceContext) throws Exception {
		if (layout == null) {
			return;
		}

		List<SiteNavigationMenu> siteNavigationMenus =
			layoutsSiteNavigationMenuMap.get(
				StringUtil.toLowerCase(
					layout.getName(LocaleUtil.getSiteDefault())));

		if (ListUtil.isEmpty(siteNavigationMenus)) {
			return;
		}

		SiteNavigationMenuItemType siteNavigationMenuItemType =
			_siteNavigationMenuItemTypeRegistry.getSiteNavigationMenuItemType(
				SiteNavigationMenuItemTypeConstants.LAYOUT);

		for (SiteNavigationMenu siteNavigationMenu : siteNavigationMenus) {
			_siteNavigationMenuItemLocalService.addSiteNavigationMenuItem(
				serviceContext.getUserId(), serviceContext.getScopeGroupId(),
				siteNavigationMenu.getSiteNavigationMenuId(), 0,
				SiteNavigationMenuItemTypeConstants.LAYOUT,
				siteNavigationMenuItemType.getTypeSettingsFromLayout(layout),
				serviceContext);
		}
	}

	private void _addAssetListEntry(
			JSONObject assetListJSONObject, ServiceContext serviceContext)
		throws Exception {

		JSONObject unicodePropertiesJSONObject =
			assetListJSONObject.getJSONObject("unicodeProperties");

		DDMStructure ddmStructure = _ddmStructureLocalService.getStructure(
			serviceContext.getScopeGroupId(),
			_portal.getClassNameId(
				unicodePropertiesJSONObject.getString("classNameIds")),
			assetListJSONObject.getString("ddmStructureKey"));

		Map<String, String> map = HashMapBuilder.put(
			"anyAssetType",
			String.valueOf(
				_portal.getClassNameId(
					unicodePropertiesJSONObject.getString("classNameIds")))
		).put(
			unicodePropertiesJSONObject.getString("anyClassType"),
			String.valueOf(ddmStructure.getStructureId())
		).put(
			"classNameIds",
			unicodePropertiesJSONObject.getString("classNameIds")
		).put(
			unicodePropertiesJSONObject.getString("classTypeIds"),
			String.valueOf(ddmStructure.getStructureId())
		).put(
			"groupIds", String.valueOf(serviceContext.getScopeGroupId())
		).build();

		Object[] orderByObjects = JSONUtil.toObjectArray(
			unicodePropertiesJSONObject.getJSONArray("orderBy"));

		for (Object orderByObject : orderByObjects) {
			JSONObject orderByJSONObject = (JSONObject)orderByObject;

			map.put(
				orderByJSONObject.getString("key"),
				orderByJSONObject.getString("value"));
		}

		String[] assetTagNames = JSONUtil.toStringArray(
			assetListJSONObject.getJSONArray("tags"));

		for (int i = 0; i < assetTagNames.length; i++) {
			map.put("queryValues" + i, assetTagNames[i]);

			Object[] queryObjects = JSONUtil.toObjectArray(
				unicodePropertiesJSONObject.getJSONArray("query"));

			for (Object queryObject : queryObjects) {
				JSONObject queryJSONObject = (JSONObject)queryObject;

				map.put(
					queryJSONObject.getString("key"),
					queryJSONObject.getString("value"));
			}
		}

		_assetListEntryLocalService.addDynamicAssetListEntry(
			serviceContext.getUserId(), serviceContext.getScopeGroupId(),
			assetListJSONObject.getString("title"),
			String.valueOf(new UnicodeProperties(map, true)), serviceContext);
	}

	private void _addCommerceCatalogs(ServiceContext serviceContext)
		throws Exception {

		_addCommerceCatalogs(
			"/site-initializer/commerce-catalogs", serviceContext);
	}

	private void _addCommerceCatalogs(
			String parentResourcePath, ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		CatalogResource.Builder catalogResourceBuilder =
			_catalogResourceFactory.create();

		CatalogResource catalogResource = catalogResourceBuilder.user(
			serviceContext.fetchUser()
		).build();

		for (String resourcePath : resourcePaths) {
			String json = _read(resourcePath);

			Catalog catalog = Catalog.toDTO(json);

			if (catalog == null) {
				_log.error(
					"Unable to transform commerce catalog from JSON: " + json);

				continue;
			}

			catalogResource.postCatalog(catalog);
		}
	}

	private void _addCommerceChannels(ServiceContext serviceContext)
		throws Exception {

		_addCommerceChannels(
			"/site-initializer/commerce-channels", serviceContext);
	}

	private void _addCommerceChannels(
			String parentResourcePath, ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		ChannelResource.Builder channelResourceBuilder =
			_channelResourceFactory.create();

		ChannelResource channelResource = channelResourceBuilder.user(
			serviceContext.fetchUser()
		).build();

		for (String resourcePath : resourcePaths) {
			String json = _read(resourcePath);

			Channel channel = Channel.toDTO(json);

			if (channel == null) {
				_log.error(
					"Unable to transform commerce channel from JSON: " + json);

				continue;
			}

			channelResource.postChannel(channel);
		}
	}

	private void _addDDMStructures(ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			"/site-initializer/ddm-structures");

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		for (String resourcePath : resourcePaths) {
			_defaultDDMStructureHelper.addDDMStructures(
				serviceContext.getUserId(), serviceContext.getScopeGroupId(),
				_portal.getClassNameId(JournalArticle.class), _classLoader,
				resourcePath, serviceContext);
		}
	}

	private void _addDDMTemplates(ServiceContext serviceContext)
		throws Exception {

		Enumeration<URL> enumeration = _bundle.findEntries(
			"/site-initializer/ddm-templates", "ddm-template.json", true);

		if (enumeration == null) {
			return;
		}

		while (enumeration.hasMoreElements()) {
			URL url = enumeration.nextElement();

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject(
				StringUtil.read(url.openStream()));

			DDMStructure ddmStructure =
				_ddmStructureLocalService.fetchStructure(
					serviceContext.getScopeGroupId(),
					_portal.getClassNameId(JournalArticle.class),
					jsonObject.getString("ddmStructureKey"));

			_ddmTemplateLocalService.addTemplate(
				serviceContext.getUserId(), serviceContext.getScopeGroupId(),
				_portal.getClassNameId(DDMStructure.class),
				ddmStructure.getStructureId(),
				_portal.getClassNameId(JournalArticle.class),
				jsonObject.getString("ddmTemplateKey"),
				HashMapBuilder.put(
					LocaleUtil.getSiteDefault(), jsonObject.getString("name")
				).build(),
				null, DDMTemplateConstants.TEMPLATE_TYPE_DISPLAY, null,
				TemplateConstants.LANG_TYPE_FTL, _read("ddm-template.ftl", url),
				false, false, null, null, serviceContext);
		}
	}

	private Long _addDocumentFolder(
			Long documentFolderId, String resourcePath,
			ServiceContext serviceContext)
		throws Exception {

		DocumentFolderResource.Builder documentFolderResourceBuilder =
			_documentFolderResourceFactory.create();

		DocumentFolderResource documentFolderResource =
			documentFolderResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		DocumentFolder documentFolder = null;

		resourcePath = resourcePath.substring(0, resourcePath.length() - 1);

		String json = _read(resourcePath + "._si.json");

		if (json != null) {
			documentFolder = DocumentFolder.toDTO(json);
		}
		else {
			documentFolder = DocumentFolder.toDTO(
				JSONUtil.put(
					"name", FileUtil.getShortFileName(resourcePath)
				).toString());
		}

		if (documentFolderId != null) {
			documentFolder =
				documentFolderResource.postDocumentFolderDocumentFolder(
					documentFolderId, documentFolder);
		}
		else {
			documentFolder = documentFolderResource.postSiteDocumentFolder(
				serviceContext.getScopeGroupId(), documentFolder);
		}

		return documentFolder.getId();
	}

	private Map<String, String> _addDocuments(
			Long documentFolderId, String parentResourcePath,
			ServiceContext serviceContext)
		throws Exception {

		Map<String, String> documentsStringUtilReplaceValues = new HashMap<>();

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return documentsStringUtilReplaceValues;
		}

		DocumentResource.Builder documentResourceBuilder =
			_documentResourceFactory.create();

		DocumentResource documentResource = documentResourceBuilder.user(
			serviceContext.fetchUser()
		).build();

		for (String resourcePath : resourcePaths) {
			if (resourcePath.endsWith("/")) {
				documentsStringUtilReplaceValues.putAll(
					_addDocuments(
						_addDocumentFolder(
							documentFolderId, resourcePath, serviceContext),
						resourcePath, serviceContext));

				continue;
			}

			if (resourcePath.endsWith("._si.json")) {
				continue;
			}

			String fileName = FileUtil.getShortFileName(resourcePath);

			URL url = _servletContext.getResource(resourcePath);

			URLConnection urlConnection = url.openConnection();

			Map<String, String> values = new HashMap<>();

			String json = _read(resourcePath + "._si.json");

			if (json != null) {
				values = Collections.singletonMap("document", json);
			}

			Document document = null;

			if (documentFolderId != null) {
				document = documentResource.postDocumentFolderDocument(
					documentFolderId,
					MultipartBody.of(
						Collections.singletonMap(
							"file",
							new BinaryFile(
								MimeTypesUtil.getContentType(fileName),
								fileName, urlConnection.getInputStream(),
								urlConnection.getContentLength())),
						__ -> _objectMapper, values));
			}
			else {
				document = documentResource.postSiteDocument(
					serviceContext.getScopeGroupId(),
					MultipartBody.of(
						Collections.singletonMap(
							"file",
							new BinaryFile(
								MimeTypesUtil.getContentType(fileName),
								fileName, urlConnection.getInputStream(),
								urlConnection.getContentLength())),
						__ -> _objectMapper, values));
			}

			String key = resourcePath;

			FileEntry fileEntry = DLAppLocalServiceUtil.getFileEntry(
				document.getId());

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject(
				JSONFactoryUtil.looseSerialize(fileEntry));

			jsonObject.put("alt", StringPool.BLANK);

			documentsStringUtilReplaceValues.put(
				"DOCUMENT_JSON:" + key, jsonObject.toString());

			documentsStringUtilReplaceValues.put(
				"DOCUMENT_URL:" + key,
				_dlURLHelper.getPreviewURL(
					fileEntry, fileEntry.getFileVersion(), null,
					StringPool.BLANK, false, false));
		}

		return documentsStringUtilReplaceValues;
	}

	private Map<String, String> _addDocuments(ServiceContext serviceContext)
		throws Exception {

		return _addDocuments(
			null, "/site-initializer/documents", serviceContext);
	}

	private void _addFragmentEntries(ServiceContext serviceContext)
		throws Exception {

		URL url = _bundle.getEntry("/fragments.zip");

		if (url == null) {
			return;
		}

		_fragmentsImporter.importFragmentEntries(
			serviceContext.getUserId(), serviceContext.getScopeGroupId(), 0,
			FileUtil.createTempFile(url.openStream()), false);
	}

	private void _addJournalArticles(
			Long documentFolderId,
			Map<String, String> documentsStringUtilReplaceValues,
			String parentResourcePath, ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		for (String resourcePath : resourcePaths) {
			parentResourcePath = resourcePath.substring(
				0, resourcePath.length() - 1);

			if (resourcePath.endsWith("/") &&
				resourcePaths.contains(parentResourcePath + "._si.json")) {

				_addJournalArticles(
					_addStructuredContentFolders(
						documentFolderId, parentResourcePath, serviceContext),
					documentsStringUtilReplaceValues, resourcePath,
					serviceContext);

				continue;
			}

			if (resourcePath.endsWith("._si.json") ||
				resourcePath.endsWith(".xml") || resourcePath.endsWith("/")) {

				continue;
			}

			long journalFolderId =
				JournalFolderConstants.DEFAULT_PARENT_FOLDER_ID;

			if (documentFolderId != null) {
				journalFolderId = documentFolderId;
			}

			String json = _read(resourcePath);

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject(json);

			Map<Locale, String> titleMap = Collections.singletonMap(
				LocaleUtil.getSiteDefault(), jsonObject.getString("name"));

			Calendar calendar = CalendarFactoryUtil.getCalendar(
				serviceContext.getTimeZone());

			serviceContext.setAssetTagNames(
				JSONUtil.toStringArray(jsonObject.getJSONArray("tags")));

			_journalArticleLocalService.addArticle(
				null, serviceContext.getUserId(),
				serviceContext.getScopeGroupId(), journalFolderId,
				JournalArticleConstants.CLASS_NAME_ID_DEFAULT, 0,
				jsonObject.getString("articleId"), false, 1, titleMap, null,
				titleMap,
				StringUtil.replace(
					_read(StringUtil.replace(resourcePath, ".json", ".xml")),
					"[$", "$]", documentsStringUtilReplaceValues),
				jsonObject.getString("ddmStructureKey"),
				jsonObject.getString("ddmTemplateKey"), null,
				calendar.get(Calendar.MONTH),
				calendar.get(Calendar.DAY_OF_MONTH),
				calendar.get(Calendar.YEAR), calendar.get(Calendar.HOUR_OF_DAY),
				calendar.get(Calendar.MINUTE), 0, 0, 0, 0, 0, true, 0, 0, 0, 0,
				0, true, true, false, null, null, null, null, serviceContext);

			serviceContext.setAssetTagNames(null);
		}
	}

	private void _addJournalArticles(
			Map<String, String> documentsStringUtilReplaceValues,
			ServiceContext serviceContext)
		throws Exception {

		_addJournalArticles(
			null, documentsStringUtilReplaceValues,
			"/site-initializer/journal-articles", serviceContext);
	}

	private void _addLayoutPageTemplateEntries(ServiceContext serviceContext)
		throws Exception {

		JSONArray jsonArray = _jsonFactory.createJSONArray(
			_read(
				"/site-initializer/layout-page-templates" +
					"/layout-page-template-keys.json"));

		Object[] layoutPageTemplateObjects = JSONUtil.toObjectArray(jsonArray);

		Map<String, String> layoutPageTemplateKeys = new HashMap<>();

		for (Object layoutPageTemplateObject : layoutPageTemplateObjects) {
			JSONObject layoutPageTemplateJSONObject =
				(JSONObject)layoutPageTemplateObject;

			String key = layoutPageTemplateJSONObject.getString("key");

			String value = layoutPageTemplateJSONObject.getString("value");

			if (key.startsWith("LAYOUT_URL")) {
				layoutPageTemplateKeys.put(
					key, _getPrivateFriendlyURL(serviceContext, value));
			}
			else {
				layoutPageTemplateKeys.put(key, value);
			}
		}

		layoutPageTemplateKeys.put(
			"SCOPE_GROUP_ID", String.valueOf(serviceContext.getScopeGroupId()));

		Enumeration<URL> enumeration = _bundle.findEntries(
			"/site-initializer/layout-page-templates" +
				"/layout-page-template-definitions",
			StringPool.STAR, true);

		if (enumeration == null) {
			return;
		}

		ZipWriter zipWriter = ZipWriterFactoryUtil.getZipWriter();

		while (enumeration.hasMoreElements()) {
			URL url = enumeration.nextElement();

			if (StringUtil.endsWith(url.getPath(), ".json")) {
				String content = StringUtil.read(url.openStream());

				content = StringUtil.replace(
					content, "[$", "$]", layoutPageTemplateKeys);

				zipWriter.addEntry(
					StringUtil.removeSubstring(
						url.getPath(),
						"/site-initializer/layout-page-templates/"),
					content);
			}
			else {
				zipWriter.addEntry(
					StringUtil.removeSubstring(
						url.getPath(),
						"/site-initializer/layout-page-templates/"),
					url.openStream());
			}
		}

		_layoutPageTemplatesImporter.importFile(
			serviceContext.getUserId(), serviceContext.getScopeGroupId(),
			zipWriter.getFile(), false);
	}

	private void _addObjectDefinitions(ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			"/site-initializer/object-definitions");

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		ObjectDefinitionResource.Builder objectDefinitionResourceBuilder =
			_objectDefinitionResourceFactory.create();

		ObjectDefinitionResource objectDefinitionResource =
			objectDefinitionResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		for (String resourcePath : resourcePaths) {
			String json = _read(resourcePath);

			ObjectDefinition objectDefinition = ObjectDefinition.toDTO(json);

			if (objectDefinition == null) {
				_log.error(
					"Unable to transform object definition from JSON: " + json);

				continue;
			}

			try {
				objectDefinition =
					objectDefinitionResource.postObjectDefinition(
						objectDefinition);

				objectDefinitionResource.postObjectDefinitionPublish(
					objectDefinition.getId());
			}
			catch (Exception exception) {

				// TODO PUT

			}
		}
	}

	private void _addSiteNavigationMenus(
			Map<String, List<SiteNavigationMenu>> layoutsSiteNavigationMenuMap,
			ServiceContext serviceContext)
		throws Exception {

		String json = _read("/site-initializer/site-navigation-menus.json");

		if (json == null) {
			return;
		}

		JSONArray siteNavigationMenuJSONArray = JSONFactoryUtil.createJSONArray(
			json);

		for (int i = 0; i < siteNavigationMenuJSONArray.length(); i++) {
			JSONObject jsonObject = siteNavigationMenuJSONArray.getJSONObject(
				i);

			String name = jsonObject.getString("name");

			SiteNavigationMenu siteNavigationMenu =
				_siteNavigationMenuLocalService.addSiteNavigationMenu(
					serviceContext.getUserId(),
					serviceContext.getScopeGroupId(), name, serviceContext);

			JSONArray pagesJSONArray = jsonObject.getJSONArray("pages");

			for (int j = 0; j < pagesJSONArray.length(); j++) {
				List<SiteNavigationMenu> siteNavigationMenus =
					layoutsSiteNavigationMenuMap.computeIfAbsent(
						pagesJSONArray.getString(j), key -> new ArrayList<>());

				siteNavigationMenus.add(siteNavigationMenu);
			}
		}
	}

	private Long _addStructuredContentFolders(
			Long documentFolderId, String parentResourcePath,
			ServiceContext serviceContext)
		throws Exception {

		StructuredContentFolderResource.Builder
			structuredContentFolderResourceBuilder =
				_structuredContentFolderResourceFactory.create();

		StructuredContentFolderResource structuredContentFolderResource =
			structuredContentFolderResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		String json = _read(parentResourcePath + "._si.json");

		StructuredContentFolder structuredContentFolder =
			StructuredContentFolder.toDTO(json);

		if (documentFolderId != null) {
			structuredContentFolder =
				structuredContentFolderResource.
					postStructuredContentFolderStructuredContentFolder(
						documentFolderId, structuredContentFolder);
		}
		else {
			structuredContentFolder =
				structuredContentFolderResource.postSiteStructuredContentFolder(
					serviceContext.getScopeGroupId(), structuredContentFolder);
		}

		return structuredContentFolder.getId();
	}

	private void _addStyleBookEntries(ServiceContext serviceContext)
		throws Exception {

		URL url = _bundle.getEntry("/style-books.zip");

		if (url == null) {
			return;
		}

		_styleBookEntryZipProcessor.importStyleBookEntries(
			serviceContext.getUserId(), serviceContext.getScopeGroupId(),
			FileUtil.createTempFile(url.openStream()), false);
	}

	private void _addTaxonomyCategories(
			long groupId, String parentResourcePath,
			String parentTaxonomyCategoryId, ServiceContext serviceContext,
			long taxonomyVocabularyId)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		for (String resourcePath : resourcePaths) {
			if (resourcePath.endsWith("/")) {
				continue;
			}

			String json = _read(resourcePath);

			TaxonomyCategory taxonomyCategory = TaxonomyCategory.toDTO(json);

			if (taxonomyCategory == null) {
				_log.error(
					"Unable to transform taxonomy category from JSON: " + json);

				continue;
			}

			if (parentTaxonomyCategoryId == null) {
				taxonomyCategory = _addTaxonomyVocabularyTaxonomyCategory(
					serviceContext, taxonomyCategory, taxonomyVocabularyId);
			}
			else {
				taxonomyCategory = _addTaxonomyCategoryTaxonomyCategory(
					parentTaxonomyCategoryId, serviceContext, taxonomyCategory);
			}

			_addTaxonomyCategories(
				groupId, StringUtil.replaceLast(resourcePath, ".json", "/"),
				taxonomyCategory.getId(), serviceContext, taxonomyVocabularyId);
		}
	}

	private TaxonomyCategory _addTaxonomyCategoryTaxonomyCategory(
			String parentTaxonomyCategoryId, ServiceContext serviceContext,
			TaxonomyCategory taxonomyCategory)
		throws Exception {

		TaxonomyCategoryResource.Builder taxonomyCategoryResourceBuilder =
			_taxonomyCategoryResourceFactory.create();

		TaxonomyCategoryResource taxonomyCategoryResource =
			taxonomyCategoryResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		Page<TaxonomyCategory> taxonomyCategoryPage =
			taxonomyCategoryResource.getTaxonomyCategoryTaxonomyCategoriesPage(
				parentTaxonomyCategoryId, "",
				taxonomyCategoryResource.toFilter(
					StringBundler.concat(
						"name eq '", taxonomyCategory.getName(), "'")),
				null, null);

		TaxonomyCategory existingTaxonomyCategory =
			taxonomyCategoryPage.fetchFirstItem();

		if (existingTaxonomyCategory == null) {
			taxonomyCategory =
				taxonomyCategoryResource.postTaxonomyCategoryTaxonomyCategory(
					parentTaxonomyCategoryId, taxonomyCategory);
		}
		else {
			taxonomyCategory = taxonomyCategoryResource.patchTaxonomyCategory(
				existingTaxonomyCategory.getId(), taxonomyCategory);
		}

		return taxonomyCategory;
	}

	private void _addTaxonomyVocabularies(
			long groupId, String parentResourcePath,
			ServiceContext serviceContext)
		throws Exception {

		Set<String> resourcePaths = _servletContext.getResourcePaths(
			parentResourcePath);

		if (SetUtil.isEmpty(resourcePaths)) {
			return;
		}

		TaxonomyVocabularyResource.Builder taxonomyVocabularyResourceBuilder =
			_taxonomyVocabularyResourceFactory.create();

		TaxonomyVocabularyResource taxonomyVocabularyResource =
			taxonomyVocabularyResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		for (String resourcePath : resourcePaths) {
			if (resourcePath.endsWith("/")) {
				continue;
			}

			String json = _read(resourcePath);

			TaxonomyVocabulary taxonomyVocabulary = TaxonomyVocabulary.toDTO(
				json);

			if (taxonomyVocabulary == null) {
				_log.error(
					"Unable to transform taxonomy vocabulary from JSON: " +
						json);

				continue;
			}

			Page<TaxonomyVocabulary> taxonomyVocabularyPage =
				taxonomyVocabularyResource.getSiteTaxonomyVocabulariesPage(
					groupId, "",
					taxonomyVocabularyResource.toFilter(
						StringBundler.concat(
							"name eq '", taxonomyVocabulary.getName(), "'")),
					null, null);

			TaxonomyVocabulary existingTaxonomyVocabulary =
				taxonomyVocabularyPage.fetchFirstItem();

			if (existingTaxonomyVocabulary == null) {
				taxonomyVocabulary =
					taxonomyVocabularyResource.postSiteTaxonomyVocabulary(
						groupId, taxonomyVocabulary);
			}
			else {
				taxonomyVocabulary =
					taxonomyVocabularyResource.patchTaxonomyVocabulary(
						existingTaxonomyVocabulary.getId(), taxonomyVocabulary);
			}

			_addTaxonomyCategories(
				groupId, StringUtil.replaceLast(resourcePath, ".json", "/"),
				null, serviceContext, taxonomyVocabulary.getId());
		}
	}

	private void _addTaxonomyVocabularies(ServiceContext serviceContext)
		throws Exception {

		Group group = _groupLocalService.getCompanyGroup(
			serviceContext.getCompanyId());

		_addTaxonomyVocabularies(
			group.getGroupId(),
			"/site-initializer/taxonomy-vocabularies/company", serviceContext);

		_addTaxonomyVocabularies(
			serviceContext.getScopeGroupId(),
			"/site-initializer/taxonomy-vocabularies/group", serviceContext);
	}

	private TaxonomyCategory _addTaxonomyVocabularyTaxonomyCategory(
			ServiceContext serviceContext, TaxonomyCategory taxonomyCategory,
			long vocabularyId)
		throws Exception {

		TaxonomyCategoryResource.Builder taxonomyCategoryResourceBuilder =
			_taxonomyCategoryResourceFactory.create();

		TaxonomyCategoryResource taxonomyCategoryResource =
			taxonomyCategoryResourceBuilder.user(
				serviceContext.fetchUser()
			).build();

		Page<TaxonomyCategory> taxonomyCategoryPage =
			taxonomyCategoryResource.
				getTaxonomyVocabularyTaxonomyCategoriesPage(
					vocabularyId, "",
					taxonomyCategoryResource.toFilter(
						StringBundler.concat(
							"name eq '", taxonomyCategory.getName(), "'")),
					null, null);

		TaxonomyCategory existingTaxonomyCategory =
			taxonomyCategoryPage.fetchFirstItem();

		if (existingTaxonomyCategory == null) {
			taxonomyCategory =
				taxonomyCategoryResource.postTaxonomyVocabularyTaxonomyCategory(
					vocabularyId, taxonomyCategory);
		}
		else {
			taxonomyCategory = taxonomyCategoryResource.patchTaxonomyCategory(
				existingTaxonomyCategory.getId(), taxonomyCategory);
		}

		return taxonomyCategory;
	}

	private String _getPrivateFriendlyURL(
			ServiceContext serviceContext, String layoutName)
		throws Exception {

		Group scopeGroup = serviceContext.getScopeGroup();

		return StringBundler.concat(
			_portal.getPathFriendlyURLPrivateGroup(),
			scopeGroup.getFriendlyURL(), StringPool.FORWARD_SLASH, layoutName);
	}

	private String _read(String resourcePath) throws Exception {
		InputStream inputStream = _servletContext.getResourceAsStream(
			resourcePath);

		if (inputStream == null) {
			return null;
		}

		return StringUtil.read(inputStream);
	}

	private String _read(String fileName, URL url) throws Exception {
		String path = url.getPath();

		URL entryURL = _bundle.getEntry(
			path.substring(0, path.lastIndexOf("/") + 1) + fileName);

		return StringUtil.read(entryURL.openStream());
	}

	private void _setDefaultLayoutPageTemplateEntries(
			ServiceContext serviceContext)
		throws Exception {

		JSONArray jsonArray = _jsonFactory.createJSONArray(
			_read(
				"/site-initializer/layout-page-templates" +
					"/layout-page-template-entries-default.json"));

		String[] defaultTemplateEntries = ArrayUtil.toStringArray(jsonArray);

		for (String defaultTemplateEntry : defaultTemplateEntries) {
			LayoutPageTemplateEntry layoutPageTemplateEntry =
				_layoutPageTemplateEntryLocalService.
					fetchLayoutPageTemplateEntry(
						serviceContext.getScopeGroupId(), defaultTemplateEntry);

			if (layoutPageTemplateEntry != null) {
				_layoutPageTemplateEntryLocalService.
					updateLayoutPageTemplateEntry(
						layoutPageTemplateEntry.getLayoutPageTemplateEntryId(),
						true);
			}
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		BundleSiteInitializer.class);

	private static final ObjectMapper _objectMapper = new ObjectMapper();

	private final AssetListEntryLocalService _assetListEntryLocalService;
	private final Bundle _bundle;
	private final CatalogResource.Factory _catalogResourceFactory;
	private final ChannelResource.Factory _channelResourceFactory;
	private final ClassLoader _classLoader;
	private final DDMStructureLocalService _ddmStructureLocalService;
	private final DDMTemplateLocalService _ddmTemplateLocalService;
	private final DefaultDDMStructureHelper _defaultDDMStructureHelper;
	private final DLURLHelper _dlURLHelper;
	private final DocumentFolderResource.Factory _documentFolderResourceFactory;
	private final DocumentResource.Factory _documentResourceFactory;
	private final FragmentsImporter _fragmentsImporter;
	private final GroupLocalService _groupLocalService;
	private final JournalArticleLocalService _journalArticleLocalService;
	private final JSONFactory _jsonFactory;
	private final LayoutCopyHelper _layoutCopyHelper;
	private final LayoutLocalService _layoutLocalService;
	private final LayoutPageTemplateEntryLocalService
		_layoutPageTemplateEntryLocalService;
	private final LayoutPageTemplatesImporter _layoutPageTemplatesImporter;
	private LayoutPageTemplateStructureLocalService
		_layoutPageTemplateStructureLocalService;
	private final LayoutSetLocalService _layoutSetLocalService;
	private final ObjectDefinitionResource.Factory
		_objectDefinitionResourceFactory;
	private final Portal _portal;
	private final ServletContext _servletContext;
	private final SiteNavigationMenuItemLocalService
		_siteNavigationMenuItemLocalService;
	private final SiteNavigationMenuItemTypeRegistry
		_siteNavigationMenuItemTypeRegistry;
	private final SiteNavigationMenuLocalService
		_siteNavigationMenuLocalService;
	private final StructuredContentFolderResource.Factory
		_structuredContentFolderResourceFactory;
	private final StyleBookEntryZipProcessor _styleBookEntryZipProcessor;
	private final TaxonomyCategoryResource.Factory
		_taxonomyCategoryResourceFactory;
	private final TaxonomyVocabularyResource.Factory
		_taxonomyVocabularyResourceFactory;
	private final ThemeLocalService _themeLocalService;
	private final UserLocalService _userLocalService;

}