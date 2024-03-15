/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.service.impl;

import com.liferay.object.entry.util.ObjectEntryDTOConverterUtil;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.rest.dto.v1_0.ObjectEntry;
import com.liferay.object.rest.manager.v1_0.ObjectEntryManager;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.vulcan.dto.converter.DefaultDTOConverterContext;
import com.liferay.portal.vulcan.dto.converter.util.DTOConverterUtil;
import com.liferay.testray.service.base.CompareRunsLocalServiceBaseImpl;

import java.util.*;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Nilton Vieira
 */
@Component(
	property = "model.class.name=com.liferay.testray.model.CompareRuns",
	service = AopService.class
)
public class CompareRunsLocalServiceImpl
	extends CompareRunsLocalServiceBaseImpl {

	public List<Map<String, Map<String, Map<String, Integer>>>> getComparison(
			long companyId, long testrayRun1Id, long testrayRun2Id)
		throws Exception {

		_loadObjectDefinitions(companyId);

		Set<Map<String, Object>> set = new HashSet<>();

		Map<Long, ObjectEntry> testrayCaseResultObjectEntries1 =
			_getTestrayCaseResultObjectEntriesByTestrayRun(
				companyId, testrayRun1Id);
		Map<Long, ObjectEntry> testrayCaseResultObjectEntries2 =
			_getTestrayCaseResultObjectEntriesByTestrayRun(
				companyId, testrayRun2Id);

		for (Map.Entry<Long, ObjectEntry> entry :
				testrayCaseResultObjectEntries1.entrySet()) {

			ObjectEntry testrayCaseResultCompositeA = entry.getValue();

			//if (!testrayCasePriorities.isEmpty() && !testrayCasePriorities.contains(testrayCaseResultCompositeA.getPriority())) {
			//	continue;
			//}

			//if ((testrayTeamId > 0) && (testrayTeamId != testrayCaseResultCompositeA.getTestrayTeamId())) {
			//	continue;
			//}

			//TestrayCaseResultComparison testrayCaseResultComparison = new TestrayCaseResultComparison(testrayCaseResultCompositeA, testrayCaseIdCompositeMapB.remove(entry.getKey()));

			set.add(
				_compare(
					testrayCaseResultCompositeA,
					testrayCaseResultObjectEntries2.remove(entry.getKey())));

			//testrayCaseResultComparisons.add(testrayCaseResultComparison);
		}

		for (Map.Entry<Long, ObjectEntry> entry :
				testrayCaseResultObjectEntries2.entrySet()) {

			ObjectEntry testrayCaseResultCompositeB = entry.getValue();

			//if (!testrayCasePriorities.isEmpty() && !testrayCasePriorities.contains(testrayCaseResultCompositeB.getPriority())) {
			//	continue;
			//}

			//if ((testrayTeamId > 0) && (testrayTeamId != testrayCaseResultCompositeB.getTestrayTeamId())) {
			//	continue;
			//}

			//TestrayCaseResultComparison testrayCaseResultComparison = new TestrayCaseResultComparison(null, testrayCaseResultCompositeB);

			set.add(_compare(null, testrayCaseResultCompositeB));

			//testrayCaseResultComparisons.add(testrayCaseResultComparison);
		}

		Map<String, Map<String, Integer>> map = new HashMap<>();

		for (Map<String, Object> comparedEntry : set) {
			Map<String, Integer> status2CountMap = map.get(
				comparedEntry.get("status1"));

			if (status2CountMap == null) {
				status2CountMap = new HashMap<>();

				map.put(
					String.valueOf(comparedEntry.get("status1")),
					status2CountMap);
			}

			_incrementStatusCount(
				status2CountMap, String.valueOf(comparedEntry.get("status2")));
		}

		List<Map<String, Map<String, Map<String, Integer>>>> test = new ArrayList<>();

		Map<String, Map<String, Map<String, Integer>>> map1 = new HashMap<>();

		map1.put("Runs", map);

		test.add(map1);
		return test;
	}

	private Map<String, Object> _compare(
			ObjectEntry objectEntry1, ObjectEntry objectEntry2)
		throws Exception {

		//ObjectEntry comparedObjectEntry = objectEntry1;
		Map<String, Object> comparedPropertiesMap = null;

		if (objectEntry1 == null) {
			//comparedObjectEntry = objectEntry2;
			comparedPropertiesMap = objectEntry2.getProperties();
		}
		else {
			comparedPropertiesMap = objectEntry1.getProperties();
		}

		//comparedPropertiesMap.remove("dueStatus");

		//comparedPropertiesMap.put("priority", _getProperty("priority", comparedObjectEntry));

		Object status1 = "DIDNOTRUN";
		long caseResult1Id = 0;

		if (objectEntry1 != null) {
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject(_getProperty("dueStatus", objectEntry1).toString());
			status1 = jsonObject.get("key");
			caseResult1Id = objectEntry1.getId();
		}

		comparedPropertiesMap.put("status1", status1);
		comparedPropertiesMap.put("caseResult1Id", caseResult1Id);

		Object status2 = "DIDNOTRUN";
		long caseResult2Id = 0;

		if (objectEntry2 != null) {
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject(_getProperty("dueStatus", objectEntry2).toString());
			status2 = jsonObject.get("key");
			caseResult2Id = objectEntry2.getId();
		}

		comparedPropertiesMap.put("status2", status2);
		comparedPropertiesMap.put("caseResult2Id", caseResult2Id);

		return comparedPropertiesMap;
	}

	private ObjectDefinition _getObjectDefinition(
			String objectDefinitionShortName)
		throws Exception {

		ObjectDefinition objectDefinition = _objectDefinitionsMap.get(
			objectDefinitionShortName);

		if (objectDefinition == null) {
			throw new PortalException(
				"No object definition found with short name " +
					objectDefinitionShortName);
		}

		return objectDefinition;
	}

	private Object _getProperty(String key, ObjectEntry objectEntry) {
		Map<String, Object> properties = objectEntry.getProperties();

		return properties.get(key);
	}

	private Map<Long, ObjectEntry>
			_getTestrayCaseResultObjectEntriesByTestrayRun(
				long companyId, long testrayRunId)
		throws Exception {

		Map<Long, ObjectEntry> map = new HashMap<>();

		for (ObjectEntry objectEntry :
				_objectEntryManager.getObjectEntries(
					companyId, _getObjectDefinition("CaseResult"), null, null,
					_defaultDTOConverterContext,
					"runId eq '" + testrayRunId + "'", null, null, null
				).getItems()) {

			map.put(
				(Long)_getProperty("r_caseToCaseResult_c_caseId", objectEntry),
				objectEntry);
		}

		return map;
	}

	private void _incrementStatusCount(
		Map<String, Integer> status2CountMap, String status) {

		Integer integer = status2CountMap.get(status);

		if (integer == null) {
			integer = 0;
		}

		status2CountMap.put(status, integer + 1);
	}

	private void _loadObjectDefinitions(long companyId) {
		List<ObjectDefinition> objectDefinitions =
			_objectDefinitionLocalService.getObjectDefinitions(
				companyId, true, WorkflowConstants.STATUS_APPROVED);

		if (ListUtil.isEmpty(objectDefinitions)) {
			return;
		}

		for (ObjectDefinition objectDefinition : objectDefinitions) {
			if (_objectDefinitionsMap.get(objectDefinition.getShortName()) !=
					null) {

				continue;
			}

			_objectDefinitionsMap.put(
				objectDefinition.getShortName(), objectDefinition);
		}
	}

	private static final Map<String, ObjectDefinition> _objectDefinitionsMap =
		new HashMap<>();

	private final DefaultDTOConverterContext _defaultDTOConverterContext =
		new DefaultDTOConverterContext(
			false, null, null, null, null, LocaleUtil.getSiteDefault(), null,
			null);

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference(target = "(object.entry.manager.storage.type=default)")
	private ObjectEntryManager _objectEntryManager;

}