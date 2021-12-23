import {useCustomerPortal} from '../context';
import {pages} from '../utils/constants';
import ActivationKeys from './ActivationKeys';
import Home from './Home';
import Overview from './Overview';

const Pages = () => {
	const [{page, project, sessionId, userAccount}] = useCustomerPortal();

	const PageSkeletons = {
		[pages.COMMERCE]: <ActivationKeys.Skeleton />,
		[pages.ENTERPRISE_SEARCH]: <ActivationKeys.Skeleton />,
		[pages.OVERVIEW]: <div>Overview Skeleton</div>,
	};

	const PageComponent = {
		[pages.COMMERCE]: (
			<ActivationKeys.Commerce
				accountKey={project?.accountKey}
				sessionId={sessionId}
			/>
		),
		[pages.ENTERPRISE_SEARCH]: (
			<ActivationKeys.EnterpriseSearch
				accountKey={project?.accountKey}
				sessionId={sessionId}
			/>
		),
		[pages.OVERVIEW]: (
			<Overview project={project} userAccount={userAccount} />
		),
	};

	if (page === pages.HOME) {
		if (userAccount) {
			return <Home userAccount={userAccount} />;
		}

		return <Home.Skeleton />;
	}

	if (project && userAccount && sessionId) {
		return PageComponent[page];
	}

	return PageSkeletons[page];
};

export default Pages;
