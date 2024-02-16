/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {Dispatch, SetStateAction, useState} from 'react';
import {useParams} from 'react-router-dom';

import Form from '../../../../components/Form';
import ListView from '../../../../components/ListView';
import Modal from '../../../../components/Modal';
import SearchBuilder from '../../../../core/SearchBuilder';
import {withVisibleContent} from '../../../../hoc/withVisibleContent';
import {FormModalOptions} from '../../../../hooks/useFormModal';
import i18n from '../../../../i18n';
import {TestraySuite} from '../../../../services/rest';
import SelectSuitesCases from './SelectSuitesCases';

type BuildSelectSuitesModalProps = {
	displayTitle?: boolean;
	modal: FormModalOptions;
	setModalContext: Dispatch<SetStateAction<'cases' | 'suites'>>;
	suiteIds: number[];
};

type ModalType = {
	selectedSuite?: TestraySuite;
	type: 'select-cases' | 'select-suites';
};

const BuildSelectSuitesModal: React.FC<BuildSelectSuitesModalProps> = ({
	displayTitle = false,
	modal: {modalState, observer, onClose, onSave, visible},
	setModalContext,
	suiteIds,
}) => {
	const [selectedCaseIds, setSelectedCaseIds] = useState<number[]>([]);
	const [selectedSuiteIds, setSelectedSuiteIds] = useState<number[]>([]);
	const {projectId} = useParams();
	const [modalType, setModalType] = useState<ModalType>({
		type: 'select-suites',
	});

	function onSubmit() {
		if (modalType.type === 'select-cases') {
			return onSave(selectedCaseIds);
		}

		if (modalType.type === 'select-suites') {
			onSave(selectedSuiteIds);
		}
	}

	return (
		<Modal
			last={
				<Form.Footer
					onClose={() => {
						if (modalType.type === 'select-suites') {
							onClose();

							return;
						}

						setModalContext('suites');
						setModalType({
							type: 'select-suites',
						});
					}}
					onSubmit={() => onSubmit()}
					primaryButtonProps={{
						title: i18n.translate(modalType.type),
					}}
					secondaryButtonProps={{
						title: i18n.translate(
							modalType.type === 'select-cases'
								? 'back'
								: 'cancel'
						),
					}}
				/>
			}
			observer={observer}
			size="full-screen"
			title={i18n.translate(modalType.type)}
			visible={visible}
		>
			{modalType.type === 'select-cases' && modalType.selectedSuite && (
				<SelectSuitesCases
					selectedCaseIds={modalState}
					setState={setSelectedCaseIds}
					testraySuite={modalType.selectedSuite}
				/>
			)}

			{modalType.type === 'select-suites' && (
				<ListView
					initialContext={{selectedRows: suiteIds}}
					managementToolbarProps={{
						filterSchema: 'suites',
						title: displayTitle ? i18n.translate('suites') : '',
					}}
					onContextChange={({selectedRows}) =>
						setSelectedSuiteIds(selectedRows)
					}
					resource="/suites"
					tableProps={{
						columns: [
							{
								clickable: true,
								key: 'name',
								render: (name: string, selectedSuite) => (
									<div
										onClick={() => {
											setModalContext('cases');
											setModalType({
												selectedSuite,
												type: 'select-cases',
											});
										}}
									>
										<span>{name}</span>
									</div>
								),
								sorteable: true,
								value: i18n.translate('name'),
							},
							{
								key: 'description',
								value: i18n.translate('description'),
							},
						],
						rowSelectable: true,
					}}
					variables={{
						filter: SearchBuilder.eq(
							'projectId',
							projectId as string
						),
					}}
				/>
			)}
		</Modal>
	);
};

export default withVisibleContent(BuildSelectSuitesModal);
