import ClayIcon from '@clayui/icon';
import './index.scss';
import { CardButton } from '../../../../../../components/CardButton/CardButton';
import { useState } from 'react';

interface TrialTimelineProps {
	setLicenseSelected: (licenseSelected: boolean) => void;
}

export function TrialTimeline({setLicenseSelected}: TrialTimelineProps) {
	const [selectedLicense, setSelectedLicense] = useState<boolean>(false);
	return (
		<div className="d-flex flex-column trial-timeline">
			<p className="d-flex mb-2 trial-info">
				Need help with license calculations?
				<span className="d-flex info-button">
					More Info
					<span>
						<ClayIcon symbol="question-circle-full" />
					</span>
				</span>
			</p>
			<CardButton
				description="Trial licenses are intended for you to try the app before you buy. Typical trials are 30 days."
				disabled={false}
				icon={
					<span className="trial-card-icon">
						<ClayIcon symbol="percentage-symbol" />
					</span>
				}
				iconRight
				onClick={() => {
					setLicenseSelected(true)
					setSelectedLicense(true)
				}}
				selected={selectedLicense}
				title="Trial License"
			/>
		</div>
	);
}