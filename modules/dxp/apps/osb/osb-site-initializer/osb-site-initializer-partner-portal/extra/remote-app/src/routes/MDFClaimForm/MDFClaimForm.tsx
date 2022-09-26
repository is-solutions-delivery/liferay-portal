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

import ClayButton from '@clayui/button';
import {useFormikContext} from 'formik';
import {useMemo} from 'react';

import PRMForm from '../../common/components/PRMForm';
import PRMFormik from '../../common/components/PRMFormik';
import PRMFormikPageProps from '../../common/components/PRMFormik/interfaces/prmFormikPageProps';
import MDFClaim from '../../common/interfaces/mdfClaim';
import isObjectEmpty from '../MDFRequestForm/utils/isObjectEmpty';
import mdfClaimProps from './interfaces/mdfClaimProps';

const MDFClaimForm = ({
	onSaveAsDraft,
}: PRMFormikPageProps & mdfClaimProps<MDFClaim>) => {
	const {
		errors,
		isSubmitting,
		isValid,
		setFieldValue,
		values,
		...formikHelpers
	} = useFormikContext<MDFClaim>();

	const claimErrors = useMemo(() => {
		return errors;
	}, [errors]);

	return (
		<PRMForm className="mb-4" name="NEW" title="Reimbursement Claim">
			<PRMForm.Section
				subtitle="Check each expense you would like claim and please provide proof of performance for each of the selected expenses."
				title="title"
			></PRMForm.Section>

			<PRMForm.Section
				subtitle="Total Claim is the reimbursement of your expenses, and is up to the Total MDF Requested. In case need to claim more than the MDF Requested you need to apply for a  New MDF Request."
				title="Total Claim"
			>
				<PRMFormik.Field
					component={PRMForm.InputCurrency}
					label="Total Claim Amount"
					name="totalClaimAmount"
					onAccept={(value: number) =>
						setFieldValue('totalClaimAmount', value)
					}
					required
				/>
			</PRMForm.Section>

			<PRMForm.Footer>
				<div className="d-flex mr-auto">
					<ClayButton
						className="pl-0"
						disabled={isSubmitting}
						displayType={null}
						onClick={() => onSaveAsDraft?.(values, formikHelpers)}
					>
						Save as Draft
					</ClayButton>
				</div>

				<div>
					<ClayButton className="mr-4" displayType="secondary">
						Cancel
					</ClayButton>

					<ClayButton
						disabled={
							(!isValid && !isObjectEmpty(claimErrors)) ||
							isSubmitting
						}
						type="submit"
					>
						Submit
					</ClayButton>
				</div>
			</PRMForm.Footer>
		</PRMForm>
	);
};

export default MDFClaimForm;
