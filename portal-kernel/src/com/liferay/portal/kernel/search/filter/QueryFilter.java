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

package com.liferay.portal.kernel.search.filter;

import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.search.Query;
import com.liferay.portal.kernel.search.generic.TermQueryImpl;

/**
 * @author Michael C. Han
 */
public class QueryFilter extends BaseFilter {

	public QueryFilter(Query query) {
		_query = query;
	}

	@Override
	public <T> T accept(FilterVisitor<T> filterVisitor) {
		return filterVisitor.visit(this);
	}

	public Query getQuery() {
		return _query;
	}

	public String getField(){
		try {
			String field =
				((TermQueryImpl) getQuery()).getQueryTerm().getField();
			return field;
		}catch (Exception E){

			return null;
		}
	}

	public String getValue(){
		try {
			String value =
				((TermQueryImpl) getQuery()).getQueryTerm().getValue();
			return value;
		}catch (Exception E){

			return null;
		}
	}


	@Override
	public int getSortOrder() {
		return 30;
	}

	@Override
	public String toString() {
		return StringBundler.concat(
			"{(query=", _query, "), ", super.toString(), "}");
	}

	private final Query _query;

}