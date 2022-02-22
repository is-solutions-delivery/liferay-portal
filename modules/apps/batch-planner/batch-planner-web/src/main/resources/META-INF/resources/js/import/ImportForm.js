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

import ClayLink from '@clayui/link';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef, useState} from 'react';

import SaveTemplate from '../SaveTemplate';
import {
	FILE_SCHEMA_EVENT,
	SCHEMA_SELECTED_EVENT,
	TEMPLATE_SELECTED_EVENT,
	TEMPLATE_SOILED_EVENT,
} from '../constants';
import getFieldsFromSchema from '../getFieldsFromSchema';
import {getAvailableMappings} from '../utilities/mappings';
import ImportMappingItem from './ImportMappingItem';
import ImportSubmit from './ImportSubmit';

function ImportForm({
	backUrl,
	formDataQuerySelector,
	formImportURL,
	formSaveAsTemplateURL,
	mappedFields,
	portletNamespace,
}) {
	const [dbFields, setDbFields] = useState();
	const [formEvaluated, setFormEvaluated] = useState(false);
	const [fileFields, setFileFields] = useState();
	const [fieldsSelections, setFieldsSelections] = useState({});
	const [mappingsToBeEvaluated, setMappingsToBeEvaluated] = useState(
		mappedFields
	);
	const useTemplateMappingRef = useRef();

	const formIsValid = useMemo(() => {
		if (!Object.keys(fieldsSelections).length || !dbFields) {
			return false;
		}

		const requiredFieldNotFilled = dbFields.some(
			(dbField) => dbField.required && !fieldsSelections[dbField.name]
		);

		return !requiredFieldNotFilled;
	}, [fieldsSelections, dbFields]);

	const updateFieldMapping = (fileField, dbFieldName) => {
		setFieldsSelections((prevSelections) => ({
			...prevSelections,
			[dbFieldName]: fileField,
		}));

		Liferay.fire(TEMPLATE_SOILED_EVENT);
	};

	useEffect(() => {
		if (dbFields && fileFields && !useTemplateMappingRef.current) {
			const availableMappings = getAvailableMappings(
				mappingsToBeEvaluated,
				fileFields,
				dbFields
			);

			setFieldsSelections(availableMappings);
		}
	}, [dbFields, fileFields, mappingsToBeEvaluated]);

	useEffect(() => {
		function handleSchemaUpdated({schema}) {
			if (schema) {
				const newDBFields = getFieldsFromSchema(schema);

				setDbFields(newDBFields);
			}
		}

		function handleFileSchemaUpdate({schema}) {
			setFileFields(schema);
		}

		function handleTemplateSelect({template}) {
			if (template) {
				setMappingsToBeEvaluated(template.mappings);
			}
		}

		Liferay.on(FILE_SCHEMA_EVENT, handleFileSchemaUpdate);
		Liferay.on(SCHEMA_SELECTED_EVENT, handleSchemaUpdated);
		Liferay.on(TEMPLATE_SELECTED_EVENT, handleTemplateSelect);

		return () => {
			Liferay.detach(FILE_SCHEMA_EVENT, handleFileSchemaUpdate);
			Liferay.detach(SCHEMA_SELECTED_EVENT, handleSchemaUpdated);
			Liferay.detach(TEMPLATE_SELECTED_EVENT, handleTemplateSelect);
		};
	}, []);

	const formIsVisible = fileFields?.length > 0 && dbFields?.length > 0;

	return (
		<>
			{formIsVisible && (
				<div className="card import-mapping-table">
					<h4 className="card-header">
						{Liferay.Language.get('import-mappings')}
					</h4>

					<div className="card-body">
						<div className="lfr-form-content">
							<div className="autofit-section">
								{dbFields?.map((dbField) => (
									<ImportMappingItem
										dbField={dbField}
										fileFields={fileFields}
										formEvaluated={formEvaluated}
										key={dbField.name}
										portletNamespace={portletNamespace}
										selectedFileField={
											fieldsSelections[dbField.name] || ''
										}
										updateFieldMapping={(
											selectedFileField
										) =>
											updateFieldMapping(
												selectedFileField,
												dbField.name
											)
										}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="mt-4" id="formButtons">
				<div className="sheet-footer">
					<ClayLink className="btn btn-secondary" href={backUrl}>
						{Liferay.Language.get('cancel')}
					</ClayLink>

					<SaveTemplate
						evaluateForm={() => setFormEvaluated(true)}
						formIsValid={formIsValid}
						formIsVisible={formIsVisible}
						formSaveAsTemplateDataQuerySelector={
							formDataQuerySelector
						}
						formSaveAsTemplateURL={formSaveAsTemplateURL}
						portletNamespace={portletNamespace}
						type="import"
					/>

					<ImportSubmit
						evaluateForm={() => setFormEvaluated(true)}
						formDataQuerySelector={formDataQuerySelector}
						formImportURL={formImportURL}
						formIsValid={formIsValid}
						formIsVisible={formIsVisible}
						portletNamespace={portletNamespace}
					/>
				</div>
			</div>
		</>
	);
}

ImportForm.defaultProps = {
	mappedFields: {},
};

ImportForm.propTypes = {
	backUrl: PropTypes.string.isRequired,
	formDataQuerySelector: PropTypes.string.isRequired,
	formImportURL: PropTypes.string.isRequired,
	formSaveAsTemplateURL: PropTypes.string.isRequired,
	portletNamespace: PropTypes.string.isRequired,
};

export default ImportForm;
