/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from "@clayui/button";
import { useEffect,useState } from "react";
import { useForm } from "react-hook-form";

import { LicenseSelector } from "../../components/GetAppModal/LicenseSelector/LicenseSelector";
import { getSiteURL } from "../../components/InviteMemberModal/services";
import { Liferay } from "../../liferay/liferay";
import { createCart, patchOrderByERC, postCheckoutCart } from "../../utils/api";
import { getUrlParam } from "../../utils/getUrlParam";
import AccountSelection from "./components/AccountSelection";
import ProductCard from "./components/ProductCard";
import { StepType } from "./enums/stepType";

enum ProductFields {
	SPECIFICATIONFREE = 'free',
}

type ProductSku = {
  productId: number | undefined
  skuId: number
  specification: string
}

type StepComponent = {
	[key in StepType]?: JSX.Element;
};

type getAppProps = {
	product?: Product;
	selectedAccount?: Account;
};

const sectionProperties = {
  [StepType.ACCOUNT]: {
    backStep: StepType.ACCOUNT,
    nextStep: StepType.LICENSES,
    title: "Account Selection",
  },
  [StepType.LICENSES]: {
    backStep: StepType.ACCOUNT,
    nextStep: StepType.PAYMENT,
    title: "License Selection",
  },
  [StepType.PAYMENT]: {
    backStep: StepType.LICENSES,
    nextStep: StepType.PAYMENT,
    title: "Payment Method",
  },
};

const GetAPPFlow = () => {
  const [step, setStep] = useState<StepType>(StepType.ACCOUNT);
  const [showAccount, setShowAccount] = useState<Boolean>(false);
  const [productSku, setProductSku] = useState<ProductSku>({ productId: 0, skuId: 0, specification: ""});

	const {getValues, setValue} = useForm<getAppProps>({
		defaultValues: {
			product: undefined,
			selectedAccount: undefined,
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
          setValue("selectedAccount", account);
          setShowAccount(true);
        }}
      />
    ),
    [StepType.LICENSES]: (
      <LicenseSelector selectedProduct={getValues("product")} />
    ),
  };

  const clearAlphanumericString = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  };

  const getProductSpecification = () => {

    const productSpecifications = getValues('product')?.productSpecifications;
    let productSpecificationName = "";
    if(productSpecifications){
      for (const productSpecificationItem of productSpecifications) {
        productSpecificationName = productSpecificationItem?.value?.en_US;
        break;
      }
      
      return clearAlphanumericString(productSpecificationName)
  
    }
  }

  const specification = getProductSpecification();
  
  useEffect(() => {
    
    if (specification === ProductFields.SPECIFICATIONFREE) {
      const productSkus = getValues('product')?.skus;
      const skuItem = (productSkus || [])[0];     
      const { id: skuId, productId } = skuItem;
      
      setProductSku({ productId, skuId, specification });
    }

  }, [specification]);
    

  const getChannelId = () => {

    const productChannels = getValues('product')?.productChannels;

    const channel = (productChannels || [])[0];

    return channel ? channel.channelId : undefined;
    
  };
 
  const cartCriation = async () => {

    const channelId = getChannelId();
    const account = getValues('selectedAccount');  

    const ObjCartCreation = {
      body: {
        accountId: account?.id,
        currencyCode: "USD",
        cartItems: [
        {
          productId: productSku.productId,
          quantity: 1,
          skuId: productSku.skuId
        }
      ]
    },
      channelId: Number(channelId)
    }

    const cartResponse = await createCart(ObjCartCreation)

    const cartCheckoutResponse = await postCheckoutCart({
      cartId: cartResponse.id,
    })

    const newOrderValues = {
      orderStatus: 6,
    };

    const cartChangeStatusResponse =  await patchOrderByERC(
      cartCheckoutResponse.orderUUID,
      newOrderValues
    );
      
    if(cartChangeStatusResponse.ok){
      console.log("NExt Step");

      // sectionProperties[StepType.ACCOUNT].nextStep = StepType.NEXTSTEPS;
    }
      
  }
  

  return (
    <>
      <ProductCard
        productId={Number(getUrlParam("productId"))}
        selectedAccount={getValues("selectedAccount")}
        setProductToForm={(product: Product) => setValue("product", product)}
        showAccount={showAccount}
      ></ProductCard>
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
            <ClayButton
              className="ml-5"
              disabled={
                productSku.productId !== 0 ? false : true 
              }
              onClick={() => {
                productSku.specification === ProductFields.SPECIFICATIONFREE ? cartCriation() : onContinue(sectionProperties[step].nextStep);
              }}
            >
              Get App
            </ClayButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAppFlow;
