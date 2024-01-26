/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {z} from 'zod';

import {Header} from '../../../../components/Header/Header';
import FormInput from '../../../../components/Input/formInput';
import {useMarketplaceContext} from '../../../../context/MarketplaceContext';
import i18n from '../../../../i18n';
import {Liferay} from '../../../../liferay/liferay';
import zodSchema from '../../../../schema/zod';
import {createContactSales} from '../../../../utils/api';

type ContactSalesForm = z.infer<typeof zodSchema.contactSales>;

const ContactSalesForm = () => {
	const {myUserAccount} = useMarketplaceContext();
	const {accountId} = useParams();
	const navigate = useNavigate();

	const {
		formState: {errors},
		handleSubmit,
		register,
		setValue,
	} = useForm<ContactSalesForm>({
		defaultValues: {
			accountName: '',
			additionalAppsRequested: '',
			comments: '',
			email: Liferay.ThemeDisplay.getUserEmailAddress(),
			name: Liferay.ThemeDisplay.getUserName(),
		},
		resolver: zodResolver(zodSchema.contactSales),
	});

	const selectedAccount = myUserAccount.accountBriefs.find(
		(account) => account.id === Number(accountId)
	);

	useEffect(() => {
		if (selectedAccount) {
			setValue('accountName', selectedAccount?.name);
		}
	}, [selectedAccount, setValue]);

	const inputProps = {
		error: errors,
		register,
		required: true,
	};

	const _submit = async (form: any) => {
		try {
			await createContactSales(form);

			Liferay.Util.openToast({
				message: i18n.translate('request-sent-successfully'),
				type: 'success',
			});

			Liferay.Util.navigate(
				Liferay.ThemeDisplay.getCanonicalURL().replace('/get-app', '')
			);
		} catch (error) {
			Liferay.Util.openToast({
				message: i18n.translate('request-sent-successfully'),
				type: 'success',
			});
		}
	};

	return (
		<div className="align-items-center contact-sales-page d-flex flex-column justify-content-center py-6">
			<div className="col-11">
				<Header
					description={
						<div className="d-flex flex-column justify-content-center text-center w-100">
							<p className="m-0">
								{i18n.translate(
									'The selected project does not meet the necessary resource requirements for this app. Please contact sales to request additional resources.'
								)}
							</p>
						</div>
					}
					title={
						<div className="d-flex flex-column justify-content-center text-center w-100">
							<p className="m-0">
								{i18n.translate('Contact Sales')}
							</p>
						</div>
					}
				/>
			</div>

			<ClayForm className="px-5 w-100">
				<div>
					<FormInput
						{...inputProps}
						boldLabel
						label={i18n.translate('account-name')}
						name="accountName"
					/>
				</div>

				<div className="d-flex justify-content-between">
					<div className="form-group mb-0 pr-2 w-50">
						<FormInput
							{...inputProps}
							boldLabel
							label={i18n.translate('name')}
							name="name"
						/>
					</div>

					<div className="form-group mb-0 pl-2 w-50">
						<FormInput
							{...inputProps}
							boldLabel
							label={i18n.translate('email')}
							name="email"
							type="email"
						/>
					</div>
				</div>

				<div className="d-flex flex-column">
					<FormInput
						{...inputProps}
						boldLabel
						label={i18n.translate('additional-apps-requested')}
						name="additionalAppsRequested"
						placeholder={i18n.translate(
							'Enter additional apps requested'
						)}
						type="textarea"
					/>

					<FormInput
						{...inputProps}
						boldLabel
						label={i18n.translate('comments')}
						name="comments"
						placeholder={i18n.translate('Describe your request')}
						type="textarea"
					/>
				</div>

				<div className="purchased-solutions-button-container">
					<div className="align-items-center d-flex justify-content-between mb-4 w-100">
						<div>
							<ClayButton
								className="p-3"
								displayType="unstyled"
								onClick={() => navigate('..')}
							>
								{i18n.translate('cancel')}
							</ClayButton>
						</div>
						<div>
							<ClayButton
								displayType="primary"
								onClick={handleSubmit(_submit)}
							>
								{i18n.translate('send-request')}
							</ClayButton>
						</div>
					</div>
				</div>
			</ClayForm>
		</div>
	);
};

export default ContactSalesForm;
