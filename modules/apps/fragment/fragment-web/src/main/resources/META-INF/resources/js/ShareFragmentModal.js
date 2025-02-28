/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayModal, {useModal} from '@clayui/modal';
import {MarketplaceRest} from '@liferay/marketplace-js-components-web';
import {fetch} from 'frontend-js-web';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

const PRODUCT_SPECIFICATION_KEY = {
	APP_DEVELOPER_NAME: 'developer-name',
	APP_PRICING_MODEL: 'price-model',
	APP_TYPE: 'type',
};

const accountGroups = {
	'Liferay DevCon': 'LIFERAY-DEVCON-PRIVATE-GROUP',
	'Liferay, Inc.': 'LIFERAY-INC-PRIVATE-GROUP',
};

const base64ToText = (base64) => base64.split(',').at(-1);

function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
	});
}

export default function ShareFragmentModal(fragmentEntryProps) {
	const [state, setState] = useState({
		description: '',
		name: fragmentEntryProps.name,
		version: '',
	});

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(true);
	const {observer, onClose} = useModal({
		onClose: () => setVisible(false),
	});

	async function onSubmit() {
		setLoading(true);

		const marketplaceRest =
			await MarketplaceRest.getMarketplaceRestWithConfiguration();

		const productPayload = {
			catalogId: marketplaceRest.settings.catalogId,
			categories: [
				{id: '11730536', name: 'App'},
				{
					id: '36841715',
					name: 'Fragments',
				},
			],
			description: state.description,
			name: state.name,
			productSpecifications: [
				{
					specificationKey:
						PRODUCT_SPECIFICATION_KEY.APP_DEVELOPER_NAME,
					value: {
						en_US: fragmentEntryProps.author,
					},
				},
				{
					specificationKey: PRODUCT_SPECIFICATION_KEY.APP_TYPE,
					value: {
						en_US: 'fragment',
					},
				},
				{
					specificationKey:
						PRODUCT_SPECIFICATION_KEY.APP_PRICING_MODEL,
					value: {
						en_US: 'Free',
					},
				},
			],
		};

		productPayload.productAccountGroupFilter = true;
		productPayload.productAccountGroups = [
			{
				externalReferenceCode:
					accountGroups[marketplaceRest.settings.account.name],
				id: 0,
			},
		];

		if (fragmentEntryProps.thumbnail) {
			const response = await fetch(fragmentEntryProps.thumbnail);

			const blob = await response.blob();

			productPayload.images = [
				{
					attachment: base64ToText(await blobToBase64(blob)),
					galleryEnabled: true,
					neverExpire: true,
					priority: 0,
					title: {
						en_US: `${fragmentEntryProps.name} logo`,
					},
				},
			];
		}

		const product = await marketplaceRest.createProduct(productPayload);

		if (fragmentEntryProps.export) {
			const response = await fetch(fragmentEntryProps.export);

			const attachment = await response.blob();

			const formData = new FormData();

			formData.append(
				'file',
				new Blob([attachment]),
				`${fragmentEntryProps.name.toLowerCase().replaceAll(' ', '-')}.zip`
			);

			formData.append(
				'productVirtualSettingsFileEntry',
				JSON.stringify({version: state.version})
			);

			await marketplaceRest.fetchMarketplace(
				`/o/headless-commerce-admin-catalog/v1.0/product-virtual-settings/${product.productVirtualSettings.id}/product-virtual-settings-file-entries`,
				{
					body: formData,
					method: 'POST',
				}
			);
		}

		Liferay.Util.openToast({
			message: Liferay.Language.get(
				'your-request-processed-successfully'
			),
			toastProps: {
				autoClose: 5000,
			},
			type: 'success',
		});

		setLoading(false);
		onClose();
	}

	function onChange(event) {
		setState({...state, [event.target.name]: event.target.value});
	}

	if (!visible) {
		return null;
	}

	return (
		<ClayModal observer={observer} size="md">
			<ClayModal.Header>Share</ClayModal.Header>

			<ClayModal.Body>
				<p className="text-gray">
					Make your fragment available to other Liferay DXP instances.
				</p>

				<ClayForm.Group className="form-group-sm">
					<label htmlFor="basicInput">Fragment Name</label>

					<ClayInput
						name="name"
						onChange={onChange}
						placeholder="Name"
						type="text"
						value={state.name}
					/>
				</ClayForm.Group>

				<ClayForm.Group className="form-group-sm">
					<label htmlFor="basicInput">Description</label>

					<textarea
						className="form-control"
						name="description"
						onChange={onChange}
						placeholder="Description"
						value={state.description}
					/>
				</ClayForm.Group>

				<ClayForm.Group className="form-group-sm">
					<label htmlFor="basicInput">Version</label>

					<ClayInput
						name="version"
						onChange={onChange}
						placeholder="1.0.0"
						type="text"
						value={state.version}
					/>
				</ClayForm.Group>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							disabled={loading}
							displayType="primary"
							onClick={onSubmit}
							type="button"
						>
							{loading
								? Liferay.Language.get('loading')
								: Liferay.Language.get('share')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
}

ShareFragmentModal.propTypes = {
	addFragmentEntryURL: PropTypes.string.isRequired,
	fieldTypes: PropTypes.array.isRequired,
	fragmentTypes: PropTypes.array.isRequired,
	namespace: PropTypes.string.isRequired,
};
