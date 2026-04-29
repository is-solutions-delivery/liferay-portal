/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {format, isBefore} from 'date-fns';
import {useParams} from 'react-router-dom';
import useSWR from 'swr';

import EmptyState from '../../../../../components/EmptyState';
import StatusCell from '../../../../../components/Table/StatusCell';
import Table from '../../../../../components/Table/Table';
import i18n from '../../../../../i18n';
import provisioningOAuth2 from '../../../../../services/oauth/Provisioning';
import TitleSubtitleHeader from '../../../components/TitleSubtitleHeader';

import '../Licenses/Licenses.scss';

const isLicenseExpired = (expirationDate: string) =>
	!isBefore(new Date(), new Date(expirationDate));

const DSRDetails = () => {
	const {orderId} = useParams();

	const {data: licenseKeysResponse, isLoading} = useSWR(
		`/order-license-keys/${orderId}`,
		() => provisioningOAuth2.getOrderLicenseKeys(orderId as string)
	);

	if (isLoading) {
		return <ClayLoadingIndicator />;
	}

	if (licenseKeysResponse?.totalCount === 0) {
		return <EmptyState title="No Activation Keys" />;
	}

	return (
		<div className="licenses mb-9 mt-5">
			<Table
				Actions={({row}) => {
					const expired =
						!row.expirationDate ||
						isLicenseExpired(row.expirationDate);

					return (
						<div className="align-items-center d-flex license-actions">
							<ClayButton
								className="px-3 rounded"
								disabled={expired}
								displayType="secondary"
								onClick={() => {
									provisioningOAuth2.downloadLicenseKey(row.id);
								}}
								size="sm"
							>
								{i18n.translate('download')}
							</ClayButton>
						</div>
					);
				}}
				columns={[
					{
						bodyClass: 'border-0 cursor-pointer',
						expanded: true,
						key: 'environment',
						render: (environment, {description}) => (
							<TitleSubtitleHeader
								title={environment || description || '-'}
							/>
						),
						title: (
							<TitleSubtitleHeader
								title={i18n.translate('environment')}
							/>
						),
					},
					{
						bodyClass: 'border-0 cursor-pointer',
						key: 'hostName',
						render: (hostName) => (
							<TitleSubtitleHeader subtitle={hostName || '-'} />
						),
						title: (
							<TitleSubtitleHeader
								title={`${i18n.translate('key-type')} (${i18n.translate('host-name')})`}
							/>
						),
					},
					{
						bodyClass: 'border-0 cursor-pointer',
						key: 'startDate',
						render: (startDate, {expirationDate}) => (
							<div className="date-cell">
								<p className="m-0">
									{format(new Date(startDate), 'MMM dd, yyyy')} -
								</p>

								<p className="m-0">
									{expirationDate
										? format(
												new Date(expirationDate),
												'MMM dd, yyyy'
											)
										: 'DNE'}
								</p>
							</div>
						),
						title: (
							<TitleSubtitleHeader
								title={
									<span>
										Start Date -<br />
										Exp. Date
									</span>
								}
							/>
						),
					},
					{
						bodyClass: 'border-0 cursor-pointer',
						key: 'status',
						render: (_, {active, expirationDate}) => {
							const isActive =
								active &&
								isBefore(new Date(), new Date(expirationDate));

							const label = isActive ? 'active' : 'expired';

							return (
								<StatusCell icon="circle" iconClassName={label}>
									{i18n.translate(label)}
								</StatusCell>
							);
						},
						title: (
							<TitleSubtitleHeader title={i18n.translate('status')} />
						),
					},
				]}
				hasHover
				hasKebabButton
				hasPagination
				kebabClassName="border-0"
				rows={licenseKeysResponse?.items ?? []}
			/>
		</div>
	);
};

export default DSRDetails;
