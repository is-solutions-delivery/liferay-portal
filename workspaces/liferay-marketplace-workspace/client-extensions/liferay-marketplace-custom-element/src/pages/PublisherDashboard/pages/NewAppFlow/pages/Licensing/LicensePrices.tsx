/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Section} from '../../../../../../components/Section/Section';
import {
	NewAppTypes,
	useNewAppContext,
} from '../../../../../../context/NewAppContext';
import {
	ProductType,
	ProductWorkflowStatusCode,
} from '../../../../../../enums/Product';
import {LicenseTier} from '../../../../../../enums/licenseTier';
import {LicensePrice} from '../../../Apps/AppCreationFlow/AppContext/AppManageState';
import IconButton from '../../../Apps/AppCreationFlow/InformLicensingTermsPage/components/IconButton';
import LicensePriceCard from '../../../Apps/AppCreationFlow/InformLicensingTermsPage/components/LicensePriceCard';

const LicensePrices = () => {
	const [
		{
			_product,
			build: {appType},
			licensing: {
				prices: {developer: developerPrices, standard: standardPrices},
			},
		},
		dispatch,
	] = useNewAppContext();

	const isDraft = (status: number) =>
		status === ProductWorkflowStatusCode.DRAFT;

	const isSaveAsDraft = !_product || isDraft(_product.productStatus);

	const isDisabled = !isSaveAsDraft && !!_product.id;

	const handleAddPriceTier = (licenseTier: LicenseTier) =>
		dispatch({
			payload: {licenseTier},
			type: NewAppTypes.SET_LICENSING_ADD_PRICE,
		});

	const handleDeletePriceTier = (licenseTier: LicenseTier, key: number) =>
		dispatch({
			payload: {
				key,
				licenseTier,
			},
			type: NewAppTypes.SET_LICENSING_DELETE_PRICE,
		});

	const handleEditPriceTier = (
		licenseTier: LicenseTier,
		index: number,
		price: LicensePrice
	) =>
		dispatch({
			payload: {
				index,
				licenseTier,
				price,
			},
			type: NewAppTypes.SET_LICENSING_UPDATE_PRICES,
		});

	return (
		<div className="informing-licensing-terms-page-container">
			<Section
				className="mb-6"
				label="Standard License prices"
				required
				tooltip="Standard licenses cover the following DXP environments: production, non-production (UAT) and backup (DR) for both standalone and virtual cluster servers."
				tooltipText="More Info"
			>
				<LicensePriceCard
					disabled={isDisabled}
					licensePrices={standardPrices}
					onAdd={() => handleAddPriceTier(LicenseTier.STANDARD)}
					onChange={(index: number, price: LicensePrice) => {
						handleEditPriceTier(LicenseTier.STANDARD, index, price);
					}}
					onDelete={(key: number) =>
						handleDeletePriceTier(LicenseTier.STANDARD, key)
					}
				/>
			</Section>

			{appType !== ProductType.CLOUD && (
				<Section
					label="Developer License prices"
					tooltip="Developer licenses are limited to 5 unique addresses and should not be used for full scale production deployments."
					tooltipText="More Info"
				>
					{developerPrices.length ? (
						<LicensePriceCard
							disabled={isDisabled}
							licensePrices={developerPrices}
							onAdd={() =>
								handleAddPriceTier(LicenseTier.DEVELOPER)
							}
							onChange={(index: number, price: LicensePrice) =>
								handleEditPriceTier(
									LicenseTier.DEVELOPER,
									index,
									price
								)
							}
							onDelete={(key: number) =>
								handleDeletePriceTier(
									LicenseTier.DEVELOPER,
									key
								)
							}
						/>
					) : (
						<IconButton
							className="icon-button py-3 w-100"
							disabled={isDisabled}
							onClick={() =>
								handleAddPriceTier(LicenseTier.DEVELOPER)
							}
						>
							Add Developer Licenses
						</IconButton>
					)}
				</Section>
			)}
		</div>
	);
};

export default LicensePrices;
