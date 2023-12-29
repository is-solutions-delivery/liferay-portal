import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import {useModal} from '@clayui/modal';

import {useState} from 'react';
import Modal from '../../common/components/Modal';
import MDFClaim from '../../common/interfaces/mdfClaim';
import {LiferayAPIs} from '../../common/services/liferay/common/enums/apis';
import useGet from '../../common/services/liferay/object/useGet';
import ModalContent from './components/MdfClaimModalContent';
import useGetDropdownOptions, {
	ClaimStatus,
} from './hooks/useGetDropdownOptions';
import useGetObjectId from './hooks/useGetObjectId';
import useMdfClaimStatusManager from './hooks/useMdfClaimStatusManager';

const MDFClaimManagerStatus = () => {
	const [selectedOption, setSelectedOption] = useState('');
	const [isVisibleModal, setIsVisibleModal] = useState(false);
	const mdfClaimId = useGetObjectId();
	const {data: mdfClaim} = useGet<MDFClaim>(
		`/o/${LiferayAPIs.OBJECT}/mdfclaims/${mdfClaimId}`
	);
	const mdfClaimStatusKey = mdfClaim?.mdfClaimStatus?.key as ClaimStatus;

	const openModal = () => {
		setIsVisibleModal(() => true);
	};

	const {dropdownOptions, hasOptions} = useGetDropdownOptions({
		mdfClaimStatusKey,
		openModal,
	});

	const {observer, onClose} = useModal({
		onClose: () => {
			setIsVisibleModal(false);
		},
	});

	const {callMDFClaimModal} = useMdfClaimStatusManager();

	return (
		<div>
			<div>
				{hasOptions ? (
					<ClayDropDown
						trigger={
							<ClayButton displayType={'secondary'}>
								<span className="dislay-inline-block mr-1">
									{mdfClaim?.mdfClaimStatus.name}
								</span>
								<ClayIcon symbol="caret-bottom" />
							</ClayButton>
						}
					>
						<ClayDropDown.ItemList>
							<ClayDropDown.Group>
								{dropdownOptions.map((item, index) => (
									<ClayDropDown.Item
										key={index}
										onClick={() => {
											item.onClick();
											setSelectedOption(() => item.label);
											openModal();
										}}
									>
										{item.label}
									</ClayDropDown.Item>
								))}
							</ClayDropDown.Group>
						</ClayDropDown.ItemList>
					</ClayDropDown>
				) : (
					<span className="dislay-inline-block mr-1">
						Status: {mdfClaim?.mdfClaimStatus.name}
					</span>
				)}
				<p className="mb-0 mt-2 text-neutral-8 text-paragraph-sm">
					Select <strong>In Finance Review</strong> to approve the
					claim
				</p>
			</div>

			{isVisibleModal && (
				<Modal observer={observer} center={false}>
					<ModalContent
						callMDFClaimModal={callMDFClaimModal}
						mdfClaimId={mdfClaimId}
						onClose={onClose}
						selectedOption={selectedOption}
					/>
				</Modal>
			)}
		</div>
	);
};

export default MDFClaimManagerStatus;
