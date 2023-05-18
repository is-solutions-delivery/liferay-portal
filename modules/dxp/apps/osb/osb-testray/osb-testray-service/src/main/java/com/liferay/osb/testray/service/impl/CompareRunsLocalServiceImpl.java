/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.osb.testray.service.impl;

import com.liferay.object.model.ObjectDefinition;
import com.liferay.object.petra.sql.dsl.DynamicObjectDefinitionTable;
import com.liferay.object.service.ObjectDefinitionLocalService;
import com.liferay.object.service.ObjectEntryLocalService;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.osb.testray.service.base.CompareRunsLocalServiceBaseImpl;
import com.liferay.petra.sql.dsl.Column;
import com.liferay.petra.sql.dsl.DSLQueryFactoryUtil;
import com.liferay.petra.sql.dsl.Table;
import com.liferay.petra.sql.dsl.query.JoinStep;
import com.liferay.portal.aop.AopService;
import com.liferay.portal.kernel.dao.orm.Criterion;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.dao.orm.RestrictionsFactoryUtil;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author José Abelenda
 * @author Felipe Veloso
 */
@Component(
	property = "model.class.name=com.liferay.osb.testray.model.CompareRuns",
	service = AopService.class
)
public class CompareRunsLocalServiceImpl
	extends CompareRunsLocalServiceBaseImpl {

	public int getComparison(
		long companyId, long runIdA, long runIdB, String statusA, String statusB) {

		DynamicObjectDefinitionTable testrayCaseExtensionDynamicTable =
			_getDynamicObjectDefinitionTable(true, _getObjectDefinitionByTableName(companyId, "_Case"));

		DynamicObjectDefinitionTable testrayCaseResultExtensionDynamicTable =
			_getDynamicObjectDefinitionTable(true, _getObjectDefinitionByTableName(companyId,"_CaseResult"));

		DynamicObjectDefinitionTable testrayCaseResultDynamicTable =
			_getDynamicObjectDefinitionTable( false, _getObjectDefinitionByTableName(companyId,"_CaseResult"));

		Column<DynamicObjectDefinitionTable, Long> testrayRunToCaseResultColumn =
			(Column<DynamicObjectDefinitionTable, Long>)
				testrayCaseResultExtensionDynamicTable.getColumn(
					"r_runToCaseResult_c_runId");

		Column<DynamicObjectDefinitionTable, String> testrayDueStatusColumn =
			(Column<DynamicObjectDefinitionTable, String>)
				testrayCaseResultDynamicTable.getColumn("dueStatus_");

		Column<DynamicObjectDefinitionTable, Long> testrayCaseToCaseResultIdColumn =
			(Column<DynamicObjectDefinitionTable, Long>)
				testrayCaseResultExtensionDynamicTable.getColumn(
					"r_caseToCaseResult_c_caseId");

		JoinStep joinStep = DSLQueryFactoryUtil.select(
			testrayCaseExtensionDynamicTable.getColumn("c_caseId_")
		).from(
			testrayCaseResultExtensionDynamicTable
		).innerJoinON(
			testrayCaseExtensionDynamicTable,
			testrayCaseExtensionDynamicTable.getPrimaryKeyColumn(
			).eq(
				testrayCaseToCaseResultIdColumn
			)
		).innerJoinON(
			testrayCaseResultDynamicTable,
			testrayCaseResultExtensionDynamicTable.getPrimaryKeyColumn(
			).eq(
				testrayCaseResultDynamicTable.getPrimaryKeyColumn()
			)
		);

		Collection<Column<?, ?>> tableTemplate = new ArrayList<Column<?, ?>>() {
		};

		Column<DynamicObjectDefinitionTable, Long> testrayCaseIdDynamicColumn =
			(Column<DynamicObjectDefinitionTable, Long>)
				testrayCaseExtensionDynamicTable.getColumn("c_caseId_");

		tableTemplate.add(testrayCaseIdDynamicColumn);

		Table table = joinStep.where(
			testrayRunToCaseResultColumn.eq(
				runIdA
			).and(
				testrayDueStatusColumn.eq(statusA)
			)
		).as(
			"table1", tableTemplate
		);

		Column<?, ?> testrayCaseIdColumn = table.getColumn("c_caseId_");

		return _objectEntryLocalService.dslQueryCount(
			DSLQueryFactoryUtil.count(
			).from(
				table
			).where(
				testrayCaseIdColumn.in(joinStep.where(testrayRunToCaseResultColumn.eq(
					runIdB
				).and(
					testrayDueStatusColumn.eq(statusB)
				)))
			));
	}

	private DynamicObjectDefinitionTable _getDynamicObjectDefinitionTable(
		boolean extension, ObjectDefinition objectDefinition) {

		if (extension) {
			return new DynamicObjectDefinitionTable(
				objectDefinition,
				_objectFieldLocalService.getObjectFields(
					objectDefinition.getObjectDefinitionId(),
					objectDefinition.getExtensionDBTableName()),
				objectDefinition.getExtensionDBTableName());
		}

		return new DynamicObjectDefinitionTable(
			objectDefinition,
			_objectFieldLocalService.getObjectFields(
				objectDefinition.getObjectDefinitionId(),
				objectDefinition.getDBTableName()),
			objectDefinition.getDBTableName());
	}

	private ObjectDefinition _getObjectDefinitionByTableName(
		long companyId, String tableName) {

		DynamicQuery dynamicQuery =
			_objectDefinitionLocalService.dynamicQuery();

		Criterion criterion = RestrictionsFactoryUtil.like(
			"dbTableName", "%" + String.valueOf(companyId) + tableName);

		RestrictionsFactoryUtil.and(
			criterion, RestrictionsFactoryUtil.eq("companyId", companyId));

		dynamicQuery.add(criterion);

		List<ObjectDefinition> objectDefinitionList =
			_objectDefinitionLocalService.dynamicQuery(dynamicQuery);

		return objectDefinitionList.get(0);
	}


	@Reference
	private ObjectDefinitionLocalService _objectDefinitionLocalService;

	@Reference
	private ObjectEntryLocalService _objectEntryLocalService;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

}