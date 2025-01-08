/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal, {useModal} from '@clayui/modal';
import React from 'react';

import {Product} from '../../types';
import {getProductSpecification} from '../../util';
import PublisherSupportInfoCard from './PublisherSupportInfoCard';

type PublisherSupportModalProps = {
	onClose: () => void;
	product: Product;
};

const PublisherSupportModal = ({
	onClose,
	product,
}: PublisherSupportModalProps) => {
	const publisherWebsiteUrl = getProductSpecification(
		product,
		'publisherwebsiteurl'
	);

	const supportemailaddress = getProductSpecification(
		product,
		'supportemailaddress'
	);

	const supportphone = getProductSpecification(product, 'supportphone');

	const {observer} = useModal({onClose});

	return (
		<ClayModal center observer={observer} size={'md' as any}>
			<ClayModal.Header>
				{Liferay.Language.get('publisher-support-contact-info')}
			</ClayModal.Header>

			<ClayModal.Body className="p-3">
				<PublisherSupportInfoCard
					symbol="picture"
					urlImage={product.urlImage}
					value={product.catalogName}
				/>

				<PublisherSupportInfoCard
					symbol="globe"
					title={Liferay.Language.get('publisher-support-url')}
					value={
						publisherWebsiteUrl?.value ? (
							<a
								className="modal-link"
								href={publisherWebsiteUrl?.value}
								target="_blank"
							>
								{publisherWebsiteUrl?.value}
							</a>
						) : null
					}
				/>

				<PublisherSupportInfoCard
					symbol="envelope-closed"
					title={Liferay.Language.get('support-email')}
					value={
						supportemailaddress?.value ? (
							<a
								className="modal-link"
								href={`mailto:${supportemailaddress?.value}`}
								target="_blank"
							>
								{supportemailaddress?.value}
							</a>
						) : null
					}
				/>

				<PublisherSupportInfoCard
					symbol="phone"
					title={Liferay.Language.get('phone')}
					value={
						supportphone?.value ? (
							<a
								className="modal-link"
								href={`tel:${supportphone.value}`}
								target="_blank"
							>
								{supportphone.value}
							</a>
						) : null
					}
				/>
			</ClayModal.Body>
		</ClayModal>
	);
};

export default PublisherSupportModal;
