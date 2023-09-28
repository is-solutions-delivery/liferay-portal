import ClayIcon from "@clayui/icon";

import { useCallback, useEffect, useState } from "react";

import { CardButton } from "../../../../components/CardButton/CardButton";
import { TrialTimeline } from "./TrialTimeline";
import { PaidTimeline } from "./PaidTimeline";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { getAppProps } from "../../GetAppPage";

export function setCardIcon(icon: string) {
	return (
		<div className="card-icon">
			<ClayIcon symbol={icon} />
		</div>
	);
}

interface LicenseSelectorProps {
	selectedProduct?: Product;
	cart: any;
	form: {
		setValue: UseFormSetValue<getAppProps>;
		getValues: UseFormGetValues<getAppProps>;
	};
}

export function LicenseSelector({
	cart,
	selectedProduct,
	form,
}: LicenseSelectorProps) {
	const [selectedTimeline, setSelectedTimeline] = useState("");
	const [trialSku, setTrialSku] = useState<any>();

	const hasTrialSkuVerification = useCallback(() => {
		selectedProduct?.skus?.some((sku) => {
			if (sku.sku.toLowerCase().includes("trial")) {
				setTrialSku(sku);
			}
		});
	}, [selectedProduct]);

	useEffect(() => {
		hasTrialSkuVerification();
	}, [hasTrialSkuVerification]);

	const handleTimelineSelect = (timeline: string) => {
		setSelectedTimeline(timeline);
	};

	return (
		<div className="license-selector-timeline">
			<div className="license-selector d-flex justify-content-between">
				<CardButton
					description={"Try now. Pay Later"}
					disabled={trialSku ? false : true}
					onClick={trialSku ? () => handleTimelineSelect("trial") : () => {}}
					selected={selectedTimeline === "trial" ? true : false}
					title={"Trial"}
				/>
				<CardButton
					description={"Pay Today"}
					disabled={false}
					onClick={() => handleTimelineSelect("paid")}
					selected={selectedTimeline === "paid" ? true : false}
					title={"Paid"}
				/>
			</div>

			{selectedTimeline ? (
				<div className="timeline-container">
					{selectedTimeline === "trial" ? (
						<TrialTimeline sku={trialSku} />
					) : (
						<PaidTimeline product={selectedProduct} form={form} cart={cart} />
					)}
				</div>
			) : null}
		</div>
	);
}
