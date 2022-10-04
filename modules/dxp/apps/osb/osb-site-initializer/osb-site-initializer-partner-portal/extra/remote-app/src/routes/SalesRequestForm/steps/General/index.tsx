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

import Button from '@clayui/button';
import {useFormikContext} from 'formik';

import PRMForm from '../../../../common/components/PRMForm';
import PRMFormik from '../../../../common/components/PRMFormik';
import {LiferayPicklistName} from '../../../../common/enums/liferayPicklistName';
import useDynamicFieldEntries from '../../../MDFRequestForm/steps/Goals/hooks/useDynamicFieldEntries';

const noop = () => {};

const General = ({
	onCancel = noop,
	onContinue = noop,
	onSaveAsDraft = noop,
}) => {
	const {isSubmitting} = useFormikContext<{}>();

	const {fieldEntries} = useDynamicFieldEntries();

	return (
		<PRMForm name="general" title="Deal Registration">
			<PRMForm.Section title="General Details">
				<PRMForm.Group>
					<PRMFormik.Field
						component={PRMForm.Select}
						label="Partner Account Name"
						name="partnerAccountName"
						options={[]}
					/>

					<PRMFormik.Field
						component={PRMForm.Select}
						label="MDF Activity Associated"
						name="mdfActivityAssociated"
					/>
				</PRMForm.Group>
			</PRMForm.Section>

			<PRMForm.Section title="Prospect Information">
				<PRMFormik.Field
					component={PRMForm.InputText}
					label="Account Name"
					name="prospect.accountName"
				/>

				<PRMFormik.Field
					component={PRMForm.InputText}
					label="Address"
					name="prospect.address"
				/>

				<PRMFormik.Field
					component={PRMForm.InputText}
					label="Industry"
					name="prospect.industry"
				/>

				<PRMForm.Group>
					<PRMFormik.Field
						component={PRMForm.Select}
						label="City"
						name="prospect.city"
					/>

					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Postal Code"
						name="prospect.postalCode"
					/>
				</PRMForm.Group>

				<PRMForm.Group>
					<PRMFormik.Field
						component={PRMForm.Select}
						label="State"
						name="prospect.state"
					/>

					<PRMFormik.Field
						component={PRMForm.Select}
						label="Country"
						name="prospect.country"
					/>
				</PRMForm.Group>

				<PRMForm.Section title="Primary Prospect Contact">
					<PRMForm.Group>
						<PRMFormik.Field
							component={PRMForm.InputText}
							label="First Name"
							name="primaryProspect.firstName"
						/>

						<PRMFormik.Field
							component={PRMForm.InputText}
							label="Last Name"
							name="primaryProspect.lastName"
						/>
					</PRMForm.Group>

					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Email Address"
						name="primaryProspect.emailAddress"
					/>

					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Phone"
						name="primaryProspect.phone"
					/>

					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Business Unit"
						name="primaryProspect.businessUnit"
					/>

					<PRMFormik.Field
						component={PRMForm.Select}
						label="Department"
						name="primaryProspect.department"
					/>

					<PRMFormik.Field
						component={PRMForm.Select}
						label="Job Role"
						name="primaryProspect.jobRole"
					/>
				</PRMForm.Section>

				<PRMForm.Section title="Additional Contacts">
					<PRMForm.Group>
						<PRMFormik.Field
							component={PRMForm.InputText}
							label="First Name"
							name="aditionalContact.firstName"
						/>

						<PRMFormik.Field
							component={PRMForm.InputText}
							label="Last Name"
							name="aditionalContact.lastName"
						/>
					</PRMForm.Group>

					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Email Address"
						name="aditionalContact.emailAddress"
					/>
				</PRMForm.Section>

				<PRMForm.Section title="Deal Information">
					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Additional Information about the Opportunity"
						name="dealInformation.additionalInformationAboutTheOpportunity"
					/>
				</PRMForm.Section>

				<PRMForm.Section title="Project Information">
					<PRMFormik.Field
						component={PRMForm.CheckboxGroup}
						items={
							fieldEntries[
								LiferayPicklistName.SALES_PROJECT_INFORMATION
							]
						}
						label="Project Need (Select all that apply)"
						name="projectInformation.projectNeed"
					/>
				</PRMForm.Section>

				<PRMForm.Section title="Project Solution Categories (Select all that apply)">
					<PRMFormik.Field
						component={PRMForm.CheckboxGroup}
						items={
							fieldEntries[
								LiferayPicklistName.SALES_PROJECT_CATEGORIES
							]
						}
						name="projectSolution.categories"
					/>
				</PRMForm.Section>

				<PRMForm.Section title="Business Objectives">
					<PRMFormik.Field
						component={PRMForm.InputText}
						label="Project Timeline"
						name="businessObjective.projectTimeline"
					/>
				</PRMForm.Section>
			</PRMForm.Section>

			<PRMForm.Footer>
				<div className="d-flex mr-auto">
					<Button
						disabled={isSubmitting}
						displayType={null}
						onClick={onSaveAsDraft}
					>
						Save as Draft
					</Button>
				</div>

				<Button onClick={onContinue}>Proceed</Button>
			</PRMForm.Footer>
		</PRMForm>
	);
};

export default General;
