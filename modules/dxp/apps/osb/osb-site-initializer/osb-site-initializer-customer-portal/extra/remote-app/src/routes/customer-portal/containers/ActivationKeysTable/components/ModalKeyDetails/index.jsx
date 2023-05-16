/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */
import ClayAlert from '@clayui/alert';
import {ClayToggle} from '@clayui/form';
import ClayModal from '@clayui/modal';
import React, {useEffect, useState} from 'react';
import i18n from '../../../../../../common/I18n';
import Button from '../../../../../../common/components/Button';
import {useAppPropertiesContext} from '../../../../../../common/contexts/AppPropertiesContext';
import {Liferay} from '../../../../../../common/services/liferay';
import {
	deleteSubscriptionInKey,
	getSubscriptionInKey,
	putSubscriptionInKey,
} from '../../../../../../common/services/liferay/rest/raysource/LicenseKeys';
import {ALERT_DOWNLOAD_TYPE} from '../../../../utils/constants/alertDownloadType';
import {AUTO_CLOSE_ALERT_TIME} from '../../../../utils/constants/autoCloseAlertTime';
import {ALERT_ACTIVATION_AGGREGATED_KEYS_DOWNLOAD_TEXT} from '../../utils/constants/alertAggregateKeysDownloadText';
import {downloadActivationLicenseKey} from '../../utils/downloadActivationLicenseKey';
import TableKeyDetails from '../TableKeyDetails';

const ModalKeyDetails = ({
	currentActivationKey,
	observer,
	onClose,
	project,
	sessionId,
}) => {
	const {provisioningServerAPI} = useAppPropertiesContext();
	const [valueToCopyToClipboard, setValueToCopyToClipboard] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [
		activationKeysDownloadStatusModal,
		setActivationKeysDownloadStatusModal,
	] = useState('');
	const [toggledSubscription, setToggleSubscription] = useState(false);
	const [hasErrorSubscription, setHasErrorSubscription] = useState(false);

	const handleAlertStatus = (hasSuccessfullyDownloadedKeys) => {
		setActivationKeysDownloadStatusModal(
			hasSuccessfullyDownloadedKeys
				? ALERT_DOWNLOAD_TYPE.success
				: ALERT_DOWNLOAD_TYPE.danger
		);
	};

	const {featureFlags} = useAppPropertiesContext();

	const responseMessage = (Message, typeMessage) =>
		Liferay.Util.openToast({
			title: i18n.translate(Message),
			type: typeMessage,
		});

	const getStatusSubscription = async () => {
		try {
			const result = await getSubscriptionInKey(
				provisioningServerAPI,
				currentActivationKey.id,
				sessionId
			);
			setToggleSubscription(result);
			setIsLoading(true);
			setHasErrorSubscription(false);
		} catch {
			setIsLoading(true);
			responseMessage('get-subscription-failed', 'danger');
			setHasErrorSubscription(true);
		}
	};

	useEffect(() => {
		getStatusSubscription();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubscriptionInKey = (status) => {
		const handleToggle = () => setToggleSubscription((toggled) => !toggled);
		handleToggle();
		const fn = status ? deleteSubscriptionInKey : putSubscriptionInKey;
		try {
			fn(provisioningServerAPI, currentActivationKey.id, sessionId);
			responseMessage('success', 'success');
		} catch {
			setTimeout(() => {
				handleToggle();
				responseMessage('subscription-failed', 'danger');
			}, 500);
		}
	};

	return (
		isLoading && (
			<ClayModal center observer={observer} size="lg">
				<div className="pt-4 px-4">
					<div className="d-flex justify-content-between mb-4">
						<div className="flex-row mb-1">
							<h6 className="text-brand-primary">
								{i18n.translate('activation-key-details')}
							</h6>

							<h2 className="text-neutral-10">
								{currentActivationKey.name}
							</h2>

							<p>{currentActivationKey.description}</p>
						</div>

						<Button
							appendIcon="times"
							aria-label="close"
							className="align-self-start"
							displayType="unstyled"
							onClick={onClose}
						/>
					</div>

					<TableKeyDetails
						currentActivationKey={currentActivationKey}
						setValueToCopyToClipboard={setValueToCopyToClipboard}
					/>

					{featureFlags.includes('LPS-185063') && (
						<>
							<div className="dropdown-divider"></div>

							<div>
								<ClayToggle
									disabled={hasErrorSubscription}
									label={i18n.sub('expiration-notifications')}
									onClick={() =>
										handleSubscriptionInKey(
											toggledSubscription
										)
									}
									toggled={toggledSubscription}
								/>

								<p className="pt-2">
									{i18n.sub(
										'enable-notifications-through-email-when-this-activation-key-is-about-to-expire-x-days-before-x-days-before-and-on-the-day-of-expiration-you-can-unsubscribe-at-any-time',
										[30, 15]
									)}
								</p>
							</div>

							<div className="dropdown-divider"></div>
						</>
					)}

					<div className="d-flex justify-content-end my-4">
						<Button displayType="secondary" onClick={onClose}>
							{i18n.translate('close')}
						</Button>

						<Button
							appendIcon="download"
							className="ml-2"
							onClick={async () => {
								const isAbleToDownloadKey = await downloadActivationLicenseKey(
									currentActivationKey.id,
									provisioningServerAPI,
									sessionId,
									currentActivationKey.productName,
									currentActivationKey.productVersion,
									project.name
								);
								handleAlertStatus(isAbleToDownloadKey);
							}}
						>
							{i18n.translate('download-key')}
						</Button>
					</div>
				</div>

				{valueToCopyToClipboard && (
					<ClayAlert.ToastContainer>
						<ClayAlert
							autoClose={AUTO_CLOSE_ALERT_TIME.success}
							displayType="success"
							onClose={() => setValueToCopyToClipboard(false)}
						>
							{i18n.sub('x-copied-to-clipboard', [
								valueToCopyToClipboard,
							])}
						</ClayAlert>
					</ClayAlert.ToastContainer>
				)}

				{activationKeysDownloadStatusModal && (
					<ClayAlert.ToastContainer>
						<ClayAlert
							autoClose={
								AUTO_CLOSE_ALERT_TIME[
									activationKeysDownloadStatusModal
								]
							}
							className="cp-activation-key-download-alert"
							displayType={
								ALERT_DOWNLOAD_TYPE[
									activationKeysDownloadStatusModal
								]
							}
							onClose={() =>
								setActivationKeysDownloadStatusModal('')
							}
						>
							{
								ALERT_ACTIVATION_AGGREGATED_KEYS_DOWNLOAD_TEXT[
									activationKeysDownloadStatusModal
								]
							}
						</ClayAlert>
					</ClayAlert.ToastContainer>
				)}
			</ClayModal>
		)
	);
};
export default ModalKeyDetails;
