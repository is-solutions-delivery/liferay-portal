/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLoadingIndicator from '@clayui/loading-indicator';

import './InsuficientResources.scss';

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {Outlet, useParams} from 'react-router-dom';

import catalogIcon from '../../../assets/icons/catalog_icon.svg';
import hourglass from '../../../assets/icons/hourglass_icon.svg';
import {AccountAndAppCard} from '../../../components/Card/AccountAndAppCard';
import {useDeliveryProduct} from '../../../hooks/data/useProduct';
import {baseURL} from '../../../utils/api';
import {
	getAccountImage,
	getThumbnailByProductAttachment,
	showAppImage,
} from '../../../utils/util';
import useGetResourceInfo from '../hooks/useGetResourceInfo';

export function InsuficientResources() {
	const {productId, projectId} = useParams();

	const {data: product} = useDeliveryProduct(productId ?? '');

	const {hasProject} = useGetResourceInfo({
		product,
		selectedProject: projectId,
	});

	const {name: appName = ''} = product ?? {};
	const appIcon = getThumbnailByProductAttachment(product?.images);

	const appLogo = showAppImage(appIcon as string).replace(
		(appIcon as string)?.split('/o')[0],
		baseURL
	);

	if (!hasProject) {
		return <ClayLoadingIndicator />;
	}

	return (
		<div
			className={classNames(
				'contact-sales-page-container contact-sales-page-container-larger'
			)}
		>
			<div className="contact-sales-page-content">
				{hasProject && (
					<div className="contact-sales-page-cards">
						<AccountAndAppCard
							category="Application"
							logo={appLogo || catalogIcon}
							title={appName}
						/>

						<div className="icon-container">
							<ClayIcon
								className="contact-sales-page-icon m-0"
								symbol="arrow-right-full"
							/>
						</div>

						<AccountAndAppCard
							category="Project"
							className="contact-sales-page-no-resource"
							logo={getAccountImage(hourglass as string)}
							title={
								<div>
									<p className="m-0">
										<b>
											{hasProject.rootProjectId.toUpperCase()}
										</b>
									</p>
									<p className="contact-sales-page-no-resource-card-card m-0">
										{`${hasProject.rootProjectPlanUsage.remaining?.cpu}CPUs, 
										${hasProject.rootProjectPlanUsage.remaining?.memory}GB RAM `}
									</p>
								</div>
							}
						/>
					</div>
				)}

				<div className="contact-sales-page-text">
					<div className="contact-sales-page-text">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}
