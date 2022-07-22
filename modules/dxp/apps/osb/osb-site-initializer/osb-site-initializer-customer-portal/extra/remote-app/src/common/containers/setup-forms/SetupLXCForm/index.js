/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {Button} from '@clayui/core';
import ClayForm from '@clayui/form';
import {FieldArray, Formik} from 'formik';
import i18n from '../../../I18n';
import {Input, Select} from '../../../components';
import getInititalLXCInvite from '../../../utils/getInititalLXCInvite';
import Layout from '../Layout';
import ProjectsAdminContact from './ProjectsAdminContact';

const INITIAL_SETUP_ADMIN_COUNT = 1;

// const MAXIMUM_NUMBER_OF_CHARACTERS = 77;

const SetupLXCPage = ({setOpenModal, values}) => {
	return (
		<div
			className="bg-white position-absolute"
			style={{
				zIndex: 2,
			}}
		>
			<Layout
				className="bg-white pt-1 px-3"
				footerProps={{
					leftButton: (
						<Button
							borderless
							className="text-neutral-10"
							onClick={() => setOpenModal(false)}
						>
							{i18n.translate('cancel')}
						</Button>
					),
					middleButton: (
						<Button disabled={false} displayType="primary">
							{i18n.translate('submit')}
						</Button>
					),
				}}
				headerProps={{
					helper: i18n.translate(
						'We’ll need a few details to finish building your Liferay Exoerience Cloud environment(s).'
					),
					title: i18n.translate('Set up Liferay Experience Cloud'),
				}}
			>
				<FieldArray
					name="admin.projectsAdminContact"
					render={({pop, push}) => (
						<>
							<div
								className="d-flex justify-content-between mb-2 pb-1 pl-3"
								style={{
									backgroundColor: 'white',
									zIndex: 1,
								}}
							>
								<div className="mr-4 pr-2">
									<label>
										{i18n.translate('Organization Name')}
									</label>

									<p className="text-neutral-6 text-paragraph-lg">
										<strong>SuperBank</strong>
									</p>
								</div>

								<div className="flex-fill">
									<label>
										{i18n.translate('Liferay DXP Version')}
									</label>

									<p className="text-neutral-6 text-paragraph-lg">
										<strong>7.3</strong>
									</p>
								</div>
							</div>
							<ClayForm.Group className="mb-0">
								<ClayForm.Group className="mb-0 pb-1">
									<Input
										groupStyle="pb-1"
										helper={i18n.translate(
											'Lowercase letters and numbers only. Project IDs cannot be changed. '
										)}
										label={i18n.translate('project-id')}
										name="admin.projectId"
										placeholder="ProjectID"
										required
										type="text"
									/>

									<Select
										groupStyle="pb-1"
										label={i18n.translate('Primary Region')}
										name="admin.primaryRegion"
										options={[
											{
												disabled: false,
												label: 'Select an option',

												value: '0',
											},

											{
												disabled: false,
												label: 'Europe',
												value: '1',
											},
											{
												disabled: false,
												label: 'Noth America',
												value: '2',
											},
											{
												disabled: false,
												label: 'South America',
												value: '3',
											},
										]}
										required
									/>
								</ClayForm.Group>

								<hr />

								{values?.admin?.projectsAdminContact?.map(
									(admin, index) => (
										<ProjectsAdminContact
											admin={admin}
											id={index}
											key={index}
										/>
									)
								)}
							</ClayForm.Group>

							{values?.admin?.projectsAdminContact.length >
								INITIAL_SETUP_ADMIN_COUNT && (
								<Button
									className="ml-3 my-2 text-brandy-secondary"
									displayType="secondary"
									onClick={() => pop()}
									small
								>
									{i18n.translate('- Remove Project Admin')}
								</Button>
							)}

							<Button
								className="btn-outline-primary ml-3 my-2 rounded-xs"
								onClick={() => {
									push(getInititalLXCInvite());
								}}
								small
							>
								{i18n.translate('+ Add Project Admin')}
							</Button>

							<hr />

							<ClayForm.Group>
								<Input
									groupStyle="pb-1"
									label={i18n.translate(
										'Incident Management Contact’s First and Last Name'
									)}
									name="admin.name"
									placeholder="User Name"
									required
									type="text"
								/>

								<Input
									groupStyle="pb-1"
									helper={i18n.translate(
										'Please enter an individual email ID. Group email IDs are not allowed.'
									)}
									label={i18n.translate(
										'Incident Management Contact’s Email Address'
									)}
									name="admin.email"
									placeholder="user@mycompany.com"
									required
									type="email"
								/>
							</ClayForm.Group>
						</>
					)}
				/>
			</Layout>
		</div>
	);
};

const SetupLXCForm = (props) => {
	return (
		<Formik
			initialValues={{
				activations: {
					incidentManagementEmail: '',
					incidentManagementName: '',
					primaryRegion: '',
					projectId: '',
					projectsAdminContact: [getInititalLXCInvite()],
				},
				admin: {
					projectsAdminContact: [getInititalLXCInvite()],
				},
			}}
			validateOnChange
		>
			{(formikProps) => <SetupLXCPage {...props} {...formikProps} />}
		</Formik>
	);
};

export default SetupLXCForm;
