import "./LicenseSelector.scss";
import ClayIcon from "@clayui/icon";

import { CardButton } from "../../CardButton/CardButton";
import { useCallback, useEffect, useState } from "react";
import { PaidTimeline } from "./PaidTimeline/PaidTimeline";
import { TrialTimeline } from "./TrialTimeline/TrialTimeline";

export function setCardIcon(icon: string) {
  return (
    <div className="card-icon">
      <ClayIcon symbol={icon} />
    </div>
  );
}

interface LicenseSelectorProps {
  selectedProduct?: Product;
}

export function LicenseSelector({ selectedProduct }: LicenseSelectorProps) {
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [trialSku, setTrialSku] = useState<SKU[]>();

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
      <div className="license-selector">
        <CardButton
          description={"Try now. Pay Later"}
          disabled={trialSku ? false : true}
          onClick={trialSku ? () => handleTimelineSelect("trial") : () => {}}
          selected={selectedTimeline === "trial" ? true : false}
          title={"Trial"}
          icon={setCardIcon("check-circle")}
        />
        <CardButton
          description={"Pay Today"}
          disabled={false}
          onClick={() => handleTimelineSelect("paid")}
          selected={selectedTimeline === "paid" ? true : false}
          title={"Paid"}
          icon={setCardIcon("credit-card")}
        />
      </div>

      {selectedTimeline ? (
        <div className="timeline-container">
          {selectedTimeline === "trial" ? <TrialTimeline sku={trialSku}/> : <PaidTimeline product={selectedProduct}/>}
        </div>
      ) : null}
    </div>
  );
}
