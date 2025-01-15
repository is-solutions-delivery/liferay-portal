/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {sub} from 'frontend-js-web';
import React, {ComponentProps, ReactNode} from 'react';

import {Product} from '../../types';

export enum States {
	ERROR,
	CONFIRM_INSTALLATION,
	IN_PROGRESS,
	NO_PROJECT,
	NO_RESOURCES,
	SUCCESS,
}

type MarketplacePurchaseProps = {
	onClickCancel: () => void;
	onClickInstall: () => void;
	product: Product;
	projectId?: string;
	state: States;
};

const MARKETPLACE_ADMIN_EMAIL = 'marketplace-admin@liferay.com';

type MarketplacePurchaseBodyProps = {
	children: ReactNode;
	primaryButtonProps?: ComponentProps<typeof ClayButton>;
	secondaryButtonProps?: ComponentProps<typeof ClayButton>;
	title: string;
};

const MarketplacePurchaseBodyContent: React.FC<
	MarketplacePurchaseBodyProps
> = ({children, primaryButtonProps, secondaryButtonProps, title}) => (
	<div className="m-4 marketplace-product-purchase p-5 rounded-lg">
		<div className="align-items-center d-flex flex-column justify-content-center">
			<h1 className="mb-5">{title}</h1>

			<p className="text-center text-secondary w-75">{children}</p>
		</div>

		<div className="d-flex justify-content-between mt-6 w-100">
			{secondaryButtonProps && (
				<ClayButton
					borderless
					displayType="unstyled"
					{...secondaryButtonProps}
				/>
			)}

			{primaryButtonProps && <ClayButton {...primaryButtonProps} />}
		</div>
	</div>
);

export function MarketplacePurchaseBody({
	onClickCancel,
	onClickInstall,
	projectId,
	state,
}: MarketplacePurchaseProps) {
	const secondaryButtonProps = {
		children: Liferay.Language.get('cancel'),
		onClick: onClickCancel,
	} as React.HTMLAttributes<HTMLButtonElement>;

	if (state === States.SUCCESS) {
		return (
			<MarketplacePurchaseBodyContent
				secondaryButtonProps={secondaryButtonProps}
				title={Liferay.Language.get('success')}
			>
				<span className="mx-1">
					Your app has been installed, wait a few moments for it to be
					available for use.
				</span>
			</MarketplacePurchaseBodyContent>
		);
	}

	if (state === States.ERROR) {
		return (
			<MarketplacePurchaseBodyContent
				secondaryButtonProps={secondaryButtonProps}
				title={Liferay.Language.get('error')}
			>
				<span className="mx-1">
					{Liferay.Language.get(
						'sorry-was-not-possible-to-install-your-app-you-can-try-again-if-the-problem-persist-contact-via'
					)}
				</span>

				<a href={`mailto:${MARKETPLACE_ADMIN_EMAIL}`}>
					{MARKETPLACE_ADMIN_EMAIL}
				</a>
			</MarketplacePurchaseBodyContent>
		);
	}

	if (state === States.NO_PROJECT) {
		return (
			<MarketplacePurchaseBodyContent
				secondaryButtonProps={secondaryButtonProps}
				title={Liferay.Language.get('no-cloud-project-available')}
			>
				<p className="text-red">
					{Liferay.Language.get(
						'you-currently-do-not-have-access-to-any-cloud-projects-please-login-as-a-user-that-has-access-to-a-project-or-contact-your-project-administrator-to-add-you-to-a-project'
					)}
				</p>
			</MarketplacePurchaseBodyContent>
		);
	}

	if (state === States.NO_RESOURCES) {
		return (
			<MarketplacePurchaseBodyContent
				primaryButtonProps={{
					borderless: true,
					children: sub(
						Liferay.Language.get('contact-x'),
						Liferay.Language.get('support')
					),
				}}
				secondaryButtonProps={secondaryButtonProps}
				title={Liferay.Language.get('insufficient-resources')}
			>
				{sub(
					Liferay.Language.get(
						'x-project-does-not-meet-the-necessary-resource-requirements-for-this-app-please-contact-sales-support-to-request-additional-resources'
					),
					projectId as string
				)}
			</MarketplacePurchaseBodyContent>
		);
	}

	if (state === States.IN_PROGRESS) {
		return (
			<MarketplacePurchaseBodyContent
				title={Liferay.Language.get('installation-in-progress')}
			>
				<ClayLoadingIndicator
					className="mb-4"
					displayType="primary"
					shape="squares"
					size="lg"
				/>

				<span>
					{Liferay.Language.get(
						'the-installation-process-is-ongoing-and-may-take-some-time-navigating-to-other-sections-will-not-cancel-the-process'
					)}
				</span>
			</MarketplacePurchaseBodyContent>
		);
	}

	if (state === States.CONFIRM_INSTALLATION) {
		return (
			<MarketplacePurchaseBodyContent
				primaryButtonProps={{
					children: Liferay.Language.get('install'),
					onClick: onClickInstall,
				}}
				secondaryButtonProps={secondaryButtonProps}
				title={Liferay.Language.get('confirmation-required')}
			>
				{Liferay.Language.get(
					'are-you-sure-you-want-to-proceed-with-the-installation-click-install-to-confirm-or-cancel-to-go-back'
				)}
			</MarketplacePurchaseBodyContent>
		);
	}

	return null;
}
