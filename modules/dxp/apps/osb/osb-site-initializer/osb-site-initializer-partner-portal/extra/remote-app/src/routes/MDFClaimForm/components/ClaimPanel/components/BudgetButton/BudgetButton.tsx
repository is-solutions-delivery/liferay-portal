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

import classNames from 'classnames';

import MDFRequestBudget from '../../../../../../common/interfaces/mdfRequestBudget';
import getIntlNumberFormat from '../../../../../../common/utils/getIntlNumberFormat';

interface IProps {
	budget: MDFRequestBudget;
	cost: number;
}

const BudgetButton = ({
	onClick,
	budget,
	cost,
}: IProps & React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={classNames(
				'bg-neutral-0 rounded shadow-lg d-flex justify-content-between p-3 align-items-center mb-2'
			)}
			onClick={onClick}
		>
			<div className="font-weight-bold text-neutral-10 text-paragraph">
				{budget?.expense?.name}
			</div>

			<div className="font-weight-bold text-neutral-10 text-paragraph">
				{getIntlNumberFormat().format(cost)}
			</div>
		</div>
	);
};

export default BudgetButton;
