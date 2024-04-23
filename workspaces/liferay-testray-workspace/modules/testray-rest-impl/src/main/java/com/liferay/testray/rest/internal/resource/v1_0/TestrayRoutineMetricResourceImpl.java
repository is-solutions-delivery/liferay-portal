/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.testray.rest.internal.resource.v1_0;

import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;
import com.liferay.testray.rest.dto.v1_0.TestrayRoutineMetric;
import com.liferay.testray.rest.internal.util.TestrayUtil;
import com.liferay.testray.rest.resource.v1_0.TestrayRoutineMetricResource;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Joao Alves
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/testray-routine-metric.properties",
	scope = ServiceScope.PROTOTYPE, service = TestrayRoutineMetricResource.class
)
public class TestrayRoutineMetricResourceImpl
	extends BaseTestrayRoutineMetricResourceImpl {

	@Override
	public Page<TestrayRoutineMetric>
			getTestrayStatusMetricByTestrayProjectIdTestrayProjectTestrayRoutinesMetricsPage(
				Long testrayProjectId, String testrayCasePriorities,
				String testrayCaseTypes, Long testrayRoutineId,
				Long testrayTeamId, Pagination pagination)
		throws Exception {

		StringBundler sb = new StringBundler(34);

		sb.append("select count(cr.dueStatus_) as total, sum( case when ");
		sb.append("cr.dueStatus_ = 'blocked' then 1 else 0 end ) as blocked, ");
		sb.append("sum( case when cr.dueStatus_ = 'failed' then 1 else 0 end ");
		sb.append(") as failed, sum( case when cr.dueStatus_ = 'inprogress' ");
		sb.append("then 1 else 0 end ) as inprogress, sum( case when ");
		sb.append("cr.dueStatus_ = 'passed' then 1 else 0 end ) as passed, ");
		sb.append("sum(case when cr.dueStatus_ = 'testfix' then 1 else 0 end ");
		sb.append(") as testfix, sum( case when cr.dueStatus_ = 'untested' ");
		sb.append("then 1 else 0 end ) as untested, r.c_routineId_, r.name_, ");
		sb.append("b.dueDate_ from O_[%COMPANY_ID%]_Project p, ");
		sb.append("O_[%COMPANY_ID%]_Routine r, O_[%COMPANY_ID%]_CaseResult ");
		sb.append("cr, O_[%COMPANY_ID%]_Build b, O_[%COMPANY_ID%]_Case c, ");
		sb.append("O_[%COMPANY_ID%]_Component cp, O_[%COMPANY_ID%]_Team t ");
		sb.append("where p.c_projectId_ = ? and r.c_routineId_ = ");
		sb.append("b.r_routineToBuilds_c_routineId and ");
		sb.append("cr.r_buildToCaseResult_c_buildId = b.c_buildId_ and ");
		sb.append("p.c_projectId_ = r.r_routineToProjects_c_projectId and ");
		sb.append("cr.r_caseToCaseResult_c_caseId = c.c_caseId_ and ");
		sb.append("c.r_componentToCases_c_componentId = cp.c_componentId_ ");
		sb.append("and cp.r_teamToComponents_c_teamId = t.c_teamId_ and ");
		sb.append("b.c_buildId_ = ( select b2.c_buildId_ from ");
		sb.append("O_[%COMPANY_ID%]_Build b2 where ");
		sb.append("b2.r_routineToBuilds_c_routineId = r.c_routineId_ and ");
		sb.append("b2.dueDate_ = ( select max(b3.dueDate_) from ");
		sb.append("O_[%COMPANY_ID%]_Build b3 where ");
		sb.append("b3.r_routineToBuilds_c_routineId = r.c_routineId_ ) ) ");

		List<Object> params = new ArrayList<>();

		params.add(testrayProjectId);

		if (Validator.isNotNull(testrayCasePriorities)) {
			sb.append("and c.priority_ in (");
			sb.append(
				TestrayUtil.interpolateParams(params, testrayCasePriorities));
			sb.append(") ");
		}

		if (Validator.isNotNull(testrayCaseTypes)) {
			sb.append("and c.r_caseTypeToCases_c_caseTypeId in (");
			sb.append(TestrayUtil.interpolateParams(params, testrayCaseTypes));
			sb.append(") ");
		}

		if (Validator.isNotNull(testrayTeamId)) {
			sb.append("and t.c_teamId_ = ? ");
			params.add(testrayTeamId);
		}

		sb.append("group by  r.c_routineId_, r.name_, b.dueDate_ ");

		String sql = StringUtil.replace(
			sb.toString(), "[%COMPANY_ID%]",
			String.valueOf(contextCompany.getCompanyId()));

		long totalCount = TestrayUtil.getTotalCount(sql, params);

		sql += " limit ? offset ?";

		params.add(pagination.getPageSize());
		params.add(pagination.getStartPosition());

		List<Map<String, Object>> values = TestrayUtil.runSQL(sql, params);

		return Page.of(
			transform(
				values,
				value -> {
					TestrayRoutineMetric testrayRoutineMetric =
						new TestrayRoutineMetric();

					testrayRoutineMetric.setTestrayRoutineId(
						GetterUtil.getLong(value.get("c_routineId_")));
					testrayRoutineMetric.setTestrayRoutineName(
						GetterUtil.getString(value.get("name_")));
					testrayRoutineMetric.setTestrayStatusMetric(
						TestrayUtil.getTestrayStatusMetric(value));

					LocalDateTime localDateTime = (LocalDateTime)value.get(
						"dueDate_");

					testrayRoutineMetric.setCreateDate(
						Date.from(localDateTime.toInstant(ZoneOffset.UTC)));

					return testrayRoutineMetric;
				}),
			pagination, totalCount);
	}

}