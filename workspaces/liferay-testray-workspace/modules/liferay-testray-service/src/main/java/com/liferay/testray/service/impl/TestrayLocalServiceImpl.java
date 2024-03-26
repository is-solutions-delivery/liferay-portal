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

		Map<String, Map<String, Serializable>> testrayCaseResultValuesMap1 =
			_getTestrayCaseResultValuesMapByTestrayRun(
				companyId, testrayCasePriorities, testrayRun1Id, testrayTeamId);
		Map<String, Map<String, Serializable>> testrayCaseResultValuesMap2 =
			_getTestrayCaseResultValuesMapByTestrayRun(
				companyId, testrayCasePriorities, testrayRun2Id, testrayTeamId);

		for (Map.Entry<String, Map<String, Serializable>> entry :
				testrayCaseResultValuesMap1.entrySet()) {

			set.add(
				_compareTestrayCaseResults(
					entry.getValue(),
					testrayCaseResultValuesMap2.remove(entry.getKey())));
		}

		for (Map.Entry<String, Map<String, Serializable>> entry :
				testrayCaseResultValuesMap2.entrySet()) {

			set.add(_compareTestrayCaseResults(null, entry.getValue()));
		}

		return ListUtil.fromArray(
			HashMapBuilder.<String, Object>put(
				"Components", _getTestrayComponentsSummaryMap(set)
			).put(
				"Runs", _getTestrayRunsSummaryMap(set)
			).build());
	}

	private Map<String, Serializable> _compareTestrayCaseResults(
		Map<String, Serializable> testrayCaseResultValuesMap1,
		Map<String, Serializable> testrayCaseResultValuesMap2) {

		Map<String, Serializable> comparedValuesMap =
			testrayCaseResultValuesMap1;

		if (testrayCaseResultValuesMap1 == null) {
			comparedValuesMap = testrayCaseResultValuesMap2;
		}

		Serializable testrayCaseResult1Id = 0;
		Serializable testrayCaseResult1Status = "DIDNOTRUN";

		if (testrayCaseResultValuesMap1 != null) {
			testrayCaseResult1Id = testrayCaseResultValuesMap1.get(
				"c_caseResultId");
			testrayCaseResult1Status = testrayCaseResultValuesMap1.get(
				"dueStatus");
		}

		comparedValuesMap.put("testrayCaseResult1Id", testrayCaseResult1Id);
		comparedValuesMap.put(
			"testrayCaseResult1Status", testrayCaseResult1Status);

		Serializable testrayCaseResult2Id = 0;
		Serializable testrayCaseResult2Status = "DIDNOTRUN";

		if (testrayCaseResultValuesMap2 != null) {
			testrayCaseResult2Id = testrayCaseResultValuesMap2.get(
				"c_caseResultId");
			testrayCaseResult2Status = testrayCaseResultValuesMap2.get(
				"dueStatus");
		}

		comparedValuesMap.put("testrayCaseResult2Id", testrayCaseResult2Id);
		comparedValuesMap.put(
			"testrayCaseResult2Status", testrayCaseResult2Status);

		return comparedValuesMap;
	}

	private String _getFilterString(
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

	private Map<String, Map<String, Serializable>>
			_getTestrayCaseResultValuesMapByTestrayRun(
				long companyId, String testrayCasePriorities, long testrayRunId,
				long testrayTeamId)
		throws Exception {

		Map<String, Map<String, Serializable>> map = new HashMap<>();

		ObjectDefinition objectDefinition =
			_objectDefinitionLocalService.getObjectDefinition(
				companyId, "C_CaseResult");

		for (Map<String, Serializable> valuesMap :
				_objectEntryLocalService.getValuesList(
					0, companyId, 0, objectDefinition.getObjectDefinitionId(),
					_filterFactory.create(
						_getFilterString(
							testrayCasePriorities, testrayRunId, testrayTeamId),
						objectDefinition),
					null, -1, -1, null)) {

			map.put(
				String.valueOf(valuesMap.get("r_caseToCaseResult_c_caseId")),
				valuesMap);
		}

		return map;
	}

	private Map<String, Map<String, Map<String, Integer>>>
		_getTestrayComponentsSummaryMap(
			Set<Map<String, Serializable>> comparedTestrayCaseResultsSet) {

		Map<String, Map<String, Map<String, Integer>>>
			testrayComponentsSummaryMap = new HashMap<>();

		for (Map<String, Serializable> comparedTestrayCaseResult :
				comparedTestrayCaseResultsSet) {

			Map<String, Map<String, Integer>> testrayComponentSummaryMap =
				testrayComponentsSummaryMap.get(
					String.valueOf(
						comparedTestrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")));

			if (testrayComponentSummaryMap == null) {
				testrayComponentSummaryMap = new HashMap<>();

				testrayComponentsSummaryMap.put(
					String.valueOf(
						comparedTestrayCaseResult.get(
							"r_componentToCaseResult_c_componentId")),
					testrayComponentSummaryMap);
			}

			Map<String, Integer> testrayCaseResult2StatusCountMap =
				testrayComponentSummaryMap.get(
					comparedTestrayCaseResult.get("testrayCaseResult1Status"));

			if (testrayCaseResult2StatusCountMap == null) {
				testrayCaseResult2StatusCountMap = new HashMap<>();

				testrayComponentSummaryMap.put(
					String.valueOf(
						comparedTestrayCaseResult.get(
							"testrayCaseResult1Status")),
					testrayCaseResult2StatusCountMap);
			}

			_incrementTestrayCaseResultStatusQuantity(
				testrayCaseResult2StatusCountMap,
				String.valueOf(
					comparedTestrayCaseResult.get("testrayCaseResult2Status")));
		}

		return testrayComponentsSummaryMap;
	}

	private Map<String, Map<String, Integer>> _getTestrayRunsSummaryMap(
		Set<Map<String, Serializable>> comparedTestrayCaseResultsSet) {

		Map<String, Map<String, Integer>> testrayRunsSummaryMap =
			new HashMap<>();

		for (Map<String, Serializable> comparedTestrayCaseResultMap :
				comparedTestrayCaseResultsSet) {

			Map<String, Integer> testrayCaseResult2StatusCountMap =
				testrayRunsSummaryMap.get(
					comparedTestrayCaseResultMap.get(
						"testrayCaseResult1Status"));

			if (testrayCaseResult2StatusCountMap == null) {
				testrayCaseResult2StatusCountMap = new HashMap<>();

				testrayRunsSummaryMap.put(
					String.valueOf(
						comparedTestrayCaseResultMap.get(
							"testrayCaseResult1Status")),
					testrayCaseResult2StatusCountMap);
			}

			_incrementTestrayCaseResultStatusQuantity(
				testrayCaseResult2StatusCountMap,
				String.valueOf(
					comparedTestrayCaseResultMap.get(
						"testrayCaseResult2Status")));
		}

		return testrayRunsSummaryMap;
	}

	private void _incrementTestrayCaseResultStatusQuantity(
		Map<String, Integer> map, String status) {

		Integer count = map.get(status);

		if (count == null) {
			count = 0;
		}

		map.put(status, count + 1);
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