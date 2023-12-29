import {Liferay} from '../../../common/services/liferay';
import {ClaimStatus} from './useGetDropdownOptions';

const useMdfClaimStatusManager = () => {
	const updateClaimStatus = async (
		status: ClaimStatus,
		mdfClaimId: string
	) => {
		const response = await fetch(`/o/c/mdfclaims/${mdfClaimId}`, {
			body: `{"mdfClaimStatus": "` + status + `"}`,
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': Liferay.authToken,
			},
			method: 'PATCH',
		});

		if (response.ok) {
			location.reload();

			return;
		}

		Liferay.Util.openToast({
			message: 'The MDF Claim Status cannot be changed.',
			type: 'danger',
		});
	};

	const updatePaidClaimStatus = async (
		status: ClaimStatus,
		payment: string,
		checkNumber: string,
		paymentDate: string,
		mdfClaimId: number | undefined
	) => {
		const response = await fetch(`/o/c/mdfclaims/${mdfClaimId}`, {
			body:
				`{"mdfClaimStatus": "` +
				status +
				`", "claimPaid": "` +
				payment +
				`",
        "checkNumber": "` +
				checkNumber +
				`", "paymentDate": "` +
				paymentDate +
				`"}`,

			headers: {
				'content-type': 'application/json',
				'x-csrf-token': Liferay.authToken,
			},
			method: 'PATCH',
		});

		if (response.ok) {
			location.reload();

			return;
		}

		Liferay.Util.openToast({
			message: 'The MDF Claim Status cannot be changed.',
			type: 'danger',
		});
	};

	// const callClaimPaidModal = (status: ClaimStatus, mdfClaimId: string) => {
	// 	return Liferay.Util.openModal({
	// 		bodyHTML: `<form>
	//                         <div class="form-group">
	//                             <label for="claimPaidInput">Amount Paid</label>

	//                             <input class="form-control" id="claimPaidInput" placeholder="Amount Paid" type="number" />
	//                         </div>

	//                         <div class="form-group">
	//                             <label for="checkNumberInput">Check Number</label>

	//                             <input class="form-control" id="checkNumberInput" placeholder="Check Number" type="text" />
	//                         </div>

	//                         <div class="form-group">
	//                             <label>Payment Date</label>

	//                             <input class="form-control" id="paymentDate" placeholder="Payment Data" type="date" />
	//                         </div>
	//                     </form>`,
	// 		buttons: [
	// 			{
	// 				displayType: 'secondary',
	// 				label: Liferay.Language.get('Cancel'),
	// 				type: 'cancel',
	// 			},
	// 			{
	// 				displayType: 'primary',
	// 				label: 'Submit',

	// 				onClick() {
	// 					const checkNumber = (
	// 						<HTMLInputElement>
	// 							document.getElementById('checkNumberInput'))?.value;
	// 					const claimPaid =
	//                     (<HTMLInputElement>document.getElementById('claimPaidInput'))?.value;
	// 					const paymentDate =
	// (						<HTMLInputElement>document.getElementById('paymentDate')).value

	// 					if (checkNumber && claimPaid && paymentDate) {
	// 						return updatePaidClaimStatus(
	// 							status,
	// 							claimPaid,
	// 							checkNumber,
	// 							paymentDate,
	// 							mdfClaimId
	// 						);
	// 					}

	// 					Liferay.Util.openToast({
	// 						message:
	// 							'The MDF Claim Status cannot be changed without the fields being filled.',
	// 						type: 'danger',
	// 					});
	// 				},
	// 				type: 'submit',
	// 			},
	// 		],
	// 		headerHTML: `<h1 class="m-0">Status Change</h1>`,
	// 		size: 'md',
	// 	});
	// };

	const callMDFClaimModal = (status: ClaimStatus, mdfClaimId: string) => {
		if (status !== 'approved') {
			const textarea = <HTMLInputElement>(
				document.getElementById('descriptionTextArea')
			);

			if (textarea.value) {
				const commentParagraph = document
					.querySelector('iframe')!
					.contentWindow?.document.querySelector(
						'body.portlet-page-comments p'
					);

				const postCommentButton = <HTMLButtonElement>(
					document.querySelector('button.btn-comment')
				);

				if (commentParagraph) {
					//@ts-ignore
					commentParagraph.innerHTML = Liferay.Util.escape(
						textarea.value
					);
				}

				postCommentButton.disabled = false;
				postCommentButton.click();

				return updateClaimStatus(status, mdfClaimId);
			}

			Liferay.Util.openToast({
				message:
					'The MDF Claim Status cannot be changed without a motivation.',
				type: 'danger',
			});
			return;
		}

		return updateClaimStatus(status, mdfClaimId);
	};

	return {callMDFClaimModal, updateClaimStatus};
};

export default useMdfClaimStatusManager;
