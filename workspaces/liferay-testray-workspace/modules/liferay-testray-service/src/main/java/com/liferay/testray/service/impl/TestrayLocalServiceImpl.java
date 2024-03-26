/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.service.impl;

import com.liferay.object.constants.ObjectDefinitionConstants;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.rest.filter.factory.FilterFactory;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.petra.sql.dsl.expression.Predicate;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.testray.service.base.TestrayLocalServiceBaseImpl;

import java.io.Serializable;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Nilton Vieira
 */
@Component(
	property = "model.class.name=com.liferay.testray.model.Testray",
	service = AopService.class
)
public class TestrayLocalServiceImpl extends TestrayLocalServiceBaseImpl {

	public List<Map<String, Object>> compareTestrayRuns(
			long companyId, String testrayCasePriorities, long testrayRun1Id,
			long testrayRun2Id, long testrayTeamId)
		throws Exception {

		Set<Map<String, Serializable>> set = new HashSet<>();

		Map<String, Map<String, Serializable>> testrayCaseResultsMap1 =
			_getObjectEntriesMap(
				companyId,
				_getCaseResultFilterString(
					testrayCasePriorities, testrayRun1Id, testrayTeamId),
				"r_caseToCaseResult_c_caseId", "C_CaseResult");
		Map<String, Map<String, Serializable>> testrayCaseResultsMap2 =
			_getObjectEntriesMap(
				companyId,
				_getCaseResultFilterString(
					testrayCasePriorities, testrayRun2Id, testrayTeamId),
				"r_caseToCaseResult_c_caseId", "C_CaseResult");

		for (Map.Entry<String, Map<String, Serializable>> entry :
				testrayCaseResultsMap1.entrySet()) {

			set.add(
				_mergeTestrayCaseResults(
					entry.getValue(),
					testrayCaseResultsMap2.remove(entry.getKey())));
		}

		for (Map.Entry<String, Map<String, Serializable>> entry :
				testrayCaseResultsMap2.entrySet()) {

			set.add(_mergeTestrayCaseResults(null, entry.getValue()));
		}

		Map<String, Map<String, Serializable>> testrayComponentsMap =
			_getObjectEntriesMap(
				companyId,
				_getComponentFilterString("", testrayRun1Id, testrayRun2Id),
				"c_componentId", "C_Component");

		return ListUtil.fromArray(
			HashMapBuilder.<String, Object>put(
				"Components",
				_getTestrayComponentComparisons(testrayComponentsMap, set)
			).put(
				"Runs", _getTestrayRunComparison(set)
			).put(
				"Teams",
				_getTestrayTeamComparison(
					testrayComponentsMap,
					_getObjectEntriesMap(
						companyId,
						_getComponentFilterString(
							"teamToComponents/", testrayRun1Id, testrayRun2Id),
						"c_teamId", "C_Team"),
					set)
			).build());
	}

	private void _compareTestrayCaseResultStatus(
		Map<String, Map<String, Integer>> entityComparison,
		Map<String, Serializable> mergedTestrayCaseResult) {

		Map<String, Integer> map = entityComparison.get(
			mergedTestrayCaseResult.get("testrayCaseResult1Status"));

		if (map == null) {
			map = new HashMap<>();

			entityComparison.put(
				String.valueOf(
					mergedTestrayCaseResult.get("testrayCaseResult1Status")),
				map);
		}

		Integer count = map.get(
			String.valueOf(
				mergedTestrayCaseResult.get("testrayCaseResult2Status")));

		if (count == null) {
			count = 0;
		}

		map.put(
			String.valueOf(
				mergedTestrayCaseResult.get("testrayCaseResult2Status")),
			count + 1);
	}

	private String _getCaseResultFilterString(
		String testrayCasePriorities, long testrayRunId, long testrayTeamId) {

		StringBundler sb = new StringBundler("runId eq '" + testrayRunId + "'");

		if (Validator.isNotNull(testrayCasePriorities)) {
			sb.append(" and (");

			String[] filterByPriority = StringUtil.split(testrayCasePriorities);

			for (int i = 0; i <= (filterByPriority.length - 1); i++) {
				sb.append("caseToCaseResult/priority eq ");
				sb.append(filterByPriority[i]);
				sb.append(" or ");
			}

			sb.setIndex(sb.index() - 1);
			sb.append(")");
		}

		if (testrayTeamId != 0) {
			sb.append(" and componentToCaseResult/teamId eq '");
			sb.append(testrayTeamId);
			sb.append("'");
		}

		return sb.toString();
	}

	private String _getComponentFilterString(
		String prefix, long testrayRun1Id, long testrayRun2Id) {

		StringBundler sb = new StringBundler(8);

		sb.append(prefix);
		sb.append("componentToCaseResult/r_runToCaseResult_c_runId eq '");
		sb.append(testrayRun1Id);
		sb.append("' or ");
		sb.append(prefix);
		sb.append("componentToCaseResult/r_runToCaseResult_c_runId eq '");
		sb.append(testrayRun2Id);
		sb.append("'");

		return sb.toString();
	}

	private Map<String, Map<String, Serializable>> _getObjectEntriesMap(
			long companyId, String filterString, String key, String tableName)
		throws Exception {

		Map<String, Map<String, Serializable>> map = new HashMap<>();

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.getObjectDefinition(
				companyId, tableName);

		_objectEntryLocalService.getValuesList(
			0, companyId, 0, objectDefinition.getObjectDefinitionId(),
			_filterFactory.create(filterString, objectDefinition), null, -1, -1,
			null
		).forEach(
			entry -> map.put(String.valueOf(entry.get(key)), entry)
		);

		return map;
	}

	private Map<String, Map<String, Map<String, Integer>>>
		_getTestrayComponentComparisons(
			Map<String, Map<String, Serializable>> testrayComponentsMap,
			Set<Map<String, Serializable>> set) {

		Map<String, Map<String, Map<String, Integer>>>
			testrayComponentComparisonsMap = new HashMap<>();

		for (Map<String, Serializable> mergedTestrayCaseResult : set) {
			Map<String, Serializable> testrayComponent =
				testrayComponentsMap.get(
					String.valueOf(
						mergedTestrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")));

			Map<String, Map<String, Integer>> testrayComponentComparison =
				testrayComponentComparisonsMap.get(
					testrayComponent.get("name"));

			if (testrayComponentComparison == null) {
				testrayComponentComparison = new HashMap<>();

				testrayComponentComparisonsMap.put(
					String.valueOf(testrayComponent.get("name")),
					testrayComponentComparison);
			}

			_compareTestrayCaseResultStatus(
				testrayComponentComparison, mergedTestrayCaseResult);
		}

		return testrayComponentComparisonsMap;
	}

	private Map<String, Map<String, Integer>> _getTestrayRunComparison(
		Set<Map<String, Serializable>> set) {

		Map<String, Map<String, Integer>> map = new HashMap<>();

		for (Map<String, Serializable> mergedTestrayCaseResult : set) {
			_compareTestrayCaseResultStatus(map, mergedTestrayCaseResult);
		}

		return map;
	}

	private Map<String, Map<String, Map<String, Integer>>>
		_getTestrayTeamComparison(
			Map<String, Map<String, Serializable>> testrayComponentsMap,
			Map<String, Map<String, Serializable>> testrayTeamsMap,
			Set<Map<String, Serializable>> set) {

		Map<String, Map<String, Map<String, Integer>>>
			testrayTeamComparisonsMap = new HashMap<>();

		for (Map<String, Serializable> mergedTestrayCaseResult : set) {
			Map<String, Serializable> testrayComponent =
				testrayComponentsMap.get(
					String.valueOf(
						mergedTestrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")));

			Map<String, Serializable> testrayTeam = testrayTeamsMap.get(
				String.valueOf(
					testrayComponent.get("r_teamToComponents_c_teamId")));

			Map<String, Map<String, Integer>> testrayTeamComparison =
				testrayTeamComparisonsMap.get(testrayTeam.get("name"));

			if (testrayTeamComparison == null) {
				testrayTeamComparison = new HashMap<>();

				testrayTeamComparisonsMap.put(
					String.valueOf(testrayTeamsMap.get("name")),
					testrayTeamComparison);
			}

			_compareTestrayCaseResultStatus(
				testrayTeamComparison, mergedTestrayCaseResult);
		}

		return testrayTeamComparisonsMap;
	}

	private Map<String, Serializable> _mergeTestrayCaseResults(
		Map<String, Serializable> testrayCaseResult1,
		Map<String, Serializable> testrayCaseResult2) {

		Map<String, Serializable> map = testrayCaseResult1;

		if (testrayCaseResult1 == null) {
			map = testrayCaseResult2;
		}

		Serializable testrayCaseResult1Id = 0;
		Serializable testrayCaseResult1Status = "DIDNOTRUN";

		if (testrayCaseResult1 != null) {
			testrayCaseResult1Id = testrayCaseResult1.get("c_caseResultId");

			Serializable dueStatus = testrayCaseResult1.get("dueStatus");

			if (!Objects.equals(dueStatus, "UNTESTED")) {
				testrayCaseResult1Status = dueStatus;
			}
		}

		map.put("testrayCaseResult1Id", testrayCaseResult1Id);
		map.put("testrayCaseResult1Status", testrayCaseResult1Status);

		Serializable testrayCaseResult2Id = 0;
		Serializable testrayCaseResult2Status = "DIDNOTRUN";

		if (testrayCaseResult2 != null) {
			testrayCaseResult2Id = testrayCaseResult2.get("c_caseResultId");

			Serializable dueStatus = testrayCaseResult2.get("dueStatus");

			if (!Objects.equals(dueStatus, "UNTESTED")) {
				testrayCaseResult2Status = dueStatus;
			}
		}

		map.put("testrayCaseResult2Id", testrayCaseResult2Id);
		map.put("testrayCaseResult2Status", testrayCaseResult2Status);

		return map;
	}

	@Reference(
		target = "(filter.factory.key=" + ObjectDefinitionConstants.STORAGE_TYPE_DEFAULT + ")"
	)
	private FilterFactory<Predicate> _filterFactory;

	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

}