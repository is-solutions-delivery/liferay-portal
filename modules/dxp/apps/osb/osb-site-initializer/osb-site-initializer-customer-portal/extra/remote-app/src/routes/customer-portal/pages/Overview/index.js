/* eslint-disable @liferay/portal/no-react-dom-create-portal */
import {useQuery} from '@apollo/client';
import {useContext, useEffect, useMemo} from 'react';
import {usePageGuard} from '../../../../common/hooks/usePageGuard';
import {
	getAccountSubscriptionGroups,
	getKoroneikiAccounts,
} from '../../../../common/services/liferay/graphql/queries';
import {Storage} from '../../../../common/services/liferay/storage';
import Subscriptions from '../../components/Subscriptions';
import {AppContext} from '../../context';
import {actionTypes} from '../../context/reducer';
import {CUSTOM_EVENTS} from '../../utils/constants';
import {webComponentsGenerator} from '../../utils/webComponentsGenerator';

const Overview = ({userAccount}) => {
	const [{project}, dispatch] = useContext(AppContext);

	const {isLoading} = usePageGuard(
		userAccount,
		project.accountKey,
		'overview'
	);
	const slaCurrentVersionAndProducts = useMemo(() => [], []);

	const {data, loading: isLoadingKoroneiki} = useQuery(getKoroneikiAccounts, {
		variables: {
			filter: `accountKey eq '${project.accountKey}'`,
		},
	});

	useEffect(() => {
		if (!isLoadingKoroneiki && data) {
			const koroneikiAccount = data.c?.koroneikiAccounts?.items[0];

			slaCurrentVersionAndProducts.push(
				koroneikiAccount.slaCurrent,
				koroneikiAccount.dxpVersion
			);

			dispatch({
				payload: koroneikiAccount,
				type: actionTypes.UPDATE_PROJECT,
			});

			window.dispatchEvent(
				new CustomEvent(CUSTOM_EVENTS.PROJECT, {
					bubbles: true,
					composed: true,
					detail: koroneikiAccount,
				})
			);
		}
	}, [data, dispatch, isLoadingKoroneiki, slaCurrentVersionAndProducts]);

	const {
		data: dataSubscriptionGroups,
		loading: isLoadingSubscritionsGroups,
	} = useQuery(getAccountSubscriptionGroups, {
		variables: {
			filter: `accountKey eq '${project.accountKey}'`,
		},
	});

	useEffect(() => {
		if (!isLoadingSubscritionsGroups && dataSubscriptionGroups) {
			const subscriptionGroupsItems =
				dataSubscriptionGroups.c?.accountSubscriptionGroups?.items;

			dispatch({
				payload: subscriptionGroupsItems,
				type: actionTypes.UPDATE_SUBSCRIPTION_GROUPS,
			});

			slaCurrentVersionAndProducts.push(
				...subscriptionGroupsItems.map((group) => group.name)
			);
		}

		Storage.setItem(
			'cp-tip-container-primary',
			JSON.stringify(webComponentsGenerator(slaCurrentVersionAndProducts))
		);
	}, [
		dataSubscriptionGroups,
		dispatch,
		isLoadingSubscritionsGroups,
		slaCurrentVersionAndProducts,
	]);

	if (isLoading || isLoadingKoroneiki) {
		return <div>Overview Skeleton</div>;
	}

	return <Subscriptions accountKey={project.accountKey} />;
};

export default Overview;
