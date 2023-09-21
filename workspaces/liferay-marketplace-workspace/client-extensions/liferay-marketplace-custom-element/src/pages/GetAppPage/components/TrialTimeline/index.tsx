/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { useState } from "react";

import { CardButton } from "../../../../components/CardButton/CardButton";
import { GetClayIcon } from "../../../../components/GetClayIcon/GetClayIcon";

import "./index.scss";

interface TrialTimelineProps {
  onSelectLicense: (licenseSelected: boolean) => void;
}

export function TrialTimeline({ onSelectLicense }: TrialTimelineProps) {
  const [handleSelected, setHandleSelected] = useState<Boolean>(false);

  return (
    <div className="d-flex flex-column trial-timeline">
      <p className="mb-2 trial-info">
        Need help with license calculations?
        <span className="info-button">
          More Info
          <GetClayIcon icon="question-circle-full" />
        </span>
      </p>
      <CardButton
        description="Trial licenses are intended for you to try the app before you buy. Typical trials are 30 days."
        disabled={false}
        icon={
          <GetClayIcon className="trial-card-icon" icon="percentage-symbol" />
        }
        iconRight={true}
        onClick={() => {
          setHandleSelected(true);
          onSelectLicense(true);
        }}
        selected={handleSelected ? true : false}
        title="Trial License"
      />
    </div>
  );
}
