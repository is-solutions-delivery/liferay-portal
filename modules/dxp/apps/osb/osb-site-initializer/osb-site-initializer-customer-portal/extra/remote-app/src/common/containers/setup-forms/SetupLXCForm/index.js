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

import ClayForm from '@clayui/form';
import {FieldArray, Formik} from 'formik';
import {useEffect, useMemo, useState} from 'react';
import i18n from '../../../I18n';
import {Button, Input, Select} from '../../../components';
import {useAppPropertiesContext} from '../../../contexts/AppPropertiesContext';
import {getListTypeDefinitions} from '../../../services/liferay/graphql/queries';
import getInititalLXCInvite from '../../../utils/getInititalLXCInvite';
import Layout from '../Layout';
import ConfirmationLXCMessageModal from './ConfirmationLXCMessageModal';
import ProjectsAdminContact from './ProjectsAdminContact';
const INITIAL_SETUP_ADMIN_COUNT = 1;

// const MAXIMUM_NUMBER_OF_CHARACTERS = 77;

const SetupLXCPage = ({errors, listType, setOpenModal, touched, values}) => {
	const [isSuccess, setIsSuccess] = useState(false);

	const [baseButtonDisabled, setBaseButtonDisabled] = useState(true);

	const {client} = useAppPropertiesContext();

	const [listItem, setListItem] = useState([]);

	useEffect(() => {
		const hasTouched = !Object.keys(touched).length;
		const hasError = Object.keys(errors).length;

		setBaseButtonDisabled(hasTouched || hasError);
	}, [touched, errors]);

	useEffect(() => {
		const fetchListPrimaryRegions = async () => {
			const {data} = await client.query({
				query: getListTypeDefinitions,
				variables: {filter: `name eq '${listType}'`},
			});
			const items = data.listTypeDefinitions.items[0].listTypeEntries;

			setListItem(items);
		};
		fetchListPrimaryRegions();
	}, [client, listType]);

	const primaryRegionList = useMemo(
		() =>
			listItem.map(({name}) => ({
				label: name,
				value: name,
			})) || [],
		[listItem]
	);

	if (isSuccess) {
		return (
			<ConfirmationLXCMessageModal
				handlePage={() => {
					setOpenModal(false);
				}}
			/>
		);
	}

	return (
		<Layout
			className="bg-neutral-0 ml-0 mr-0 pt-1 px-3 w-100"
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
					<Button
						disabled={baseButtonDisabled}
						displayType="primary"
						onClick={() => setIsSuccess(true)}
					>
						{i18n.translate('submit')}
					</Button>
				),
			}}
			headerProps={{
				helper: i18n.translate(
					'we-ll-need-a-few-details-to-finish-building-your-liferay-experience-cloud-environment'
				),
				title: i18n.translate('set-up-liferay-experience-cloud'),
			}}
		>
			<FieldArray
				name="activations.projectsAdminContact"
				render={({pop, push}) => (
					<>
						<div className="d-flex justify-content-between mb-2 pb-1 pl-3">
							<div className="mr-4 pr-2">
								<label>
									{i18n.translate('organization-name')}
								</label>

								<p className="text-neutral-6 text-paragraph-lg">
									<strong>SuperBank</strong>
								</p>
							</div>

							<div className="flex-fill">
								<label>
									{i18n.translate('liferay-lxc-version')}
								</label>

								<p className="text-neutral-6">
									<strong>7.3</strong>
								</p>
							</div>
						</div>
						<ClayForm.Group className="mb-0">
							<ClayForm.Group className="mb-0 pb-1">
								<Input
									groupStyle="pb-1"
									helper={i18n.translate(
										'lowercase-letters-and-numbers-only-projec-ids-cannot-be-changed'
									)}
									label={i18n.translate('project-id')}
									name="activations.projectId"
									placeholder="ProjectID"
									required
									type="text"
								/>

								<Select
									groupStyle="pb-1"
									label={i18n.translate('primary-region')}
									name="activations.primaryRegion"
									options={primaryRegionList}
									required
								/>
							</ClayForm.Group>

							<hr />

							<ClayForm.Group>
								{values?.activations?.projectsAdminContact?.map(
									(admin, index) => (
										<ProjectsAdminContact
											admin={admin}
											id={index}
											key={index}
										/>
									)
								)}
							</ClayForm.Group>
						</ClayForm.Group>

						{values?.activations?.projectsAdminContact.length >
							INITIAL_SETUP_ADMIN_COUNT && (
							<Button
								className="ml-3 my-2 text-brandy-secondary"
								displayType="secondary"
								onClick={() => pop()}
								prependIcon="hr"
								small
							>
								{i18n.translate('remove-project-admin')}
							</Button>
						)}

						<Button
							className="btn-outline-primary ml-3 my-2 rounded-xs"
							onClick={() => {
								push(getInititalLXCInvite());
							}}
							prependIcon="plus"
							small
						>
							{i18n.translate('add-project-admin')}
						</Button>

						<hr />

						<ClayForm.Group>
							<Input
								groupStyle="pb-1"
								label={i18n.translate(
									'incident-management-contact-first-and-last-name'
								)}
								name="incidentManagementName"
								placeholder="User Name"
								required
								type="text"
							/>

							<Input
								groupStyle="pb-1"
								helper={i18n.translate(
									'please-enter-an-individual-email-id-group-email-ids-are-not-allowed'
								)}
								label={i18n.translate(
									'incident-management-contact-email-address'
								)}
								name="incidentManagementEmail"
								placeholder="user@mycompany.com"
								required
								type="email"
							/>
						</ClayForm.Group>
					</>
				)}
			/>
		</Layout>
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
			}}
			validateOnChange
		>
			{(formikProps) => <SetupLXCPage {...props} {...formikProps} />}
		</Formik>
	);
};

export default SetupLXCForm;
