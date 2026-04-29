/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {useOutletContext} from 'react-router-dom';
import useSWR from 'swr';

import {DetailedCard} from '../../../../../components/DetailedCard/DetailedCard';
import {OrderCustomFields} from '../../../../../enums/Order';
import useGetProductByOrderId from '../../../../../hooks/useGetProductByOrderId';
import i18n from '../../../../../i18n';
import {getDataSourceToken} from '../../../../../services/rest/Faro';
import {copyToClipboard} from '../../../../../utils/browser';
import {safeJSONParse} from '../../../../../utils/util';

import './DSRTokens.scss';

type OutletContext = NonNullable<
	ReturnType<typeof useGetProductByOrderId>['data']
>;

const DSRTokens = () => {
	const {placedOrder} = useOutletContext<OutletContext>();

	const orderMetadata = safeJSONParse(
		placedOrder.customFields[OrderCustomFields.ORDER_METADATA],
		{analyticsProject: {groupId: ''}}
	);

	const groupId = orderMetadata?.analyticsProject?.groupId
		? String(orderMetadata.analyticsProject.groupId)
		: '';

	const {data: token, isLoading} = useSWR(
		groupId ? `/faro/data-source-token/${groupId}` : null,
		() => getDataSourceToken(groupId)
	);

	return (
		<div className="dsr-tokens mb-9 mt-5">
			<DetailedCard
				cardIconAltText="Diagram Icon"
				cardTitle={i18n.translate('connect-your-liferay-dsr')}
				clayIcon="diagram"
			>
				<label
					className="font-weight-bold mt-3"
					htmlFor="dsr-token-input"
				>
					{i18n.translate(
						'copy-this-token-to-your-liferay-dxp-instance'
					)}

					<span className="reference-mark text-danger ml-1">*</span>
				</label>

				{isLoading ? (
					<ClayLoadingIndicator />
				) : (
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								className="dsr-token-input text-truncate"
								id="dsr-token-input"
								readOnly
								type="text"
								value={token ?? ''}
							/>
						</ClayInput.GroupItem>

						<ClayInput.GroupItem append shrink>
							<ClayButton
								aria-label={i18n.translate('copy')}
								disabled={!token}
								displayType="secondary"
								onClick={() => copyToClipboard(token ?? '')}
							>
								<ClayIcon symbol="paste" />
							</ClayButton>
						</ClayInput.GroupItem>
					</ClayInput.Group>
				)}
			</DetailedCard>
		</div>
	);
};

export default DSRTokens;
