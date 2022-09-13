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
import {useMemo} from 'react';

import PRMForm from '../../common/components/PRMForm';
import PRMFormik from '../../common/components/PRMFormik';
import PRMFormikPageProps from '../../common/components/PRMFormik/interfaces/prmFormikPageProps';
import MDFClaim from '../../common/interfaces/mdfClaim';
import isObjectEmpty from '../MDFRequestForm/utils/isObjectEmpty';
import ClaimTotalResumeCard from './components/ClaimTotalResumeCard';
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
			<PRMForm.Section title="Insurance Industry Lead Gen"></PRMForm.Section>

			<PRMForm.Section
				subtitle="Total Claim is the reimbursement of your expenses, and is up to the Total MDF Requested. In case need to claim more than the MDF Requested you need to apply for a  New MDF Request."
				title="Total Claim"
			>
				<div className="my-3">
					<ClaimTotalResumeCard
						leftContent="Total MDF Requested Amount"
						rightContent="$6,000.00"
					/>
				</div>

				<PRMFormik.Field
					component={PRMForm.InputCurrency}
					label="Total MDF Requested Amount"
					name="totalClaimAmount"
					onAccept={(value: number) =>
						setFieldValue('totalClaimAmount', value)
					}
					required
				/>
			</PRMForm.Section>

			<PRMForm.Footer>
				<div className="d-flex mr-auto">
					<Button
						className="pl-0"
						disabled={isSubmitting}
						displayType={null}
						onClick={() => onSaveAsDraft?.(values, formikHelpers)}
					>
						Save as Draft
					</Button>
				</div>

				<div>
					<Button className="mr-4" displayType="secondary">
						Cancel
					</Button>

					<Button
						disabled={
							(!isValid && !isObjectEmpty(claimErrors)) ||
							isSubmitting
						}
						type="submit"
					>
						Submit
					</Button>
				</div>
			</PRMForm.Footer>
		</PRMForm>
	);
};

export default MDFClaimForm;
