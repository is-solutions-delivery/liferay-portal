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

import ClayCard from '@clayui/card';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';

import MDFClaimBudget from '../../../../../../../../common/interfaces/mdfClaimBudget';
import getIntlNumberFormat from '../../../../../../../../common/utils/getIntlNumberFormat';

interface IProps {
	budget: MDFClaimBudget;
	budgetErrors: boolean;
	onClick: () => void;
}

const BudgetCard = ({
	budget,
	budgetErrors,
	onClick,
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {
	const hasInvoices = !!budget.invoice;

	return (
		<ClayCard
			className={classNames(
				'border card-horizontal card-interactive shadow-none',
				{
					'border-danger': !budgetErrors,
					'border-neutral-10': budgetErrors,
				}
			)}
			onClick={onClick}
		>
			<ClayCard.Body className="m-1 p-2">
				<ClayCard.Row className="justify-content-between">
					<div className="align-items-center d-flex flex-row">
						<div className="font-weight-bold mr-3 text-neutral-10 text-paragraph">
							{budget.expenseName}
						</div>

						<div
							className={classNames('text-paragraph-xs', {
								'text-brand-primary-lighten-2':
									hasInvoices && budgetErrors,
								'text-danger': hasInvoices && !budgetErrors,
								'text-neutral-7': !hasInvoices,
							})}
						>
							<ClayIcon
								className="mr-1"
								symbol={
									hasInvoices
										? budgetErrors
											? 'check-circle-full'
											: 'exclamation-full'
										: 'staging'
								}
							/>

							{hasInvoices
								? budgetErrors
									? 'Invoice Added'
									: 'There is a issue'
								: 'Pending Invoice'}
						</div>
					</div>

					<div className="font-weight-bold text-neutral-10 text-paragraph">
						{getIntlNumberFormat().format(budget.invoiceAmount)}
					</div>
				</ClayCard.Row>
			</ClayCard.Body>
		</ClayCard>
	);
};

export default BudgetCard;
