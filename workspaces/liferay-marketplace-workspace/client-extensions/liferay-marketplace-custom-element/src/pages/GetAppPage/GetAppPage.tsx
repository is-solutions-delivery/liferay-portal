/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

import {getSiteURL} from '../../components/InviteMemberModal/services';
import {Liferay} from '../../liferay/liferay';
import {getOrderTypes, postOrder} from '../../utils/api';
import {getUrlParam} from '../../utils/getUrlParam';
import AccountSelection from './components/AccountSelection';
import {LicenseSelector} from './components/LicenseSelector';
import ProductCard from './components/ProductCard';
import {StepType} from './enums/stepType';

import './GetAppPage.scss';

type StepComponent = {
	[key in StepType]?: JSX.Element;
};

type ProjectOrderType = {
	externalReferenceCode: string;
	id: number;
};

const productCustomFields = [
	'Github Username',
	'Project Name',
	'Site Initializer',
];

type getAppProps = {
	licenseSelected?: boolean;
	product?: Product;
	selectedAccount?: Account;
	sku?: SKU;
};

const sectionProperties = {
	[StepType.ACCOUNT]: {
		backStep: StepType.ACCOUNT,
		nextStep: StepType.LICENSES,
		title: 'Account Selection',
	},
	[StepType.LICENSES]: {
		backStep: StepType.ACCOUNT,
		nextStep: StepType.PAYMENT,
		title: 'License Selection',
	},
	[StepType.PAYMENT]: {
		backStep: StepType.LICENSES,
		nextStep: StepType.PAYMENT,
		title: 'Payment us',
	},
};

const GetAppFlow = () => {
	const [step, setStep] = useState<StepType>(StepType.ACCOUNT);
	const [showAccount, setShowAccount] = useState<Boolean>(false);
	const [orderType, setOrderType] = useState<OrderType[]>([]);

	const {getValues, setValue} = useForm<getAppProps>({
		defaultValues: {
			licenseSelected: false,
			product: undefined,
			selectedAccount: undefined,
			sku: undefined,
		},
	});

	const onCancel = () => {
		Liferay.Util.navigate(getSiteURL());
	};

	const onContinue = async (nextStep: StepType) => {
		setStep(nextStep);

		return;
	};

	const onPrevious = async (previousStep: StepType) => {
		setStep(previousStep);

		return;
	};

	const StepFormComponent: StepComponent = {
		[StepType.ACCOUNT]: (
			<AccountSelection
				onSelectAccount={(account: Account) => {
					setValue('selectedAccount', account);
					setShowAccount(true);
				}}
			/>
		),
		[StepType.LICENSES]: (
			<LicenseSelector
				onSelectLicense={(licenseSelected: boolean, sku?: SKU) => {
					setValue('licenseSelected', licenseSelected);
					setValue('sku', sku);
				}}
				selectedProduct={getValues('product')}
			/>
		),
	};

	useEffect(() => {
		(async () => {
			const responseOrderTypes = await getOrderTypes();
			setOrderType(responseOrderTypes);
		})();
	}, []);

	const customFields =
		getValues('product')?.customFields?.filter((item) =>
			productCustomFields.find((field) => item.name === field)
		) || [];

	const getProductCustomFields = () => {
		let data = {};

		productCustomFields.forEach((fieldName) => {
			customFields.forEach((field) => {
				if (field.name === fieldName) {
					data = {...data, [fieldName]: field.customValue.data};
				}
			});
		});

		return data;
	};

	const onsubmit = async (
		account?: Account,
		productChannels?: Channel,
		productSku?: SKU,
		projectOrderType?: ProjectOrderType
	) => {
		const payload: Order = {
			account: {
				id: Number(account?.id),
				type: account?.type as string,
			},
			accountExternalReferenceCode: account?.externalReferenceCode,
			accountId: Number(account?.id),
			channel: {
				currencyCode: productChannels?.currencyCode,
				id: Number(productChannels?.id),
				type: productChannels?.type as string,
			},
			channelId: Number(productChannels?.channelId),
			currencyCode: 'USD',
			customFields: getProductCustomFields(),
			orderItems: [
				{
					id: 0,
					quantity: 1,
					skuId: Number(productSku?.id),
				},
			],
			orderStatus: 1,
			orderTypeExternalReferenceCode:
				projectOrderType?.externalReferenceCode,
			orderTypeId: Number(projectOrderType?.id),
			shippingAmount: 0,
			shippingWithTaxAmount: 0,
		};

		const response = await postOrder(payload);

		if (response.id) {
			window.location.href = `${Liferay.ThemeDisplay.getPortalURL()}${getSiteURL()}/next-steps?orderId=${
				response.id
			}`;
		}
	};

	const handleCreateOrder = () => {
		const account = getValues('selectedAccount');
		const productChannels = getValues('product')?.productChannels[0];
		const productSpecifications = getValues('product')
			?.productSpecifications;
		const productSku = getValues('sku');

		const trialLength = productSpecifications?.find(
			(specification) =>
				specification?.specificationKey === 'trial-length'
		);

		const projectOrderType = orderType.find(
			({externalReferenceCode}: OrderType) =>
				externalReferenceCode === (trialLength?.value?.en_US as string)
		);

		onsubmit(account, productChannels, productSku, projectOrderType);
	};

	return (
		<div className="container-get-app-content">
			<ProductCard
				productId={Number(getUrlParam('productId'))}
				selectedAccount={getValues('selectedAccount')}
				setProductToForm={(product: Product) =>
					setValue('product', product)
				}
				showAccount={showAccount}
			/>
			<div className="border d-flex flex-column mt-7 p-5 rounded">
				<div className="d-flex flex-column">
					<div className="align-self-center h1 mb-6">
						{sectionProperties[step].title}
					</div>
					<div>{StepFormComponent[step]}</div>
				</div>
				<div className="d-flex justify-content-between mt-5 pt-2">
					<ClayButton displayType={null} onClick={() => onCancel()}>
						Cancel
					</ClayButton>
					<div className="align-self-end">
						{sectionProperties[step].backStep !== step && (
							<ClayButton
								displayType="secondary"
								onClick={() =>
									onPrevious(sectionProperties[step].backStep)
								}
							>
								Back
							</ClayButton>
						)}
						{sectionProperties[step].nextStep && (
							<ClayButton
								className="ml-5"
								onClick={() => {
									if (getValues('licenseSelected') === true) {
										return handleCreateOrder();
									}
									onContinue(
										sectionProperties[step].nextStep
									);
								}}
							>
								Continue
							</ClayButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GetAppFlow;
