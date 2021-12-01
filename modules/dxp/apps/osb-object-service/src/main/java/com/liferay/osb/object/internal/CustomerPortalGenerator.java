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

package com.liferay.osb.object.internal;

import com.liferay.account.model.AccountRole;
import com.liferay.account.service.AccountRoleLocalService;
import com.liferay.application.list.constants.PanelCategoryKeys;
import com.liferay.object.constants.ObjectDefinitionConstants;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.module.framework.ModuleServiceLifecycle;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.petra.string.StringPool;

import java.io.Serializable;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Amos Fong
 */
@Component(immediate = true, service = {})
public class CustomerPortalGenerator {

	@Activate
	protected void activate(BundleContext bundleContext) throws Exception {
		System.out.println("###################Start Import");

		List<Company> companies = _companyLocalService.getCompanies();

		if (companies.size() != 1) {
			return;
		}

		Company company = companies.get(0);

		//_reset(company.getCompanyId());

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.fetchObjectDefinition(
				company.getCompanyId(), "C_KoroneikiAccount");

		if (objectDefinition != null) {
			return;
		}

		User user = _userLocalService.fetchUserByEmailAddress(
			company.getCompanyId(), "test@liferay.com");

		if (user == null) {
			return;
		}

		_addAccountObjectDefinition(user.getUserId());
		_addBannedEmailDomains(user.getUserId());
		_addDataCenterRegion(user.getUserId());
		_addSubscriptionObjectDefinition(user.getUserId());

		// Add roles

		AccountRole accountRole = _accountRoleLocalService.addAccountRole(
			user.getUserId(), 0, "Requestor",
			Collections.singletonMap(LocaleUtil.getSiteDefault(), "Requestor"),
			Collections.emptyMap());

		accountRole.setAccountRoleId(11111111);

		_accountRoleLocalService.updateAccountRole(accountRole);

		Role role = _roleLocalService.getRole(
			company.getCompanyId(), "Account Member");

		accountRole = _accountRoleLocalService.getAccountRoleByRoleId(
			role.getRoleId());

		accountRole.setAccountRoleId(22222222);

		_accountRoleLocalService.updateAccountRole(accountRole);

		role = _roleLocalService.getRole(
			company.getCompanyId(), "Account Administrator");

		accountRole = _accountRoleLocalService.getAccountRoleByRoleId(
			role.getRoleId());

		accountRole.setAccountRoleId(33333333);

		_accountRoleLocalService.updateAccountRole(accountRole);

		accountRole = _accountRoleLocalService.addAccountRole(
			user.getUserId(), 0, "Partner Manager",
			Collections.singletonMap(LocaleUtil.getSiteDefault(), "Partner Manager"),
			Collections.emptyMap());

		accountRole.setAccountRoleId(44444444);

		_accountRoleLocalService.updateAccountRole(accountRole);

		accountRole = _accountRoleLocalService.addAccountRole(
			user.getUserId(), 0, "Partner Member",
			Collections.singletonMap(LocaleUtil.getSiteDefault(), "Partner Member"),
			Collections.emptyMap());

		accountRole.setAccountRoleId(55555555);

		_accountRoleLocalService.updateAccountRole(accountRole);

		System.out.println("###################Done");
	}

	private void _addAccountObjectDefinition(long userId) throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Koroneiki Account"),
				"KoroneikiAccount", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Koroneiki Accounts"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Account Key", "accountKey", "String"),
					_createObjectField("AC Workspace Name", "acWorkspaceName", "String"),
					_createObjectField("Code", "code", "String"),
					_createObjectField("Data Region", "dataRegion", "String"),
					_createObjectField(
						"DXP Version", "dxpVersion", "String"),
					_createObjectField(
						"Max Requestors", "maxRequestors", "Integer"),
					_createObjectField("Partner", "partner", "Boolean"),
					_createObjectField("Region", "region", "String"),
					_createObjectField("SLA Current", "slaCurrent", "String"),
					_createObjectField(
						"SLA Current Start Date", "slaCurrentStartDate",
						"Date"),
					_createObjectField(
						"SLA Current End Date", "slaCurrentEndDate", "Date"),
					_createObjectField("SLA Expired", "slaExpired", "String"),
					_createObjectField(
						"SLA Expired Start Date", "slaExpiredStartDate",
						"Date"),
					_createObjectField(
						"SLA Expired End Date", "slaExpiredEndDate", "Date"),
					_createObjectField("SLA Future", "slaFuture", "String"),
					_createObjectField(
						"SLA Future Start Date", "slaFutureStartDate", "Date"),
					_createObjectField(
						"SLA Future End Date", "slaFutureEndDate", "Date"),
					_createObjectField(
						"Liferay Contact Name", "liferayContactName", "String"),
					_createObjectField(
						"Liferay Contact Role", "liferayContactRole", "String"),
					_createObjectField(
						"Liferay Contact Email Address",
						"liferayContactEmailAddress", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());

		objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Flag"),
				"AccountFlag", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Flags"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Account Key", "accountKey", "String"),
					_createObjectField("User UUID", "userUuid", "String"),
					_createObjectField("Name", "name", "String"),
					_createObjectField("Value", "value", "Integer")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());
	}

	private void _addBannedEmailDomains(long userId) throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Banned Email Domain"),
				"BannedEmailDomain", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Banned Email Domains"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Domain", "domain", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());

		long objectDefinitionId = objectDefinition.getObjectDefinitionId();

		String bannedDomains = StringUtil.read(
			getClass(), "dependencies/banned-domains.txt");

		for (String domain :
				StringUtil.split(bannedDomains, StringPool.NEW_LINE)) {

			_objectEntryLocalService.addObjectEntry(
				userId, 0, objectDefinitionId,
				HashMapBuilder.<String, Serializable>put(
					"domain", domain
				).build(),
				new ServiceContext());
		}
	}

	private void _addDataCenterRegion(long userId) throws Exception {
		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "DXPC Data Center Region"),
				"DXPCDataCenterRegion", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "DXPC Data Center Region"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Name", "name", "String"),
					_createObjectField("Value", "value", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());

		long objectDefinitionId = objectDefinition.getObjectDefinitionId();

		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Oregon, USA"
			).put(
				"value", "Oregon, USA"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Iowa, USA"
			).put(
				"value", "Iowa, USA"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "London, England"
			).put(
				"value", "London, England"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Frankfurt, Germany"
			).put(
				"value", "Frankfurt, Germany"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "São Paulo, Brazil"
			).put(
				"value", "São Paulo, Brazil"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Sydney, Australia"
			).put(
				"value", "Sydney, Australia"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Mumbai, India"
			).put(
				"value", "Mumbai, India"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Tokyo, Japan"
			).put(
				"value", "Tokyo, Japan"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Montreal, Canada"
			).put(
				"value", "Montreal, Canada"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Dubai, UAE"
			).put(
				"value", "Dubai, UAE"
			).build(),
			new ServiceContext());
		_objectEntryLocalService.addObjectEntry(
			userId, 0, objectDefinitionId,
			HashMapBuilder.<String, Serializable>put(
				"name", "Hamina, Finland"
			).put(
				"value", "Hamina, Finland"
			).build(),
			new ServiceContext());
	}

	private void _addSubscriptionObjectDefinition(long userId)
		throws Exception {

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscription Group"),
				"AccountSubscriptionGroup", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscription Groups"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Account Key", "accountKey", "String"),
					_createObjectField("Name", "name", "String"),
					_createObjectField("Manage Contacts URL", "manageContactsURL", "String"),
					_createObjectField(
						"Has Activation", "hasActivation", "Boolean"),
					_createObjectField(
						"Activation Status", "activationStatus", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());

		objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscription"),
				"AccountSubscription", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscriptions"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Account Key", "accountKey", "String"),
					_createObjectField(
						"Account Subscription Group ERC",
						"accountSubscriptionGroupERC", "String"),
					_createObjectField("Name", "name", "String"),
					_createObjectField("Start Date", "startDate", "Date"),
					_createObjectField("End Date", "endDate", "Date"),
					_createObjectField(
						"Instance Size", "instanceSize", "String"),
					_createObjectField("Quantity", "quantity", "Integer"),
					_createObjectField(
						"Status", "subscriptionStatus", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());

		objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				userId,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscription Term"),
				"AccountSubscriptionTerm", "100",
				PanelCategoryKeys.CONTROL_PANEL_SITES,
				Collections.singletonMap(
					LocaleUtil.getSiteDefault(), "Account Subscription Terms"),
				ObjectDefinitionConstants.SCOPE_COMPANY,
				Arrays.asList(
					_createObjectField("Account Key", "accountKey", "String"),
					_createObjectField(
						"Account Subscription ERC", "accountSubscriptionERC",
						"String"),
					_createObjectField(
						"Account Subscription Group ERC",
						"accountSubscriptionGroupERC", "String"),
					_createObjectField("Start Date", "startDate", "Date"),
					_createObjectField("End Date", "endDate", "Date"),
					_createObjectField(
						"Instance Size", "instanceSize", "String"),
					_createObjectField("Quantity", "quantity", "Integer"),
					_createObjectField(
						"Status", "subscriptionTermStatus", "String")));

		_objectDefinitionLocalService.publishCustomObjectDefinition(
			userId, objectDefinition.getObjectDefinitionId());
	}

	private ObjectField _createObjectField(
		boolean indexed, boolean indexedAsKeyword, String indexedLanguageId,
		String label, String name, String type) {

		ObjectField objectField = _objectFieldLocalService.createObjectField(0);

		objectField.setIndexed(indexed);
		objectField.setIndexedAsKeyword(indexedAsKeyword);
		objectField.setIndexedLanguageId(indexedLanguageId);
		objectField.setLabelMap(
			Collections.singletonMap(LocaleUtil.getSiteDefault(), label));
		objectField.setName(name);
		objectField.setType(type);

		return objectField;
	}

	private ObjectField _createObjectField(
		String label, String name, String type) {

		return _createObjectField(true, false, null, label, name, type);
	}

	private void _deleteObjectDefinition(long companyId, String name)
		throws Exception {

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.fetchObjectDefinition(
				companyId, name);

		if (objectDefinition == null) {
			return;
		}

		_objectDefinitionLocalService.deleteObjectDefinition(objectDefinition);
	}

	private void _reset(long companyId) throws Exception {
		System.out.println("####RESET");

		_deleteObjectDefinition(companyId, "C_KoroneikiAccount");
		_deleteObjectDefinition(companyId, "C_AccountSubscription");
		_deleteObjectDefinition(companyId, "C_AccountSubscriptionGroup");
		_deleteObjectDefinition(companyId, "C_AccountSubscriptionTerm");
	}

	@Reference
	private AccountRoleLocalService _accountRoleLocalService;

	@Reference
	private CompanyLocalService _companyLocalService;

	@Reference(target = ModuleServiceLifecycle.PORTLETS_INITIALIZED, unbind = "-")
	private ModuleServiceLifecycle _moduleServiceLifecycle;

	@Reference(target = ModuleServiceLifecycle.DATABASE_INITIALIZED, unbind = "-")
	private ModuleServiceLifecycle _dbModuleServiceLifecycle;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

	@Reference
	private Portal _portal;

	@Reference
	private RoleLocalService _roleLocalService;

	@Reference
	private UserLocalService _userLocalService;

}