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

package com.liferay.object.admin.rest.internal.dto.v1_0.converter;

import com.liferay.object.admin.rest.dto.v1_0.ObjectView;
import com.liferay.object.admin.rest.dto.v1_0.ObjectViewColumn;
import com.liferay.object.admin.rest.dto.v1_0.ObjectViewFilterColumn;
import com.liferay.object.admin.rest.dto.v1_0.ObjectViewSortColumn;
import com.liferay.object.field.filter.parser.ObjectFieldFilterParser;
import com.liferay.object.field.filter.parser.ObjectFieldFilterParserServicesTracker;
import com.liferay.object.model.ObjectField;
import com.liferay.object.service.ObjectFieldLocalService;
import com.liferay.object.util.LocalizedMapUtil;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.util.ListUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.vulcan.dto.converter.DTOConverter;
import com.liferay.portal.vulcan.dto.converter.DTOConverterContext;
import com.liferay.portal.vulcan.util.TransformUtil;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Feliphe Marinho
 */
@Component(
	property = "dto.class.name=com.liferay.object.model.ObjectView",
	service = {DTOConverter.class, ObjectViewDTOConverter.class}
)
public class ObjectViewDTOConverter
	implements DTOConverter<com.liferay.object.model.ObjectView, ObjectView> {

	@Override
	public String getContentType() {
		return ObjectView.class.getSimpleName();
	}

	@Override
	public ObjectView toDTO(
			DTOConverterContext dtoConverterContext,
			com.liferay.object.model.ObjectView serviceBuilderObjectView)
		throws Exception {

		if (serviceBuilderObjectView == null) {
			return null;
		}

		ObjectView objectView = new ObjectView() {
			{
				dateCreated = serviceBuilderObjectView.getCreateDate();
				dateModified = serviceBuilderObjectView.getModifiedDate();
				defaultObjectView =
					serviceBuilderObjectView.getDefaultObjectView();
				id = serviceBuilderObjectView.getObjectViewId();
				name = LocalizedMapUtil.getLanguageIdMap(
					serviceBuilderObjectView.getNameMap());
				objectDefinitionId =
					serviceBuilderObjectView.getObjectDefinitionId();
				objectViewColumns = TransformUtil.transformToArray(
					serviceBuilderObjectView.getObjectViewColumns(),
					(com.liferay.object.model.ObjectViewColumn
						objectViewColumn) -> _toObjectViewColumn(
							objectViewColumn),
					ObjectViewColumn.class);
				objectViewFilterColumns = TransformUtil.transformToArray(
					serviceBuilderObjectView.getObjectViewFilterColumns(),
					(com.liferay.object.model.ObjectViewFilterColumn
						objectViewFilterColumn) -> _toObjectViewFilterColumn(
							dtoConverterContext.getLocale(),
							serviceBuilderObjectView.getObjectDefinitionId(),
							objectViewFilterColumn),
					ObjectViewFilterColumn.class);
				objectViewSortColumns = TransformUtil.transformToArray(
					serviceBuilderObjectView.getObjectViewSortColumns(),
					(com.liferay.object.model.ObjectViewSortColumn
						objectViewSortColumn) -> _toObjectViewSortColumn(
							objectViewSortColumn),
					ObjectViewSortColumn.class);
			}
		};

		objectView.setActions(dtoConverterContext.getActions());

		return objectView;
	}

	private ObjectViewColumn _toObjectViewColumn(
		com.liferay.object.model.ObjectViewColumn
			serviceBuilderObjectViewColumn) {

		if (serviceBuilderObjectViewColumn == null) {
			return null;
		}

		return new ObjectViewColumn() {
			{
				id = serviceBuilderObjectViewColumn.getObjectViewColumnId();
				label = LocalizedMapUtil.getLanguageIdMap(
					serviceBuilderObjectViewColumn.getLabelMap());
				objectFieldName =
					serviceBuilderObjectViewColumn.getObjectFieldName();
				priority = serviceBuilderObjectViewColumn.getPriority();
			}
		};
	}

	private ObjectViewFilterColumn _toObjectViewFilterColumn(
		Locale locale, long objectDefinitionId,
		com.liferay.object.model.ObjectViewFilterColumn
			serviceBuilderObjectViewFilterColumn) {

		if (serviceBuilderObjectViewFilterColumn == null) {
			return null;
		}

		ObjectViewFilterColumn objectViewFilterColumn =
			new ObjectViewFilterColumn() {
				{
					id =
						serviceBuilderObjectViewFilterColumn.
							getObjectViewFilterColumnId();
					objectFieldName =
						serviceBuilderObjectViewFilterColumn.
							getObjectFieldName();
				}
			};

		if (Validator.isNull(
				serviceBuilderObjectViewFilterColumn.getFilterType())) {

			return objectViewFilterColumn;
		}

		objectViewFilterColumn.setFilterType(
			ObjectViewFilterColumn.FilterType.create(
				serviceBuilderObjectViewFilterColumn.getFilterType()));
		objectViewFilterColumn.setJson(
			serviceBuilderObjectViewFilterColumn.getJson());
		objectViewFilterColumn.setValueSummary(
			() -> {
				ObjectFieldFilterParser objectFieldFilterParser =
					_objectFieldFilterParserServicesTracker.
						getObjectFieldFilterParser(
							serviceBuilderObjectViewFilterColumn.
								getFilterType());

				if (Objects.equals(
						serviceBuilderObjectViewFilterColumn.
							getObjectFieldName(),
						"status")) {

					Map<String, Object> preloadedData =
						objectFieldFilterParser.parse(
							0L, locale, serviceBuilderObjectViewFilterColumn);

					return StringUtil.merge(
						ListUtil.toList(
							(List<Integer>)preloadedData.get("itemsValues"),
							itemValue -> _language.get(
								locale,
								WorkflowConstants.getStatusLabel(itemValue))),
						StringPool.COMMA_AND_SPACE);
				}

				ObjectField objectField =
					_objectFieldLocalService.fetchObjectField(
						objectDefinitionId,
						objectViewFilterColumn.getObjectFieldName());

				if (objectField.getListTypeDefinitionId() == 0) {
					return StringPool.BLANK;
				}

				Map<String, Object> preloadedData =
					objectFieldFilterParser.parse(
						objectField.getListTypeDefinitionId(), locale,
						serviceBuilderObjectViewFilterColumn);

				return StringUtil.merge(
					ListUtil.toList(
						(List<Map<String, String>>)preloadedData.get(
							"itemsValues"),
						itemValue -> itemValue.get("label")),
					StringPool.COMMA_AND_SPACE);
			});

		return objectViewFilterColumn;
	}

	private ObjectViewSortColumn _toObjectViewSortColumn(
		com.liferay.object.model.ObjectViewSortColumn
			serviceBuilderObjectViewSortColumn) {

		if (serviceBuilderObjectViewSortColumn == null) {
			return null;
		}

		return new ObjectViewSortColumn() {
			{
				id =
					serviceBuilderObjectViewSortColumn.
						getObjectViewSortColumnId();
				objectFieldName =
					serviceBuilderObjectViewSortColumn.getObjectFieldName();
				priority = serviceBuilderObjectViewSortColumn.getPriority();
				sortOrder = ObjectViewSortColumn.SortOrder.create(
					serviceBuilderObjectViewSortColumn.getSortOrder());
			}
		};
	}

	@Reference
	private Language _language;

	@Reference
	private ObjectFieldFilterParserServicesTracker
		_objectFieldFilterParserServicesTracker;

	@Reference
	private ObjectFieldLocalService _objectFieldLocalService;

}