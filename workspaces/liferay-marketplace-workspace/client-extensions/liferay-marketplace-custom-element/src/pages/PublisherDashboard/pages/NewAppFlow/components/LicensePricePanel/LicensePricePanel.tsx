import React from 'react';
import Panel from '@clayui/panel';
import ClayIcon from '@clayui/icon';
import EurFlag from '../../../../../../assets/icons/eur_flag.svg';

import LicensePriceCard from '../LicensePriceCard';
import { ClayButtonWithIcon } from '@clayui/button';
import { LicenseTier } from '../../../../../../enums/licenseTier';
import { currenciesCode } from '../../../../../../utils/currencies';
import { Section } from '../../../../../../components/Section/Section';
import IconButton from '../IconButton';

type Props = {
	cloudCompatible: boolean;
	currencyCode: string;
	prices: {
		[licenseTier in LicenseTier]?: { [key: number]: number };
	};
	handleAddPriceTier: Function;
	handleEditPriceTier: Function;
	handleDeletePriceTier: Function;
};


const LicensePricePanel: React.FC<Props> = ({
	cloudCompatible,
	currencyCode,
	prices,
	handleAddPriceTier,
	handleEditPriceTier,
	handleDeletePriceTier,
}) => {

	const standardPrices = prices[LicenseTier.STANDARD] || {};
	const developerPrices = prices[LicenseTier.DEVELOPER] || {};

	const matchedCurrency = currenciesCode.find(
		(c) => c.code === currencyCode
	);

	const icon =
		matchedCurrency?.code === 'EUR' ? (
			<img src={EurFlag} alt="EUR Flag" className="currency-selector-icon" />
		) : (
			<ClayIcon className="currency-selector-icon" symbol={matchedCurrency?.flag || 'en-us'} />
		);

	const shouldShowDeveloperCard = () =>
		Object.keys(developerPrices).length > 0;

	const handleDeleteAllPricesForCurrency = (currency: string) => {
		const tiers = [LicenseTier.STANDARD, LicenseTier.DEVELOPER];

		tiers.forEach((tier) => {
			const pricesByTier = prices[tier] || {};
			const keys = Object.keys(pricesByTier);

			keys.forEach((key) => {
				handleDeletePriceTier(tier, Number(key), currency, true);
			});
		});
	};

	return (
		<Panel
			collapsable
			defaultExpanded
			displayTitle={
				<div className="d-flex align-items-center justify-content-between w-100">
					<div className="d-flex align-items-center">
						<span className="mr-2">{currencyCode}</span>
						{icon}
					</div>

					{currencyCode !== 'USD' && (
						<ClayButtonWithIcon
							aria-label={`Delete all prices for ${currencyCode}`}
							displayType="unstyled"
							symbol="trash"
							title="Delete all prices"
							onClick={() => handleDeleteAllPricesForCurrency(currencyCode)}
							className="ml-auto" 
						/>
					)}
				</div>


			}

			displayType="secondary"
			showCollapseIcon={true}
		>
			<Panel.Body>
				<Section
					className="mb-6"
					label="Standard License prices"
					required
					tooltip="Standard licenses cover the following DXP environments: production, non-production (UAT) and backup (DR) for both standalone and virtual cluster servers."
					tooltipText="More Info"
				>
					<LicensePriceCard
						currency={currencyCode}
						licensePrices={standardPrices}
						licenseTier={LicenseTier.STANDARD} 
						onAdd={(currency) => handleAddPriceTier(LicenseTier.STANDARD, currency)}
						onChange={(index, price, currency) =>
							handleEditPriceTier(LicenseTier.STANDARD, index, price, currency)
						}
						onDelete={(key, currency) => handleDeletePriceTier(LicenseTier.STANDARD, key, currency)}
					/>

				</Section>

				{!cloudCompatible && (
					<Section
						label="Developer License prices"
						tooltip="Developer licenses are limited to 5 unique addresses and should not be used for full scale production deployments."
						tooltipText="More Info"
					>
						{shouldShowDeveloperCard() ? (
							<LicensePriceCard
								currency={currencyCode}
								licensePrices={developerPrices}
								licenseTier={LicenseTier.DEVELOPER} 
								onAdd={(currency) => handleAddPriceTier(LicenseTier.DEVELOPER, currency)}
								onChange={(index, price, currency) =>
									handleEditPriceTier(LicenseTier.DEVELOPER, index, price, currency)
								}
								onDelete={(key, currency) => handleDeletePriceTier(LicenseTier.DEVELOPER, key, currency)}
							/>

						) : (
							<IconButton
								className="icon-button py-3 w-100"
								onClick={() => handleAddPriceTier(LicenseTier.DEVELOPER, currencyCode)}
							>
								Add Developer Licenses
							</IconButton>

						)}
					</Section>
				)}
			</Panel.Body>
		</Panel>
	);
};


export default LicensePricePanel;