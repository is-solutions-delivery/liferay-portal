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
import {DropDown} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';
import i18n from '../../../../../../../../../../../common/I18n';
import getKebabCase from '../../../../../../../../../../../common/utils/getKebabCase';
import {SUBSCRIPTIONS_STATUS} from '../../../../../../../../../utils/constants';

const SubscriptionsFilterByStatus = ({
	handleAllStatusSelected,
	handleChangeStatus,
	handleOtherStatusSelected,
	handleSelectedStatusIcon,
}) => {
	const [active, setActive] = useState(false);

	return (
		<div className="d-flex mr-5 mt-4">
			<h6 className="mr-2 my-auto">{i18n.translate('status')}:</h6>

			<DropDown
				active={active}
				closeOnClickOutside
				menuElementAttrs={{
					className: 'cp-subscription-status-filter',
				}}
				onActiveChange={setActive}
				trigger={
					<ClayButton
						className="font-weight-semi-bold shadow-none text-brand-primary"
						displayType="unstyled"
					>
						{handleOtherStatusSelected}

						<ClayIcon symbol="caret-bottom" />
					</ClayButton>
				}
			>
				<DropDown.Item
					onClick={() => handleChangeStatus(i18n.translate('all'))}
					symbolRight={handleAllStatusSelected}
				>
					{i18n.translate('all')}
				</DropDown.Item>

				<DropDown.Item
					onClick={() =>
						handleChangeStatus(SUBSCRIPTIONS_STATUS.active)
					}
					symbolRight={handleSelectedStatusIcon(
						SUBSCRIPTIONS_STATUS.active
					)}
				>
					{i18n.translate(getKebabCase(SUBSCRIPTIONS_STATUS.active))}
				</DropDown.Item>

				<DropDown.Item
					onClick={() =>
						handleChangeStatus(SUBSCRIPTIONS_STATUS.expired)
					}
					symbolRight={handleSelectedStatusIcon(
						SUBSCRIPTIONS_STATUS.expired
					)}
				>
					{i18n.translate(getKebabCase(SUBSCRIPTIONS_STATUS.expired))}
				</DropDown.Item>

				<DropDown.Item
					onClick={() =>
						handleChangeStatus(SUBSCRIPTIONS_STATUS.future)
					}
					symbolRight={handleSelectedStatusIcon(
						SUBSCRIPTIONS_STATUS.future
					)}
				>
					{i18n.translate(getKebabCase(SUBSCRIPTIONS_STATUS.future))}
				</DropDown.Item>
			</DropDown>
		</div>
	);
};

export default SubscriptionsFilterByStatus;
