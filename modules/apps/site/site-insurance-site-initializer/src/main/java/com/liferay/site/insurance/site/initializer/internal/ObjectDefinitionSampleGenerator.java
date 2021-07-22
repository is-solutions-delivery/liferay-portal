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

package com.liferay.site.insurance.site.initializer.internal;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.model.ObjectField;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.module.framework.ModuleServiceLifecycle;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.HashMapBuilder;

import java.io.Serializable;

import java.util.Arrays;
import java.util.List;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * Enable this component by going to Gogo Shell and executing this command:
 *
 * scr:enable com.liferay.site.insurance.site.initializer.internal.ObjectDefinitionSampleGenerator
 *
 * @author José Abelenda
 */
@Component(enabled = false, immediate = true, service = {})
public class ObjectDefinitionSampleGenerator {

	@Activate
	protected void activate(BundleContext bundleContext) throws Exception {
		_addSampleObjectDefinition();
	}

	private void _addSampleObjectDefinition() throws Exception {
		List<Company> companies = _companyLocalService.getCompanies();

		if (companies.size() != 1) {
			return;
		}

		Company company = companies.get(0);

		User user = _userLocalService.fetchUserByEmailAddress(
			company.getCompanyId(), "test@liferay.com");

		if (user == null) {
			return;
		}

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.fetchObjectDefinition(
				company.getCompanyId(), "C_RaylifeApplication");

		if (objectDefinition != null) {
			return;
		}

		objectDefinition =
			_objectDefinitionLocalService.addCustomObjectDefinition(
				user.getUserId(), "RaylifeApplication",
				Arrays.asList(
					_createObjectField("address", "String"),
					_createObjectField("addressApt", "String"),
					_createObjectField("city", "String"),
					_createObjectField("email", "String"),
					_createObjectField("firstName", "String"),
					_createObjectField("lastName", "String"),
					_createObjectField("phone", "String"),
					_createObjectField("state", "String"),
					_createObjectField("website", "String"),
					_createObjectField("zip", "String")));

		objectDefinition =
			_objectDefinitionLocalService.publishCustomObjectDefinition(
				user.getUserId(), objectDefinition.getObjectDefinitionId());

		_objectEntryLocalService.addObjectEntry(
			user.getUserId(), 0, objectDefinition.getObjectDefinitionId(),
			HashMapBuilder.<String, Serializable>put(
				"address", "1400 Montefino Ave"
			).put(
				"addressApt", "123"
			).put(
				"city", "Diamond Bar"
			).put(
				"email", "test@liferay.com"
			).put(
				"firstName", "John"
			).put(
				"lastName", "Simon"
			).put(
				"phone", "+1 222-333-444"
			).put(
				"state", "CA"
			).put(
				"website", "mysite.com"
			).put(
				"zip", "91765"
			).build(),
			new ServiceContext());
	}

	private ObjectField _createObjectField(
		boolean indexed, boolean indexedAsKeyword, String indexedLanguageId,
		String name, String type) {

		ObjectField objectField = _objectFieldLocalService.createObjectField(0);

		objectField.setIndexed(indexed);
		objectField.setIndexedAsKeyword(indexedAsKeyword);
		objectField.setIndexedLanguageId(indexedLanguageId);
		objectField.setName(name);
		objectField.setType(type);

		return objectField;
	}

	private ObjectField _createObjectField(String name, String type) {
		return _createObjectField(true, false, null, name, type);
	}

	@Reference
	private CompanyLocalService _companyLocalService;

	@Reference(target = ModuleServiceLifecycle.PORTAL_INITIALIZED, unbind = "-")
	private ModuleServiceLifecycle _moduleServiceLifecycle;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

	@Reference
	private UserLocalService _userLocalService;

}