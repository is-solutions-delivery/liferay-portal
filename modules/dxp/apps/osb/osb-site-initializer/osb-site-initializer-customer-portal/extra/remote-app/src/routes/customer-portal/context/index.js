import {useQuery} from '@apollo/client';
import {createContext, useEffect, useReducer} from 'react';
import {LiferayTheme} from '../../../common/services/liferay';
import {getUserAccount} from '../../../common/services/liferay/graphql/queries';
import {
	PARAMS_KEYS,
	SearchParams,
} from '../../../common/services/liferay/search-params';
import {CUSTOM_EVENTS} from '../utils/constants';
import reducer, {actionTypes} from './reducer';

const AppContext = createContext();

const AppContextProvider = ({assetsPath, children, page}) => {
	const [state, dispatch] = useReducer(reducer, {
		assetsPath,
		page,
		project: {},
		subscriptionGroups: [],
		userAccount: undefined,
	});

	// useEffect(() => {
	// 	// eslint-disable-next-line no-console
	// 	console.log(page);
	// }, [page]);

	const {data} = useQuery(getUserAccount, {
		variables: {id: LiferayTheme.getUserId()},
	});

	const userAccount = data?.userAccount;

	useEffect(() => {
		const projectExternalReferenceCode = SearchParams.get(
			PARAMS_KEYS.PROJECT_APPLICATION_EXTERNAL_REFERENCE_CODE
		);

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

			window.dispatchEvent(
				new CustomEvent(CUSTOM_EVENTS.USER_ACCOUNT, {
					bubbles: true,
					composed: true,
					detail: userAccount,
				})
			);

			// window.dispatchEvent(
			// 	new CustomEvent(CUSTOM_EVENTS.QUICK_LINKS, {
			// 		bubbles: true,
			// 		composed: true,
			// 		detail: {
			// 			data: [
			// 				'web-content-action-01',
			// 				'web-content-action-02',
			// 				'web-content-action-03',
			// 				'web-content-action-04',
			// 				'web-content-action-05',
			// 				'web-content-action-06',
			// 				'web-content-action-07',
			// 				'web-content-action-08',
			// 				'web-content-action-09',
			// 			],
			// 			userAccount,
			// 		},
			// 	})
			// );
		}
	}, [userAccount]);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{children}
		</AppContext.Provider>
	);
};

export {AppContext, AppContextProvider};
