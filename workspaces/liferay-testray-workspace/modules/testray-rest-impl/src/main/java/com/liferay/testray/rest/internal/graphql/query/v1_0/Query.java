package com.liferay.testray.rest.internal.graphql.query.v1_0;

import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.search.filter.Filter;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.testray.rest.dto.v1_0.TestrayComparison;
import com.liferay.testray.rest.resource.v1_0.TestrayComparisonResource;

import java.util.Map;
import java.util.function.BiFunction;

import javax.annotation.Generated;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.core.UriInfo;

import org.osgi.service.component.ComponentServiceObjects;

/**
 * @author Nilton Vieira
 * @generated
 */
@Generated("")
public class Query {

	public static void setTestrayComparisonResourceComponentServiceObjects(
		ComponentServiceObjects<TestrayComparisonResource>
			testrayComparisonResourceComponentServiceObjects) {

		_testrayComparisonResourceComponentServiceObjects =
			testrayComparisonResourceComponentServiceObjects;
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {testrayRunComparisonTestrayRunId1TestrayRunId2(testrayCasePriorities: ___, testrayRunId1: ___, testrayRunId2: ___, testrayTeamId: ___){testrayComponentComparisons, testrayRunComparison, testrayTeamComparisons}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public TestrayComparison testrayRunComparisonTestrayRunId1TestrayRunId2(
			@GraphQLName("testrayRunId1") Long testrayRunId1,
			@GraphQLName("testrayRunId2") Long testrayRunId2,
			@GraphQLName("testrayCasePriorities") String testrayCasePriorities,
			@GraphQLName("testrayTeamId") Long testrayTeamId)
		throws Exception {

		return _applyComponentServiceObjects(
			_testrayComparisonResourceComponentServiceObjects,
			this::_populateResourceContext,
			testrayComparisonResource ->
				testrayComparisonResource.
					getTestrayRunComparisonTestrayRunId1TestrayRunId2(
						testrayRunId1, testrayRunId2, testrayCasePriorities,
						testrayTeamId));
	}

	@GraphQLName("TestrayComparisonPage")
	public class TestrayComparisonPage {

		public TestrayComparisonPage(Page testrayComparisonPage) {
			actions = testrayComparisonPage.getActions();

			items = testrayComparisonPage.getItems();
			lastPage = testrayComparisonPage.getLastPage();
			page = testrayComparisonPage.getPage();
			pageSize = testrayComparisonPage.getPageSize();
			totalCount = testrayComparisonPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<TestrayComparison> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

	}

	private <T, R, E1 extends Throwable, E2 extends Throwable> R
			_applyComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeFunction<T, R, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			return unsafeFunction.apply(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private void _populateResourceContext(
			TestrayComparisonResource testrayComparisonResource)
		throws Exception {

		testrayComparisonResource.setContextAcceptLanguage(_acceptLanguage);
		testrayComparisonResource.setContextCompany(_company);
		testrayComparisonResource.setContextHttpServletRequest(
			_httpServletRequest);
		testrayComparisonResource.setContextHttpServletResponse(
			_httpServletResponse);
		testrayComparisonResource.setContextUriInfo(_uriInfo);
		testrayComparisonResource.setContextUser(_user);
		testrayComparisonResource.setGroupLocalService(_groupLocalService);
		testrayComparisonResource.setRoleLocalService(_roleLocalService);
	}

	private static ComponentServiceObjects<TestrayComparisonResource>
		_testrayComparisonResourceComponentServiceObjects;

	private AcceptLanguage _acceptLanguage;
	private com.liferay.portal.kernel.model.Company _company;
	private BiFunction<Object, String, Filter> _filterBiFunction;
	private GroupLocalService _groupLocalService;
	private HttpServletRequest _httpServletRequest;
	private HttpServletResponse _httpServletResponse;
	private RoleLocalService _roleLocalService;
	private BiFunction<Object, String, Sort[]> _sortsBiFunction;
	private UriInfo _uriInfo;
	private com.liferay.portal.kernel.model.User _user;

}