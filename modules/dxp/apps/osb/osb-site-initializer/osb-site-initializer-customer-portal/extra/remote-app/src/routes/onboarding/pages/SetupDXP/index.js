import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import ClayForm, {ClayInput} from '@clayui/form';
import {useFormikContext} from 'formik';
import {useContext, useEffect, useState} from 'react';
import BaseButton from '~/common/components/BaseButton';
import Input from '~/common/components/Input';
import Select from '~/common/components/Select';
import useDebounce from '~/common/hooks/useDebounce';
import {LiferayTheme} from '~/common/services/liferay';
import {
	accountSubscription,
	bannedEmailDomains,
	createSetupDXP,
	getDXPCDataCenterRegions,
	getKoroneikiAccounts,
	getUserAccountById,
} from '~/common/services/liferay/graphql/queries';
import {API_BASE_URL} from '~/common/utils';
import {email, isValidProjectId} from '~/common/utils/validations.form';

import {AppContext} from '~/routes/onboarding/context';

import Layout from '../../components/Layout';

import {actionTypes} from '../../context/reducer';

import {getInitialDxpAdmin, steps} from '../../utils/constants';

const AdminInputs = ({id, value}) => {
	const debouncedEmail = useDebounce(value?.email, 500);
	const [bannedDomain, setBannedDomain] = useState(debouncedEmail);
	const [getBannedDomain, {data}] = useLazyQuery(bannedEmailDomains);
	const bannedDomainsItems = data?.c?.bannedEmailDomains?.items;

	useEffect(() => {
		const emailDomain = debouncedEmail.split('@')[1];

		if (emailDomain) {
			getBannedDomain({
				variables: {
					filter: `domain eq '${emailDomain}'`,
				},
			});

			if (bannedDomainsItems?.length) {
				setBannedDomain(bannedDomainsItems[0].domain);
			}
		}
	}, [bannedDomainsItems, debouncedEmail, getBannedDomain, value]);

	return (
		<ClayForm.Group className="mb-0 pb-1">
			<hr className="mb-4 mt-4 mx-3" />

			<Input
				groupStyle="pt-1"
				label="DXP Cloud System Admin's Email Address"
				name={`dxp.admins[${id}].email`}
				placeholder="username@superbank.com"
				required
				type="email"
				validations={[(value) => email(value, bannedDomain)]}
			/>

			<ClayInput.Group className="mb-0">
				<ClayInput.GroupItem className="m-0">
					<Input
						label="System Admin’s First Name"
						name={`dxp.admins[${id}].firstName`}
						required
						type="text"
					/>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem className="m-0">
					<Input
						label="System Admin’s Last Name"
						name={`dxp.admins[${id}].lastName`}
						required
						type="text"
					/>
				</ClayInput.GroupItem>
			</ClayInput.Group>

			<Input
				groupStyle="mb-0"
				label="System Admin’s Github Username"
				name={`dxp.admins[${id}].github`}
				required
				type="text"
			/>
		</ClayForm.Group>
	);
};

const SetupDXP = () => {
	const [, dispatch] = useContext(AppContext);

	const {errors, setFieldValue, touched, values} = useFormikContext();

	const [baseButtonDisabled, setBaseButtonDisabled] = useState(true);

	const {data: userAccountData} = useQuery(getUserAccountById, {
		variables: {userAccountId: LiferayTheme.getUserId()},
	});

	const {data} = useQuery(getDXPCDataCenterRegions);

	const dXPCDataCenterRegions = data?.c?.dXPCDataCenterRegions?.items;

	const accountBriefs = userAccountData?.userAccount?.accountBriefs || [];

	const {data: getAccountSubscriptions} =
		useQuery(accountSubscription, {
			variables: {
				filter: accountBriefs
					.map(
						(
							{externalReferenceCode},
							index,
							{length: totalAccountBriefs}
						) =>
							`accountKey eq '${externalReferenceCode}' ${
								index + 1 < totalAccountBriefs ? ' or ' : ' '
							}`
					)
					.join(' '),
			},
		}) || [];

	const hasDisasterRecovery = getAccountSubscriptions?.c?.accountSubscriptions?.items.filter(
		(accountSubscription) => {
			return (
				!accountSubscription?.name.includes('HA DR') ||
				!accountSubscription?.name.includes('Std DR')
			);
		}
	);

	const {data: koroneikiAccount} =
		useQuery(getKoroneikiAccounts, {
			variables: {
				filter: accountBriefs
					.map(
						(
							{externalReferenceCode},
							index,
							{length: totalAccountBriefs}
						) =>
							`accountKey eq '${externalReferenceCode}' ${
								index + 1 < totalAccountBriefs ? ' or ' : ' '
							}`
					)
					.join(' '),
			},
		}) || [];

	const projectInfo = koroneikiAccount?.c?.koroneikiAccounts?.items.map(
		({code, dxpVersion}) => ({
			code,
			dxpVersion,
		})
	);

	function handleSkip() {
		const redirectUrl = `${API_BASE_URL}${LiferayTheme.getLiferaySiteName()}`;
		window.location.href = redirectUrl;
	}

	useEffect(() => {
		const hasTouched = !Object.keys(touched).length;
		const hasError = Object.keys(errors).length;

		setBaseButtonDisabled(hasTouched || hasError);
	}, [touched, errors]);

	const [sendEmailData, {called}] = useMutation(createSetupDXP) || [];

	function sendEmail() {
		const formAdmins = JSON.stringify(values?.dxp.admins);
		const formDataCenterRegion = JSON.stringify(
			values?.dxp?.dataCenterRegion
		);
		const formDisasterDataCenterRegion = JSON.stringify(
			values?.dxp?.disasterDataCenterRegion
		);
		const formProjectId = JSON.stringify(values?.dxp?.projectId);
		if (!called) {
			sendEmailData({
				variables: {
					SetupDXP: {
						admins: formAdmins,
						dataCenterRegion: formDataCenterRegion,
						disasterDataCenterRegion: formDisasterDataCenterRegion,
						projectId: formProjectId,
					},
					scopeKey: LiferayTheme.getScopeGroupId(),
				},
			});
		}

		dispatch({
			payload: steps.success,
			type: actionTypes.CHANGE_STEP,
		});
	}

	return (
		<Layout
			className="pl-3 pt-1"
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
						onClick={() => {
							sendEmail();
						}}
					>
						Submit
					</BaseButton>
				),
			}}
			headerProps={{
				helper:
					'We’ll need a few details to finish building your DXP environment(s).',
				title: 'Set up DXP Cloud',
			}}
		>
			<div className="d-flex justify-content-between mb-2 pb-1 pl-3">
				<div className="flex-fill">
					<label>Project Name</label>

					<p className="text-neutral-3 text-paragraph-lg">
						<strong>
							{projectInfo?.length ? projectInfo[0].code : ''}
						</strong>
					</p>
				</div>

				<div className="flex-fill">
					<label>Liferay DXP Version</label>

					<p className="text-neutral-3 text-paragraph-lg">
						<strong>
							{projectInfo?.length
								? projectInfo[0].dxpVersion
								: ''}
						</strong>
					</p>
				</div>
			</div>

			<ClayForm.Group className="mb-0">
				<ClayForm.Group className="mb-0 pb-1">
					<Input
						groupStyle="pb-1"
						helper={
							!errors?.dxp?.projectId &&
							'Lowercase letters and numbers only. Project IDs cannot be change.'
						}
						label="Project ID"
						name="dxp.projectId"
						placeholder="superbank1"
						required
						type="text"
						validations={[(value) => isValidProjectId(value)]}
					/>

					<Select
						groupStyle="mb-0"
						label="Primary Data Center Region"
						name="dxp.dataCenterRegion"
						options={dXPCDataCenterRegions?.map(
							({dxpcDataCenterRegionId, name}) => ({
								label: name,
								value: dxpcDataCenterRegionId,
							})
						)}
						required
					/>

					{hasDisasterRecovery?.length && (
						<Select
							groupStyle="mb-0 pt-2"
							label="Disaster Recovery Data Center Region"
							name="dxp.disasterDataCenterRegion"
							options={dXPCDataCenterRegions?.map(
								({dxpcDataCenterRegionId, name}) => ({
									label: name,
									value: dxpcDataCenterRegionId,
								})
							)}
							required
						/>
					)}
				</ClayForm.Group>

				{values.dxp.admins.map((admin, index) => (
					<AdminInputs id={index} key={index} value={admin} />
				))}
			</ClayForm.Group>

			<BaseButton
				borderless
				className="ml-3 my-2 text-brand-primary"
				eslint-disable-next-line
				lines-around-comment
				onClick={() => {
					setFieldValue('dxp.admins', [
						...values.dxp.admins,
						getInitialDxpAdmin(),
					]);
					setBaseButtonDisabled(true);
				}}
				prependIcon="plus"
				small
			>
				Add Another Admin
			</BaseButton>
		</Layout>
	);
};

export default SetupDXP;
