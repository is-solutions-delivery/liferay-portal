import { useEffect, useState } from "react";

import {
	getLicenseDescription,
	getPricelistByCatalogName,
	getTierPrice,
} from "../../../../../utils/api";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import useCart from "../../../../../hooks/useCart";
import { getAppProps } from "../../../GetAppPage";
import LicenseSectorCard from "../LicenseCard";

interface PaidTimelineProps {
	product?: Product;
	cart: any;
	form: {
		setValue?: UseFormSetValue<getAppProps>;
		getValues: UseFormGetValues<getAppProps>;
	};
}

export function PaidTimeline({ product, form, cart }: PaidTimelineProps) {
	console.log("PaidTimeline  product:", product);
	const [skuInfo, setSkuInfo] = useState<any>({});
	const [tierPrice, setTierPrice] = useState<any>([]);
	const productId = product?.id;

	const { getCartData } = useCart();

	useEffect(() => {
		(async () => {
			const catalogName = product?.catalog?.name;

			const tierpriceData = await getTierPrice(catalogName);
			setTierPrice(tierpriceData);

			const skuDescription = await getLicenseDescription();
			setSkuInfo(skuDescription?.items[0]);
		})();
	}, []);

	const skus = product?.skus;

	const purchasebleSkus = skus?.filter((sku) =>
		sku?.skuOptions.find((option) =>
			option?.key !== "trial" && option?.value === "yes" ? true : false,
		),
	);

	return (
		<div className="paid-timeline">
			<div>
				<span>
					<p className="mt-3">Need help with license calculations?</p>
				</span>

				{purchasebleSkus?.map((sku: SKU, index) => {
					const tierPricesList = tierPrice?.filter(
						(tier: any) => tier?.tierPrice.length && tier.skuId === sku.id,
					);

					const licenseTypeName = sku.skuOptions.find(
						(optins) => optins.value === "yes",
					);

					return (
						<div className="mb-5" key={index}>
							<LicenseSectorCard
								productId={productId}
								cart={cart}
								sku={sku}
								licenseDescription={
									skuInfo[licenseTypeName?.key as keyof typeof skuInfo]
								}
								licensetiers={tierPricesList}
								lisenceType={licenseTypeName?.key}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
