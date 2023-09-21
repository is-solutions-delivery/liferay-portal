/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* eslint-disable react/no-unescaped-entities */

import circleFill from '../../assets/icons/circle_fill_icon.svg';
import radioSelected from '../../assets/icons/radio_button_checked_2_icon.svg';
import timeline from '../../assets/images/timeline.png';

import './TrialTimeline.scss';

export function TrialTimeline() {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

  return (
    <div className="trial-timeline">
      <p className="mb-2 trial-info">
        Need help with license calculations?
        <span className="info-button">
          More Info
          <CardClayIcon icon="question-circle-full" />
        </span>
      </p>
      <CardButton
        description="Trial licenses are intended for you to try the app before you buy. Typical trials are 30 days."
        disabled={false}
        icon={
          <CardClayIcon className="trial-card-icon" icon="percentage-symbol" />
        }
        iconLeft={false}
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
