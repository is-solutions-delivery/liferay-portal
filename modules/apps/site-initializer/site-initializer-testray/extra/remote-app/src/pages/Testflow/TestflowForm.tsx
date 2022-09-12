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

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';

import BreadcrumbFinder from '../../components/BreadcrumbFinder';
import BreadcrumbSearch from '../../components/BreadcrumbSearch';
import Form from '../../components/Form';
import Container from '../../components/Layout/Container';
import {useFetch} from '../../hooks/useFetch';
import useFormActions from '../../hooks/useFormActions';
import useFormModal from '../../hooks/useFormModal';
import i18n from '../../i18n';
import yupSchema, {yupResolver} from '../../schema/yup';
import {
	TestrayCaseType,
	testRayTaskRest,
	testrayBuildImpl,
	testrayProjectImpl,
	testrayRoutineImpl,
} from '../../services/rest';
import {searchUtil} from '../../util/search';
import {UserListView} from '../Manage/User';
import TestflowAssignUserModal from './modal';

type TestflowFormType = typeof yupSchema.task.__outputType;

const TestflowForm = () => {
	const urlParams = useParams();
	const [users, setUsers] = useState([]);
	const [modalType, setModalType] = useState('assign-users');
	const {data} = useFetch('/casetypes');

	const caseTypes = data?.items || [];

	const {modal} = useFormModal({
		onSave: setUsers,
	});

	const onOpenModal = (option: 'assign-users' | 'assign-user-groups') => {
		setModalType(option);

		modal.open();
	};

	const {
		formState: {errors},
		handleSubmit,
		register,
		setValue,
		watch,
	} = useForm<TestflowFormType>({
		defaultValues: urlParams.buildId
			? {
					build: Number(urlParams.buildId),
					caseTypes: [],
					dueStatus: 1,
					project: 0,
					routine: Number(urlParams.routineId),
					userToTasks: [],
			  }
			: {
					caseTypes: [],
					dueStatus: 1,
			  },
		resolver: yupResolver(yupSchema.task),
	});

	const {
		form: {onClose, onError, onSave, onSubmit /* onSuccess*/},
	} = useFormActions();

	const _onSubmit = (form: TestflowFormType) => {
		// eslint-disable-next-line no-console
		console.log('FORM', form);

		onSubmit(
			{...form},
			{
				create: (...params) => testRayTaskRest?.create(...params),
				update: (...params) => testRayTaskRest?.update(...params),
			}
		)
			.then(() => {
				// onSuccess();

				return onSave();
			})

			.catch(onError);
	};

	const inputProps = {
		errors,
		register,
	};

	const onClick = (name: any, value: any) => setValue(name, value.id);

	const caseTypesWatch = watch('caseTypes') as number[];

	const onClickCaseType = (event: any) => {
		const value = Number(event.target.value);

		const caseTypesFiltered = caseTypesWatch.includes(value)
			? caseTypesWatch.filter((caseTypeId) => caseTypeId !== value)
			: [...caseTypesWatch, value];

		setValue('caseTypes', caseTypesFiltered);
	};

	useEffect(() => {
		setValue('userToTasks', users);
		setValue('dueStatus', 0);
	}, [setValue, users]);

	const getBreadCrumbValue = (value: any) => {
		// eslint-disable-next-line no-console
		console.log(value);
	};

	return (
		<Container className="container">
			<BreadcrumbSearch onClick={getBreadCrumbValue} />

			<Form.Divider />

			<ClayInput.GroupItem shrink>
				<Form.Input
					{...inputProps}
					label={i18n.translate('name')}
					name="name"
					size={42}
				/>
			</ClayInput.GroupItem>

			{!urlParams.buildId && (
				<>
					<ClayForm.Group>
						<ClayInput.Group className="d-flex justify-content-between">
							<BreadcrumbFinder />

							<ClayInput.GroupItem className="col-4 m-0" shrink>
								<Form.AutoComplete
									{...inputProps}
									label="project"
									onClick={onClick}
									onSearch={(keyword) =>
										`contains(name, '${keyword}')`
									}
									resource="/projects"
									transformData={(response) =>
										testrayProjectImpl.transformDataFromList(
											response
										)
									}
								/>
							</ClayInput.GroupItem>

							<ClayInput.GroupItem className="col-4 m-0" shrink>
								<Form.AutoComplete
									{...inputProps}
									label="routine"
									onClick={onClick}
									onSearch={(keyword) =>
										`contains(name, '${keyword}')`
									}
									resource="/routines"
									transformData={(response) =>
										testrayRoutineImpl.transformDataFromList(
											response
										)
									}
								/>
							</ClayInput.GroupItem>

							<ClayInput.GroupItem className="col-4 m-0" shrink>
								<Form.AutoComplete
									{...inputProps}
									label="build"
									onClick={onClick}
									onSearch={(keyword) =>
										`contains(name, '${keyword}')`
									}
									resource={testrayBuildImpl.resource}
									transformData={(response) =>
										testrayBuildImpl.transformDataFromList(
											response
										)
									}
								/>
							</ClayInput.GroupItem>
						</ClayInput.Group>
					</ClayForm.Group>
					<Form.Divider />
				</>
			)}

			<Form.Clay.Group>
				<label className="mb-2">{i18n.translate('case-type')}</label>

				<div className="d-flex flex-wrap">
					{caseTypes.map(
						(caseType: TestrayCaseType, index: number) => (
							<div className="col-4" key={index}>
								<Form.Checkbox
									checked={caseTypesWatch.includes(
										caseType.id
									)}
									label={caseType.name}
									name={caseType.name}
									onChange={onClickCaseType}
									value={caseType.id}
								/>
							</div>
						)
					)}
				</div>
			</Form.Clay.Group>

			<Form.Divider />

			<h5>{i18n.translate('users')}</h5>

			<Form.Clay.Group>
				<ClayButton
					displayType="secondary"
					onClick={() => onOpenModal('assign-users')}
				>
					{i18n.translate('assign-users')}
				</ClayButton>

				<ClayButton
					className="ml-2"
					displayType="secondary"
					onClick={() => onOpenModal('assign-user-groups')}
				>
					{i18n.translate('assign-user-groups')}
				</ClayButton>
			</Form.Clay.Group>

			{!!users.length && (
				<UserListView
					listViewProps={{
						managementToolbarProps: {visible: false},
						variables: {filter: searchUtil.in('id', users)},
					}}
				/>
			)}

			<Form.Divider />

			<div className="d-flex justify-content-end">
				<Form.Footer
					onClose={() => onClose()}
					onSubmit={handleSubmit(_onSubmit)}
				/>
			</div>

			<TestflowAssignUserModal modal={modal} type={modalType as any} />
		</Container>
	);
};

export default TestflowForm;
