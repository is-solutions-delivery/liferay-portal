import ClayModal from '@clayui/modal';
import ClayButton from '@clayui/button';
import PRMFormik from '../../../../../../common/components/PRMFormik';
import PRMForm from '../../../../../../common/components/PRMForm';
import {useModal} from '@clayui/modal';
import {useState} from 'react';
import MDFClaimBudget from '../../../../../../common/interfaces/mdfClaimBudget';
import MDFClaim from '../../../../../../common/interfaces/mdfClaim';

interface IProps {
	currentBudgetIndex: number | undefined;
	currentActivityIndex: number | undefined;
	activityId?: number;
	values: MDFClaim;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => void;
}

const BudgetModal = ({
	values,
	currentActivityIndex,
	activityId,
	observer,
	setFieldValue,
	onOpenChange,
	open,
	currentBudgetIndex,
	...budget
}: Omit<ReturnType<typeof useModal>, 'onClose'> & MDFClaimBudget & IProps) => {
	const [bugetCost, setBugetCost] = useState<any>({});

	const key = budget.id || '';

	return (
		<>
			{open && (
				<ClayModal center disableAutoClose observer={observer}>
					<div className="bg-brand-primary-lighten-6 p-6">
						<ClayModal.Header>
							{budget.expense && budget.expense.name}

							<h6 className="text-neutral-6">
								Enter the amount of claim and upload proof of
								performance
							</h6>
						</ClayModal.Header>
						<ClayModal.Body>
							<div>
								<PRMFormik.Field
									component={PRMForm.InputCurrency}
									label="Claim Amount"
									name={`mdfClaimActivities[${currentActivityIndex}].mdfClaimBudgets[${currentBudgetIndex}].cost`}
									placeholder={budget.cost}
									onAccept={(value: number) => {
										setBugetCost({
											...bugetCost,
											[key]: {
												...bugetCost[key],
												savedValue: bugetCost[key]
													?.savedValue
													? bugetCost[key]?.savedValue
													: budget.cost,
												inputedValue: value,
											},
										});
										setFieldValue(
											`mdfClaimActivities[${currentActivityIndex}].mdfClaimBudgets[${currentBudgetIndex}].cost`,
											value
										);
									}}
									required
									description="Silver Partner can claim up to 50%"
								/>

								<PRMFormik.Field
									component={PRMForm.InputFile}
									label="Third Party Invoices"
									name={`mdfClaimDocuments.budgets[${currentActivityIndex}.thirdPartyInvoices]`}
									idBudget={budget.id}
									idActivity={activityId}
									setFieldValue={setFieldValue}
									typeDocument="ListLeads"
									required
								/>
							</div>
						</ClayModal.Body>
						<ClayModal.Footer
							last={
								<div>
									<ClayButton
										className="mr-4"
										displayType="secondary"
										onClick={() => {
											onOpenChange(false);
											setFieldValue(
												`mdfClaimActivities[${currentActivityIndex}].mdfClaimBudgets[${currentBudgetIndex}].cost`,
												bugetCost[key]?.savedValue
											);
											setFieldValue(
												`mdfClaimActivities[${currentActivityIndex}].mdfClaimBudgets[${currentBudgetIndex}].cost`,
												bugetCost[key]?.savedValue
											);
										}}
									>
										Cancel
									</ClayButton>
									<ClayButton
										onClick={() => {
											onOpenChange(false);
											setFieldValue(
												`mdfClaimActivities[${currentActivityIndex}].mdfClaimBudgets[${currentBudgetIndex}].cost`,
												bugetCost[key]?.inputedValue
											);
											setBugetCost({
												...bugetCost,
												[key]: {
													...bugetCost[key],
													savedValue:
														bugetCost[key]
															?.inputedValue,
												},
											});
										}}
									>
										Confirm
									</ClayButton>
								</div>
							}
						/>
					</div>
				</ClayModal>
			)}
		</>
	);
};
export default BudgetModal;
