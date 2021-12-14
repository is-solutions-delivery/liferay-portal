import {useQuery} from '@apollo/client';
import ClayForm from '@clayui/form';
import {useFormikContext} from 'formik';
import {useContext, useEffect, useState} from 'react';
import BaseButton from '../../../../common/components/BaseButton';
import WarningBadge from '../../../../common/components/WarningBadge';
import {LiferayTheme} from '../../../../common/services/liferay';
import {getAccountSubscriptionGroups} from '../../../../common/services/liferay/graphql/queries';
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
		}
		else {
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
				<hr className="mt-0 mx-3" />

				<div className="mx-3">
					<a
						className="btn font-weight-bold p-0 text-link-sm"
						href="https://liferay.com/pt"
						rel="noreferrer"
						target="_blank"
					>
						Learn more about Customer Portal roles
					</a>
				</div>
			</div>
		</Layout>
	);
};

export default Invites;
