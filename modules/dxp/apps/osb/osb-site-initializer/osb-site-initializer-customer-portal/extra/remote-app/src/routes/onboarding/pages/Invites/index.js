/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import {useQuery} from '@apollo/client';
import ClayForm from '@clayui/form';
import {useFormikContext} from 'formik';
import {useContext, useEffect, useMemo, useState} from 'react';
import BaseButton from '../../../../common/components/BaseButton';
import WarningBadge from '../../../../common/components/WarningBadge';
import {LiferayTheme} from '../../../../common/services/liferay';
import {
	getAccountRolesAndAccountFlags,
	getAccountSubscriptionGroups,
} from '../../../../common/services/liferay/graphql/queries';
import {PARAMS_KEYS} from '../../../../common/services/liferay/search-params';
import {API_BASE_URL} from '../../../../common/utils';
import InvitesInputs from '../../components/InvitesInputs';
import Layout from '../../components/Layout';
import {AppContext} from '../../context';
import {actionTypes} from '../../context/reducer';
import {getInitialInvite, steps} from '../../utils/constants';

const ACCOUNT_SUBSCRIPTION_GROUP_NAME = 'DXP Cloud';

const Invites = () => {
	const [{project}, dispatch] = useContext(AppContext);
	const {errors, setFieldValue, setTouched, values} = useFormikContext();
	const [baseButtonDisabled, setBaseButtonDisabled] = useState();
	const [hasInitialError, setInitialError] = useState();

	const {data: rolesData} = useQuery(getAccountRolesAndAccountFlags, {
		variables: {
			accountFlagsFilter: '',
			accountId: 0,
		},
	});

	const totalEmails = values?.invites?.length || 0;
	const failedEmails = errors?.invites?.filter((email) => email).length || 0;
	const filledEmails = values?.invites?.filter(({email}) => email).length;

	const {data} = useQuery(getAccountSubscriptionGroups, {
		variables: {
			filter: `(accountKey eq '${project.accountKey}') and (name eq '${ACCOUNT_SUBSCRIPTION_GROUP_NAME}')`,
		},
	});

	const hasSubscriptionsDXPCloud = !!data?.c?.accountSubscriptionGroups?.items
		?.length;

	const nextStep = hasSubscriptionsDXPCloud
		? steps.dxpCloud
		: steps.successDxpCloud;

	const accountRoles = useMemo(() => {
		let filterRoles = [
			...new Set(
				rolesData?.accountAccountRoles?.items.map(({name}) => name)
			),
		];
		const SLA_CURRENT = project.slaCurrent;
		const isPartner = project.partner;

		if (
			!SLA_CURRENT.includes('Gold') &&
			!SLA_CURRENT.includes('Platinum')
		) {
			filterRoles = filterRoles.filter((label) => label !== 'Requestor');
		}

		if (!isPartner) {
			filterRoles = filterRoles.filter(
				(label) =>
					label !== 'Partner Manager' && label !== 'Partner Member'
			);
		}

		return filterRoles;
	}, [rolesData]);

	const handleSkip = () => {
		window.location.href = `${API_BASE_URL}${LiferayTheme.getLiferaySiteName()}/overview?${
			PARAMS_KEYS.PROJECT_APPLICATION_EXTERNAL_REFERENCE_CODE
		}=${project.accountKey}`;
	};

	const handleSubmit = () => {
		if (!filledEmails) {
			setInitialError(true);
			setBaseButtonDisabled(true);
			setTouched({
				invites: [{email: true}],
			});
		} else {
			dispatch({
				payload: nextStep,
				type: actionTypes.CHANGE_STEP,
			});
		}
	};

	useEffect(() => {
		if (filledEmails) {
			setInitialError(false);
			const sucessfullyEmails = totalEmails - failedEmails;

			setBaseButtonDisabled(sucessfullyEmails < filledEmails);
		}
	}, [failedEmails, filledEmails, totalEmails]);

	return (
		<Layout
			footerProps={{
				leftButton: (
					<BaseButton borderless onClick={handleSkip}>
						Skip for now
					</BaseButton>
				),
				middleButton: (
					<BaseButton
						disabled={baseButtonDisabled}
						displayType="primary"
						onClick={handleSubmit}
					>
						Send Invitations
					</BaseButton>
				),
			}}
			headerProps={{
				helper:
					'Team members will receive an email invitation to access this project on Customer Portal.',
				title: 'Invite Your Team Members',
			}}
		>
			{hasInitialError && (
				<WarningBadge>
					<span className="pl-1">
						Add at least one user&apos;s email to send an
						invitation.
					</span>
				</WarningBadge>
			)}

			<div className="invites-form overflow-auto px-3">
				<ClayForm.Group className="m-0">
					{values.invites.map((invite, index) => (
						<InvitesInputs
							disableError={hasInitialError}
							id={index}
							invite={invite}
							key={index}
							options={accountRoles}
						/>
					))}
				</ClayForm.Group>

				<BaseButton
					borderless
					className="mb-3 ml-3 mt-2 text-brand-primary"
					onClick={() => {
						setBaseButtonDisabled(false);
						setFieldValue('invites', [
							...values.invites,
							getInitialInvite(),
						]);
					}}
					prependIcon="plus"
					small
				>
					Add More Members
				</BaseButton>
			</div>

			<div className="invites-helper px-3">
				<div className="mx-3 pt-3">
					<h5 className="text-neutral-7">
						{`${
							project.slaCurrent.includes('Gold') ||
							project.slaCurrent.includes('Platinum')
								? 'Requestor'
								: 'Administrator'
						}	roles available: 2 of ${project.maxRequestors}`}
					</h5>

					<p className="mb-0 text-neutral-7 text-paragraph-sm">
						{`Only ${project.maxRequestors} members per project (including yourself) have
						role permissions (Admins & Requestors) to open Support
						tickets. `}

						<a
							className="font-weight-bold text-neutral-9"
							href="https://liferay.com/pt"
							rel="noreferrer"
							target="_blank"
						>
							Learn more about Customer Portal roles
						</a>
					</p>
				</div>
			</div>
		</Layout>
	);
};

export default Invites;
