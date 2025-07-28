/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Button from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import { useRef, useState } from 'react';

import useModalContext from '../../../../hooks/useModalContext';
import i18n from '../../../../i18n';
import SSAFormBody from './ModalFormBody';

const useSSAForm = () => {
	const modalContext = useModalContext();
	const submitRef = useRef<() => boolean>(() => false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const openModal = () => {
		modalContext.onOpenModal({
			body: <SSAFormBody submitRef={submitRef} />,
			footer: [
				null,
				null,
				<div key={1}>
					<Button
						className="mr-2"
						disabled={isSubmitting}
						displayType="secondary"
						onClick={() => modalContext.onClose()}
					>
						{i18n.translate('cancel')}
					</Button>
					<Button
						disabled={isSubmitting}
						displayType="primary"
						onClick={async () => {
							setIsSubmitting(true);
							const successful = await submitRef.current();

							if (successful) {
								setIsSubmitting(false);
								modalContext.onClose();
							} else {
								setIsSubmitting(false); // garantir reset
							}
						}}
					>
						<div className="align-items-center d-flex">
							{isSubmitting && (
								<ClayLoadingIndicator className="mr-3 my-0" />
							)}

							{i18n.translate('create')}
						</div>
					</Button>
				</div>,
			],
			size: 'md',
		});
	};

	return { openModal };
};

export { useSSAForm };
