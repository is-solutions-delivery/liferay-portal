package com.liferay.testray.rest.internal.resource.v1_0;

import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.testray.rest.dto.v1_0.TestrayRunComparison;
import com.liferay.testray.rest.resource.v1_0.TestrayRunComparisonResource;

import com.liferay.testray.service.CompareRunsService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Nilton Vieira
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/testray-run-comparison.properties",
	scope = ServiceScope.PROTOTYPE, service = TestrayRunComparisonResource.class
)
public class TestrayRunComparisonResourceImpl
	extends BaseTestrayRunComparisonResourceImpl {

	@Override
	public TestrayRunComparison getTestrayRunComparison(Long testrayRun1Id, Long testrayRun2Id) throws Exception {

		TestrayRunComparison testrayRunComparison = new TestrayRunComparison();

		testrayRunComparison.setResults(_compareRunsService.getComparison(contextCompany.getCompanyId(), testrayRun1Id, testrayRun2Id).toArray());

		return testrayRunComparison;
	}


	@Reference
	private CompareRunsService _compareRunsService;
}