/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable react/no-unescaped-entities */

import circleFill from "../../../../assets/icons/circle_fill_icon.svg";
import radioSelected from "../../../../assets/icons/radio_button_checked_2_icon.svg";
import timeline from "../../../../assets/images/timeline.png";
import { calculateTrialTime } from "../../../../utils/calculateTrialTime";

import "./index.scss";

interface TrialTimelineProps {
  sku?: SKU[];
}

export function TrialMethod({ sku }: TrialTimelineProps) {
  const trialTime = calculateTrialTime();

  return (
    <div className="trial">
      <div className="trial-method">
        <img
          alt="circle fill"
          className="trial-method-icon-selected"
          src={radioSelected}
        />

        <img alt="timeline" className="trial-method-dash" src={timeline} />

        <img alt="circleFill" className="trial-method-icon" src={circleFill} />
      </div>

      <div className="trial-messages">
        <div className="trial-messages-item">
          <div className="active title">Today - free trial for 30 days. </div>

          <div className="description">
            Start your free trial and test the full app for 30 days.
          </div>
        </div>

        <div className="trial-messages-item">
          <div className="title">
            {trialTime.endOfTrialMonth} {trialTime.endOfTrialDay}
          </div>

          <div className="description">
            Your trial ends and this app will no longer function in your
            project, unless you've subscribed during the trial.
          </div>
        </div>
      </div>
    </div>
  );
}
