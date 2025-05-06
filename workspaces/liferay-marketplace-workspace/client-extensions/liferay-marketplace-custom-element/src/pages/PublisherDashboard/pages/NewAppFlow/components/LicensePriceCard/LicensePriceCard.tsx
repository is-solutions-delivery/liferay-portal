import { ClayButtonWithIcon } from '@clayui/button';
import ClayForm, { ClayInput } from '@clayui/form';
import './LicensePriceCard.scss';
import classNames from 'classnames';
import IconButton from '../IconButton';
import { FieldBase } from '../../../../../../components/FieldBase';
import { currenciesCode } from '../../../../../../utils/currencies';
import { LicenseTier } from '../../../../../../enums/licenseTier';

type LicensePriceCardProps = {
	currency: string;
	licensePrices: { [key: number]: number };
	licenseTier: LicenseTier;
	onAdd: (currency: string) => void;
	onChange: (
		index: number, 
		price: { key: number; value: number },
		currency: string
	) => void;
	onDelete: (key: number, currency: string) => void;
};

const LicensePriceCard: React.FC<LicensePriceCardProps> = ({
	licenseTier,
	licensePrices,
	onAdd,
	onChange,
	onDelete,
	currency, 
}) => {

	const getSymbol = (currency: string) => {
		return currenciesCode.find(c => c.code === currency)?.symbol || '$';
	};

	return (
		<ClayForm.Group className="d-flex flex-column license-card-container">
			<div className="row">
				<FieldBase
					className="col-3"
					label="Quantity"
					labelClassName="teste"
					tooltip="By adding quantities to price tiers, you can offer quantity discounts. For example, adding a quantity of 3 would allow you to offer a discount unit price for 3 or more licenses."
				/>

				<FieldBase
					className="col-6 p-0"
					label="Unit Price"
					labelClassName="teste"
					tooltip="Adding a unit price sets the amount you want to charge for each individual license when the set quantity is chosen."
				/>

				
			</div>

			{Object.entries(licensePrices).map(([key, value]) => { 
			
				return (
				<div className="align-items-center mb-4 row" key={key}>
					<ClayInput.Group className="col-11 p-0">
						<ClayInput.GroupItem className="col-3">
						<ClayInput
							className={classNames('license-card-input py-5', {
								'bg-white': key,
								'disabled': !key,
							})}
							disabled={!key}
							min={1}
							onChange={(event) => {
								const rawValue = event.target.value;
								const newQuantity = Number(rawValue);

								if (!rawValue || isNaN(newQuantity) || newQuantity < 1) {
									return;
								}

								if (key && newQuantity !== Number(key)) {
									onChange(Number(key), {
										key: Number(key),
										value: Number(event.target.value),
									}, currency);
								}
							}}
							placeholder="1"
							type="number"
							value={Number(key)}
						/>

						</ClayInput.GroupItem>

						<ClayInput.GroupItem className="col-9 m-0">
							<ClayInput
								className="bg-white license-card-input py-5 text-right"
								onChange={(event) => {
									const regExp = /^[0-9.,]*$/;

									if (regExp.test(event.target.value)) {
										onChange(Number(key), {
											key: Number(key),
											value: Number(event.target.value),
										}, currency);
									}
								}}
								placeholder={`${getSymbol(currency)}0.00`}
								type="text"
								value={value || ''}
							/>
						</ClayInput.GroupItem>
					</ClayInput.Group>
					{!(key === '1' && licenseTier === LicenseTier.STANDARD) && (
						<ClayButtonWithIcon
							aria-label="Delete"
							displayType={null}
							onClick={() => onDelete(Number(key), currency)}
							symbol="trash"
							title="Delete"
						/>
					)}
				</div>
			)})}
			<IconButton
				className="icon-button py-3 w-100"
				displayType={null}
				onClick={() => onAdd(currency)}
			>
				Add Price Tier
			</IconButton>
		</ClayForm.Group>
	);
};

export default LicensePriceCard;
