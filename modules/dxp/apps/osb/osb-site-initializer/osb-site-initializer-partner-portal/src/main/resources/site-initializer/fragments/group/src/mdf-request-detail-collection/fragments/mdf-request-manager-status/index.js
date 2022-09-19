/* eslint-disable no-undef */
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

const currentPath = Liferay.currentURL.split('/');
const mdfRequestId = +currentPath[currentPath.length - 1];

const updateStatusToPending = fragmentElement.querySelector('#status-pending');

const updateStatus = async (status) => {
	// eslint-disable-next-line @liferay/portal/no-global-fetch
	const statusManagerResponse = await fetch(
		`/o/c/mdfrequests/${mdfRequestId}`,
		{
			body: `{"requestStatus": "${status}"}`,
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': Liferay.authToken,
			},
			method: 'PATCH',
		}
	);

	if (statusManagerResponse.ok) {
		const data = await statusManagerResponse.json();

		document.getElementById(
			'mdf-request-status-display'
		).innerHTML = `Status: ${Liferay.Util.escape(data.requestStatus)}`;

		updateStatusToPending.disabled = true;
		updateStatusToPending.innerHTML = Liferay.Util.escape(
			data.requestStatus
		);
		updateStatusToPending.classList.toggle('border-primary');
		updateStatusToPending.classList.toggle('border-warning');

		return;
	}

	Liferay.Util.openToast({
		message: 'An unexpected error occured.',
		type: 'danger',
	});
};

updateStatusToPending.onclick = () =>
	Liferay.Util.openConfirmModal({
		message: 'Do you want to submit this MDF?',
		onConfirm: (isConfirmed) => {
			if (isConfirmed) {
				updateStatus('Pending Marketing Review');
			}
		},
	});
