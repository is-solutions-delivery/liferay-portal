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
import PRMFormikPageProps from '../../../../common/components/PRMFormik/interfaces/prmFormikPageProps';
import DealRegistration from '../../../../common/interfaces/dealRegistration';
import Table from '../../../MDFRequestForm/steps/Review/components/Table';
import DealRegistrationStepProps from '../../interfaces/dealRegistrationStepProps';

const Review = ({
	onCancel,
	onSaveAsDraft,
}: PRMFormikPageProps & DealRegistrationStepProps<DealRegistration>) => {
	const {values, ...formikHelpers} = useFormikContext<DealRegistration>();

	return (
		<>
			<PRMForm
				className="bg-neutral-0"
				description="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus"
				name="review"
				title="Review Deal Registration"
			>
				<Table
					items={[
						{
							title: 'Partner Account Name',
							value: 'Deathray Parent-A*',
						},
						{
							title: 'MDF Activity Associated',
							value: 'US',
						},
					]}
					title="General Details"
				/>

				<Table
					items={[
						{
							title: 'Account Name',
							value: '{}',
						},
						{
							title: 'Industry',
							value: 'Insurance',
						},
						{
							title: 'Address',
							value: '...',
						},
						{
							title: 'City',
							value: 'Los Angeles',
						},
						{
							title: 'Postal Code',
							value: '91765',
						},
						{
							title: 'State',
							value: 'California',
						},
						{
							title: 'Country',
							value: 'US',
						},
					]}
					title="Prospect Information"
				/>

				<Table
					items={[
						{
							title: 'First Name',
							value: 'Jane',
						},
						{
							title: 'Last Name',
							value: 'Doe',
						},
						{
							title: 'Email Address',
							value: 'jane@example.com',
						},
						{
							title: 'Phone',
							value: '(714) 718-4565',
						},
						{
							title: 'Department',
							value: 'Business - Marketing',
						},
						{
							title: 'Job Role',
							value: 'Project Manager',
						},
					]}
					title="Primary Prospect Contact"
				/>

				<Table
					items={[
						{
							title: 'First Name',
							value: 'Jane',
						},
						{
							title: 'Last Name',
							value: 'Doe',
						},
						{
							title: 'Email Address',
							value: 'jane@example.com',
						},
					]}
					title="Additional Contacts"
				/>

				<Table
					items={[
						{
							title: 'Additional Information',
							value: '...',
						},
					]}
					title="Deal Information"
				/>

				<Table
					items={[
						{
							title: 'Project Need',
							value: '...',
						},
						{
							title: 'Project Solution Categories',
							value: '...',
						},
					]}
					title="Project Information"
				/>

				<Table
					items={[
						{
							title: 'Project Timeline',
							value: '...',
						},
						{
							title: 'Project Solution Categories',
							value: '...',
						},
					]}
					title="Business Objectives"
				/>
			</PRMForm>

			<PRMForm.Footer className="bg-neutral-0">
				<div className="d-flex mr-auto">
					<Button
						displayType={null}
						onClick={() => onSaveAsDraft?.(values, formikHelpers)}
					>
						Save as Draft
					</Button>
				</div>

				<div>
					<Button
						className="mr-4"
						displayType="secondary"
						onClick={onCancel}
					>
						Back
					</Button>

					<Button>Continue</Button>
				</div>
			</PRMForm.Footer>
		</>
	);
};

export default Review;
