import {useQuery} from '@apollo/client';
import {createContext, useContext, useEffect, useReducer} from 'react';
import {useApplicationProvider} from '../../../common/context/ApplicationPropertiesProvider';
import {useCustomEvent} from '../../../common/hooks/useCustomEvent';
import {LiferayTheme} from '../../../common/services/liferay';
import {fetchSession} from '../../../common/services/liferay/api';
import {getUserAccount} from '../../../common/services/liferay/graphql/queries';
import {
	PARAMS_KEYS,
	SearchParams,
} from '../../../common/services/liferay/search-params';
import {CUSTOM_EVENTS} from '../utils/constants';
import reducer, {actionTypes} from './reducer';

const AppContext = createContext();

const AppContextProvider = ({assetsPath, children, page}) => {
	const {oktaSessionURL} = useApplicationProvider();
	const dispatchEvent = useCustomEvent(CUSTOM_EVENTS.USER_ACCOUNT);
	const [state, dispatch] = useReducer(reducer, {
		assetsPath,
		page,
		project: {},
		sessionId: 'sessionId',
		subscriptionGroups: [],
		userAccount: undefined,
	});

	const {data} = useQuery(getUserAccount, {
		variables: {id: LiferayTheme.getUserId()},
	});

	const userAccount = data?.userAccount;

	useEffect(() => {
		const getSessionId = async () => {
			const session = await fetchSession(oktaSessionURL);

			if (session) {
				dispatch({
					payload: session.id,
					type: actionTypes.UPDATE_SESSION_ID,
				});
			}
		};

		getSessionId();
	}, [oktaSessionURL]);

	useEffect(() => {
		const projectExternalReferenceCode = SearchParams.get(
			PARAMS_KEYS.PROJECT_APPLICATION_EXTERNAL_REFERENCE_CODE
		);

		window.addEventListener('customer-portal-menu-selected', ({detail}) => {
			dispatch({
				payload: detail,
				type: actionTypes.UPDATE_PAGE,
			});
		});

		dispatch({
			payload: {
				accountKey: projectExternalReferenceCode,
			},
			type: actionTypes.UPDATE_PROJECT,
		});
	}, []);

	useEffect(() => {
		if (userAccount) {
			dispatch({
				payload: userAccount,
				type: actionTypes.UPDATE_USER_ACCOUNT,
			});

			dispatchEvent(userAccount);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userAccount]);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{children}
		</AppContext.Provider>
	);
};

const useCustomerPortal = () => useContext(AppContext);

export {AppContext, AppContextProvider, useCustomerPortal};
