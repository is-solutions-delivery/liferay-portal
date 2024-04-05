/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.rest.internal.resource.v1_0;

import com.liferay.object.constants.ObjectDefinitionConstants;
import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.rest.filter.factory.FilterFactory;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.petra.sql.dsl.expression.Predicate;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.testray.rest.dto.v1_0.TestrayCaseResultComparison;
import com.liferay.testray.rest.dto.v1_0.TestrayComparison;
import com.liferay.testray.rest.dto.v1_0.TestrayComponentComparison;
import com.liferay.testray.rest.dto.v1_0.TestrayTeamComparison;
import com.liferay.testray.rest.resource.v1_0.TestrayComparisonResource;

import java.io.Serializable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Nilton Vieira
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/testray-comparison.properties",
	scope = ServiceScope.PROTOTYPE, service = TestrayComparisonResource.class
)
public class TestrayComparisonResourceImpl
	extends BaseTestrayComparisonResourceImpl {

	@Override
	public TestrayComparison getTestrayRunComparisonTestrayRunId1TestrayRunId2(
			Long testrayRunId1, Long testrayRunId2,
			String testrayCasePriorities, Long testrayTeamId)
		throws Exception {

		Set<Map<String, Serializable>> set = new HashSet<>();

		Map<String, Map<String, Serializable>> testrayCaseResultsMap1 =
			_getObjectEntriesMap(
				_getCaseResultFilterString(
					testrayCasePriorities, testrayRunId1,
					GetterUtil.getLong(testrayTeamId)),
				"r_caseToCaseResult_c_caseId", "C_CaseResult");
		Map<String, Map<String, Serializable>> testrayCaseResultsMap2 =
			_getObjectEntriesMap(
				_getCaseResultFilterString(
					testrayCasePriorities, testrayRunId2,
					GetterUtil.getLong(testrayTeamId)),
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
				_getComponentFilterString("", testrayRunId1, testrayRunId2),
				"c_componentId", "C_Component");

		TestrayComparison testrayComparison = new TestrayComparison();

		testrayComparison.setTestrayComponentComparisons(
			_getTestrayComponentComparisons(set, testrayComponentsMap));
		testrayComparison.setTestrayRunComparison(
			_getTestrayRunComparisons(set));
		testrayComparison.setTestrayTeamComparisons(
			_getTestrayTeamComparisons(
				testrayComponentsMap,
				_getObjectEntriesMap(
					_getComponentFilterString(
						"teamToComponents/", testrayRunId1, testrayRunId2),
					"c_teamId", "C_Team"),
				set));

		return testrayComparison;
	}

	private void _compareTestrayCaseResultStatus(
			TestrayCaseResultComparison testrayCaseResultComparison,
			Map<String, Serializable> testrayCaseResult)
		throws Exception {

		Map<String, Integer> map = _getStatusValuesMap(
			testrayCaseResultComparison,
			String.valueOf(testrayCaseResult.get("testrayCaseResultStatus1")));

		if (map == null) {
			map = new HashMap<>();

			_setStatusValuesMap(
				testrayCaseResultComparison,
				String.valueOf(
					testrayCaseResult.get("testrayCaseResultStatus1")),
				map);
		}

		Integer count = map.get(
			String.valueOf(testrayCaseResult.get("testrayCaseResultStatus2")));

		if (count == null) {
			count = 0;
		}

		map.put(
			String.valueOf(testrayCaseResult.get("testrayCaseResultStatus2")),
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
		String prefix, long testrayRunId1, long testrayRunId2) {

		StringBundler sb = new StringBundler(8);

		sb.append(prefix);
		sb.append("componentToCaseResult/r_runToCaseResult_c_runId eq '");
		sb.append(testrayRunId1);
		sb.append("' or ");
		sb.append(prefix);
		sb.append("componentToCaseResult/r_runToCaseResult_c_runId eq '");
		sb.append(testrayRunId2);
		sb.append("'");

		return sb.toString();
	}

	private Map<String, Map<String, Serializable>> _getObjectEntriesMap(
			String filterString, String key, String tableName)
		throws Exception {

		Map<String, Map<String, Serializable>> map = new HashMap<>();

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.getObjectDefinition(
				contextCompany.getCompanyId(), tableName);

		_objectEntryLocalService.getValuesList(
			0, contextCompany.getCompanyId(), contextUser.getUserId(),
			objectDefinition.getObjectDefinitionId(),
			_filterFactory.create(filterString, objectDefinition), null, -1, -1,
			null
		).forEach(
			entry -> map.put(String.valueOf(entry.get(key)), entry)
		);

		return map;
	}

	private Map<String, Integer> _getStatusValuesMap(
			TestrayCaseResultComparison testrayCaseResultComparison,
			String method)
		throws Exception {

		if (StringUtil.equals(method, "BLOCKED")) {
			return (Map<String, Integer>)
				testrayCaseResultComparison.getBlocked();
		}
		else if (StringUtil.equals(method, "DIDNOTRUN")) {
			return (Map<String, Integer>)
				testrayCaseResultComparison.getDidNotRun();
		}
		else if (StringUtil.equals(method, "FAILED")) {
			return (Map<String, Integer>)
				testrayCaseResultComparison.getFailed();
		}
		else if (StringUtil.equals(method, "PASSED")) {
			return (Map<String, Integer>)
				testrayCaseResultComparison.getPassed();
		}
		else if (StringUtil.equals(method, "TESTFIX")) {
			return (Map<String, Integer>)
				testrayCaseResultComparison.getTestFix();
		}

		throw new Exception("Status not available");
	}

	private TestrayComponentComparison _getTestrayComponentComparisonByName(
		List<TestrayComponentComparison> testrayComponentComparisons,
		String name) {

		for (TestrayComponentComparison testrayComponentComparison :
				testrayComponentComparisons) {

			if (StringUtil.equals(name, testrayComponentComparison.getName())) {
				return testrayComponentComparison;
			}
		}

		return null;
	}

	private TestrayComponentComparison[] _getTestrayComponentComparisons(
			Set<Map<String, Serializable>> set,
			Map<String, Map<String, Serializable>> testrayComponentsMap)
		throws Exception {

		List<TestrayComponentComparison> testrayComponentComparisons =
			new ArrayList<>();

		for (Map<String, Serializable> testrayCaseResult : set) {
			Map<String, Serializable> testrayComponent =
				testrayComponentsMap.get(
					String.valueOf(
						testrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")));

			TestrayComponentComparison testrayComponentComparison =
				_getTestrayComponentComparisonByName(
					testrayComponentComparisons,
					String.valueOf(testrayComponent.get("name")));

			if (testrayComponentComparison == null) {
				testrayComponentComparison = new TestrayComponentComparison();

				testrayComponentComparison.setName(
					String.valueOf(testrayComponent.get("name")));
				testrayComponentComparison.setTestrayCaseResultComparison(
					new TestrayCaseResultComparison());

				testrayComponentComparisons.add(testrayComponentComparison);
			}

			_compareTestrayCaseResultStatus(
				testrayComponentComparison.getTestrayCaseResultComparison(),
				testrayCaseResult);
		}

		return testrayComponentComparisons.toArray(
			new TestrayComponentComparison[0]);
	}

	private TestrayCaseResultComparison _getTestrayRunComparisons(
			Set<Map<String, Serializable>> set)
		throws Exception {

		TestrayCaseResultComparison testrayCaseResultComparison =
			new TestrayCaseResultComparison();

		for (Map<String, Serializable> testrayCaseResult : set) {
			_compareTestrayCaseResultStatus(
				testrayCaseResultComparison, testrayCaseResult);
		}

		return testrayCaseResultComparison;
	}

	private TestrayTeamComparison _getTestrayTeamComparisonByName(
		List<TestrayTeamComparison> testrayTeamComparisons, String name) {

		for (TestrayTeamComparison testrayTeamComparison :
				testrayTeamComparisons) {

			if (StringUtil.equals(name, testrayTeamComparison.getName())) {
				return testrayTeamComparison;
			}
		}

		return null;
	}

	private TestrayTeamComparison[] _getTestrayTeamComparisons(
			Map<String, Map<String, Serializable>> testrayComponentsMap,
			Map<String, Map<String, Serializable>> testrayTeamsMap,
			Set<Map<String, Serializable>> set)
		throws Exception {

		List<TestrayTeamComparison> testrayTeamComparisons = new ArrayList<>();

		for (Map<String, Serializable> testrayCaseResult : set) {
			Map<String, Serializable> testrayComponent =
				testrayComponentsMap.get(
					String.valueOf(
						testrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")));

			Map<String, Serializable> testrayTeam = testrayTeamsMap.get(
				String.valueOf(
					testrayComponent.get("r_teamToComponents_c_teamId")));

			TestrayTeamComparison testrayTeamComparison =
				_getTestrayTeamComparisonByName(
					testrayTeamComparisons,
					String.valueOf(testrayTeam.get("name")));

			if (testrayTeamComparison == null) {
				testrayTeamComparison = new TestrayTeamComparison();

				testrayTeamComparison.setName(
					String.valueOf(testrayTeam.get("name")));
				testrayTeamComparison.setTestrayCaseResultComparison(
					new TestrayCaseResultComparison());

				testrayTeamComparisons.add(testrayTeamComparison);
			}

			_compareTestrayCaseResultStatus(
				testrayTeamComparison.getTestrayCaseResultComparison(),
				testrayCaseResult);
		}

		return testrayTeamComparisons.toArray(new TestrayTeamComparison[0]);
	}

	private Map<String, Serializable> _mergeTestrayCaseResults(
		Map<String, Serializable> testrayCaseResult1,
		Map<String, Serializable> testrayCaseResult2) {

		Map<String, Serializable> map = testrayCaseResult1;

		if (testrayCaseResult1 == null) {
			map = testrayCaseResult2;
		}

		Serializable testrayCaseResultId1 = 0;
		Serializable testrayCaseResultStatus1 = "DIDNOTRUN";

		if (testrayCaseResult1 != null) {
			testrayCaseResultId1 = testrayCaseResult1.get("c_caseResultId");

			Serializable dueStatus = testrayCaseResult1.get("dueStatus");

			if (!Objects.equals(dueStatus, "UNTESTED")) {
				testrayCaseResultStatus1 = dueStatus;
			}
		}

		map.put("testrayCaseResultId1", testrayCaseResultId1);
		map.put("testrayCaseResultStatus1", testrayCaseResultStatus1);

		Serializable testrayCaseResultId2 = 0;
		Serializable testrayCaseResultStatus2 = "DIDNOTRUN";

		if (testrayCaseResult2 != null) {
			testrayCaseResultId2 = testrayCaseResult2.get("c_caseResultId");

			Serializable dueStatus = testrayCaseResult2.get("dueStatus");

			if (!Objects.equals(dueStatus, "UNTESTED")) {
				testrayCaseResultStatus2 = dueStatus;
			}
		}

		map.put("testrayCaseResultId2", testrayCaseResultId2);
		map.put("testrayCaseResultStatus2", testrayCaseResultStatus2);

		return map;
	}

	private void _setStatusValuesMap(
			TestrayCaseResultComparison testrayCaseResultComparison,
			String method, Map<String, Integer> map)
		throws Exception {

		if (StringUtil.equals(method, "BLOCKED")) {
			testrayCaseResultComparison.setBlocked(map);
		}
		else if (StringUtil.equals(method, "DIDNOTRUN")) {
			testrayCaseResultComparison.setDidNotRun(map);
		}
		else if (StringUtil.equals(method, "FAILED")) {
			testrayCaseResultComparison.setFailed(map);
		}
		else if (StringUtil.equals(method, "PASSED")) {
			testrayCaseResultComparison.setPassed(map);
		}
		else if (StringUtil.equals(method, "TESTFIX")) {
			testrayCaseResultComparison.setTestFix(map);
		}

		throw new Exception("Status not available");
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