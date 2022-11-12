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

package com.liferay.portal.search.solr8.internal.search.engine.adapter.document;

import com.liferay.portal.kernel.search.query.QueryTranslator;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.search.engine.adapter.document.BulkableDocumentRequestTranslator;
import com.liferay.portal.search.engine.adapter.document.DocumentRequestExecutor;
import com.liferay.portal.search.internal.document.DocumentBuilderFactoryImpl;
import com.liferay.portal.search.solr8.internal.connection.SolrClientManager;
import com.liferay.portal.search.solr8.internal.document.SolrDocumentFactory;

import java.util.Map;

/**
 * @author Bryan Engler
 */
public class DocumentRequestExecutorFixture {

	public DocumentRequestExecutor getDocumentRequestExecutor() {
		return _documentRequestExecutor;
	}

	public void setUp() {
		_documentRequestExecutor = createDocumentRequestExecutor(
			_queryTranslator, _solrClientManager, _solrDocumentFactory);
	}

	protected static BulkableDocumentRequestTranslator
		createBulkableDocumentRequestTranslator(
			SolrDocumentFactory solrDocumentFactory) {

		SolrBulkableDocumentRequestTranslator
			solrBulkableDocumentRequestTranslator =
				new SolrBulkableDocumentRequestTranslator();

		ReflectionTestUtil.setFieldValue(
			solrBulkableDocumentRequestTranslator, "_solrDocumentFactory",
			solrDocumentFactory);

		return solrBulkableDocumentRequestTranslator;
	}

	protected static BulkDocumentRequestExecutor
		createBulkDocumentRequestExecutor(
			SolrClientManager solrClientManager,
			SolrDocumentFactory solrDocumentFactory) {

		BulkDocumentRequestExecutorImpl bulkDocumentRequestExecutorImpl =
			new BulkDocumentRequestExecutorImpl() {
				{
					activate(_properties);
				}
			};

		ReflectionTestUtil.setFieldValue(
			bulkDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);
		ReflectionTestUtil.setFieldValue(
			bulkDocumentRequestExecutorImpl, "_solrDocumentFactory",
			solrDocumentFactory);

		return bulkDocumentRequestExecutorImpl;
	}

	protected static DeleteByQueryDocumentRequestExecutor
		createDeleteByQueryDocumentRequestExecutor(
			QueryTranslator<String> queryTranslator,
			SolrClientManager solrClientManager) {

		DeleteByQueryDocumentRequestExecutorImpl
			deleteByQueryDocumentRequestExecutorImpl =
				new DeleteByQueryDocumentRequestExecutorImpl() {
					{
						activate(_properties);
					}
				};

		ReflectionTestUtil.setFieldValue(
			deleteByQueryDocumentRequestExecutorImpl, "_queryTranslator",
			queryTranslator);
		ReflectionTestUtil.setFieldValue(
			deleteByQueryDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);

		return deleteByQueryDocumentRequestExecutorImpl;
	}

	protected static DeleteDocumentRequestExecutor
		createDeleteDocumentRequestExecutor(
			BulkableDocumentRequestTranslator bulkableDocumentRequestTranslator,
			SolrClientManager solrClientManager) {

		DeleteDocumentRequestExecutorImpl deleteDocumentRequestExecutorImpl =
			new DeleteDocumentRequestExecutorImpl();

		ReflectionTestUtil.setFieldValue(
			deleteDocumentRequestExecutorImpl,
			"_bulkableDocumentRequestTranslator",
			bulkableDocumentRequestTranslator);
		ReflectionTestUtil.setFieldValue(
			deleteDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);

		return deleteDocumentRequestExecutorImpl;
	}

	protected static DocumentRequestExecutor createDocumentRequestExecutor(
		QueryTranslator<String> queryTranslator,
		SolrClientManager solrClientManager,
		SolrDocumentFactory solrDocumentFactory) {

		BulkableDocumentRequestTranslator bulkableDocumentRequestTranslator =
			createBulkableDocumentRequestTranslator(solrDocumentFactory);

		SolrDocumentRequestExecutor solrDocumentRequestExecutor =
			new SolrDocumentRequestExecutor();

		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor, "_bulkDocumentRequestExecutor",
			createBulkDocumentRequestExecutor(
				solrClientManager, solrDocumentFactory));
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor,
			"_deleteByQueryDocumentRequestExecutor",
			createDeleteByQueryDocumentRequestExecutor(
				queryTranslator, solrClientManager));
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor, "_deleteDocumentRequestExecutor",
			createDeleteDocumentRequestExecutor(
				bulkableDocumentRequestTranslator, solrClientManager));
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor, "_getDocumentRequestExecutor",
			createGetDocumentRequestExecutor(
				bulkableDocumentRequestTranslator, solrClientManager));
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor, "_indexDocumentRequestExecutor",
			createIndexDocumentRequestExecutor(
				bulkableDocumentRequestTranslator, solrClientManager));
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor,
			"_updateByQueryDocumentRequestExecutor",
			createUpdateByQueryDocumentRequestExecutor());
		ReflectionTestUtil.setFieldValue(
			solrDocumentRequestExecutor, "_updateDocumentRequestExecutor",
			createUpdateDocumentRequestExecutor(
				bulkableDocumentRequestTranslator, solrClientManager));

		return solrDocumentRequestExecutor;
	}

	protected static GetDocumentRequestExecutor
		createGetDocumentRequestExecutor(
			BulkableDocumentRequestTranslator bulkableDocumentRequestTranslator,
			SolrClientManager solrClientManager) {

		GetDocumentRequestExecutorImpl getDocumentRequestExecutorImpl =
			new GetDocumentRequestExecutorImpl();

		ReflectionTestUtil.setFieldValue(
			getDocumentRequestExecutorImpl,
			"_bulkableDocumentRequestTranslator",
			bulkableDocumentRequestTranslator);
		ReflectionTestUtil.setFieldValue(
			getDocumentRequestExecutorImpl, "_documentBuilderFactory",
			new DocumentBuilderFactoryImpl());
		ReflectionTestUtil.setFieldValue(
			getDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);

		return getDocumentRequestExecutorImpl;
	}

	protected static IndexDocumentRequestExecutor
		createIndexDocumentRequestExecutor(
			BulkableDocumentRequestTranslator bulkableDocumentRequestTranslator,
			SolrClientManager solrClientManager) {

		IndexDocumentRequestExecutorImpl indexDocumentRequestExecutorImpl =
			new IndexDocumentRequestExecutorImpl();

		ReflectionTestUtil.setFieldValue(
			indexDocumentRequestExecutorImpl,
			"_bulkableDocumentRequestTranslator",
			bulkableDocumentRequestTranslator);
		ReflectionTestUtil.setFieldValue(
			indexDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);

		return indexDocumentRequestExecutorImpl;
	}

	protected static UpdateByQueryDocumentRequestExecutor
		createUpdateByQueryDocumentRequestExecutor() {

		return new UpdateByQueryDocumentRequestExecutorImpl();
	}

	protected static UpdateDocumentRequestExecutor
		createUpdateDocumentRequestExecutor(
			BulkableDocumentRequestTranslator bulkableDocumentRequestTranslator,
			SolrClientManager solrClientManager) {

		UpdateDocumentRequestExecutorImpl updateDocumentRequestExecutorImpl =
			new UpdateDocumentRequestExecutorImpl();

		ReflectionTestUtil.setFieldValue(
			updateDocumentRequestExecutorImpl,
			"_bulkableDocumentRequestTranslator",
			bulkableDocumentRequestTranslator);
		ReflectionTestUtil.setFieldValue(
			updateDocumentRequestExecutorImpl, "_solrClientManager",
			solrClientManager);

		return updateDocumentRequestExecutorImpl;
	}

	protected void setProperties(Map<String, Object> properties) {
		_properties = properties;
	}

	protected void setQueryTranslator(QueryTranslator<String> queryTranslator) {
		_queryTranslator = queryTranslator;
	}

	protected void setSolrClientManager(SolrClientManager solrClientManager) {
		_solrClientManager = solrClientManager;
	}

	protected void setSolrDocumentFactory(
		SolrDocumentFactory solrDocumentFactory) {

		_solrDocumentFactory = solrDocumentFactory;
	}

	private static Map<String, Object> _properties;

	private DocumentRequestExecutor _documentRequestExecutor;
	private QueryTranslator<String> _queryTranslator;
	private SolrClientManager _solrClientManager;
	private SolrDocumentFactory _solrDocumentFactory;

}