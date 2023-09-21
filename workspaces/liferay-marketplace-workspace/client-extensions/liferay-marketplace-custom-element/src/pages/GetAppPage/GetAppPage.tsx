/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {useState} from 'react';
import {useForm} from 'react-hook-form';

import { getSiteURL } from "../../components/InviteMemberModal/services";
import { Liferay } from "../../liferay/liferay";
import { getUrlParam } from "../../utils/getUrlParam";
import AccountSelection from "./components/AccountSelection";
import { LicenseSelector } from "./components/LicenseSelector/index";
import ProductCard from "./components/ProductCard";
import { StepType } from "./enums/stepType";

type StepComponent = {
	[key in StepType]?: JSX.Element;
};

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
    title: "Account Selection"
  },
  [StepType.LICENSES]: {
    backStep: StepType.ACCOUNT,
    nextStep: StepType.PAYMENT,
    title: "License Selection"
  },
  [StepType.PAYMENT]: {
    backStep: StepType.LICENSES,
    nextStep: StepType.PAYMENT,
    title: "Payment us"
  }
};

const GetAppFlow = () => {
	const [step, setStep] = useState<StepType>(StepType.ACCOUNT);
	const [showAccount, setShowAccount] = useState<Boolean>(false);

  const { getValues, setValue } = useForm<getAppProps>({
    defaultValues: {
      licenseSelected: false,
      product: undefined,
      selectedAccount: undefined,
      sku: undefined
    }
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
          setValue("selectedAccount", account);
          setShowAccount(true);
        }}
      />
    ),
    [StepType.LICENSES]: (
      <LicenseSelector
        onSelectLicense={(licenseSelected: boolean, sku: SKU | undefined) => {
          setValue("licenseSelected", licenseSelected);
          setValue("sku", sku);
        }}
        selectedProduct={getValues("product")}
      />
    )
  };

  const handleCreateOrder = () => {    
    // const onsubmit = async () => {
    // 	const payload: Order = {
    // 		account: {
    // 			id: Number(account?.id),
    // 			type: account?.type as string,
    // 		},
    // 		accountExternalReferenceCode:account?.externalReferenceCode,
    // 		accountId: Number(account?.id),
    // 		channel: {
    // 			currencyCode: channel?.currencyCode,
    // 			id: channel?.id,
    // 			type: channel?.type,
    // 		},
    // 		channelId: channel?.id,
    // 		currencyCode: 'USD',
    // 		customFields: getProductCustomFields(),
    // 		orderItems: [
    // 			{
    // 				id: 0,
    // 				quantity: 1,
    // 				skuId: Number(sku.id),
    // 			},
    // 		],
    // 		orderStatus: 1,
    // 		orderTypeExternalReferenceCode: orderType?.externalReferenceCode,
    // 		orderTypeId: Number(orderType?.id),
    // 		shippingAmount: 0,
    // 		shippingWithTaxAmount: 0,
    // 	};
    // 	await postOrder(payload);
    // };
  };

  return (
    <div style={{ width: "600px" }}>
      <ProductCard
        productId={Number(getUrlParam("productId"))}
        selectedAccount={getValues("selectedAccount")}
        setProductToForm={(product: Product) => setValue("product", product)}
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
                onClick={() => onPrevious(sectionProperties[step].backStep)}
              >
                Back
              </ClayButton>
            )}
            {sectionProperties[step].nextStep && (
              <ClayButton
                className="ml-5"
                onClick={() => {
                  if (getValues("licenseSelected") === true) {
                    handleCreateOrder();
                  } else {
                    onContinue(sectionProperties[step].nextStep);
                  }
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
