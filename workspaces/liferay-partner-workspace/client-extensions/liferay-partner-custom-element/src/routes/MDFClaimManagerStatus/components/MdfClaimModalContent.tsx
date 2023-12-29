/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {default as Button, default as ClayButton} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayModal from '@clayui/modal';
import {ClaimStatus} from '../hooks/useGetDropdownOptions';

interface IProps {
	onClose: () => void;
	selectedOption: string;
	mdfClaimId: string;
	callMDFClaimModal: (
		status: ClaimStatus,
		mdfClaimId: string
	) => Promise<void> | undefined;
}

const modalStatusTypes = {
	'Canceled': 'canceled',
	'In Finance Review': 'inFinanceReview',
	'In Director Review': 'inDirectorReview',
	'Marketing Director Review': 'marketingDirectorReview',
	'Request More Info': 'moreInfoRequested',
	'Pending Marketing Review': 'pendingMarketingReview',
	'Rejected': 'rejected',
};

export default function ModalContent({
	onClose,
	selectedOption,
	mdfClaimId,
	callMDFClaimModal,
}: IProps) {
	return (
		<>
			<ClayModal.Header>Status Change</ClayModal.Header>
			<ClayModal.Body>
				<label htmlFor="descriptionTextArea" className="fw-bold">
					Status change motivation
				</label>
				<ClayInput
					component="textarea"
					id="descriptionTextArea"
					placeholder="Describre here..."
					type="text"
				/>
			</ClayModal.Body>
			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							Cancel
						</ClayButton>
						<Button
							displayType="primary"
							onClick={() =>
								callMDFClaimModal(
									modalStatusTypes[
										selectedOption as keyof typeof modalStatusTypes
									] as ClaimStatus,
									mdfClaimId
								)
							}
							type="button"
						>
							{selectedOption}
						</Button>
					</ClayButton.Group>
				}
			/>
		</>
	);
}
