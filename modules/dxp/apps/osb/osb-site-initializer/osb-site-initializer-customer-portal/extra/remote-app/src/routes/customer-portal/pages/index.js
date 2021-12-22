import {useCustomerPortal} from '../context';
import {pages} from '../utils/constants';
import ActivationKeys from './ActivationKeys';
import Home from './Home';
import Overview from './Overview';

const Pages = () => {
	const [{page, project, sessionId, userAccount}] = useCustomerPortal();

	if (page === pages.OVERVIEW) {
		if (userAccount && project) {
			return <Overview project={project} userAccount={userAccount} />;
		}

		return <ActivationKeys.Skeleton />;
	}

	if (page === pages.ENTERPRISE_SEARCH) {
		if (project && sessionId) {
			return (
				<ActivationKeys.EnterpriseSearch
					accountKey={project.accountKey}
					sessionId={sessionId}
				/>
			);
		}

		return <ActivationKeys.Skeleton />;
	}

	if (page === pages.COMMERCE) {
		if (project && sessionId) {
			return (
				<ActivationKeys.Commerce
					accountKey={project.accountKey}
					sessionId={sessionId}
				/>
			);
		}

		return <ActivationKeys.Skeleton />;
	}

	if (userAccount) {
		return <Home userAccount={userAccount} />;
	}

	return <Home.Skeleton />;
};

export default Pages;
