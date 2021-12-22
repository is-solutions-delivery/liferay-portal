import ActivationKeysLayout from '../../components/ActivationKeysLayout';

const EnterpriseSearch = ({accountKey, sessionId}) => {
	return (
		<ActivationKeysLayout>
			<ActivationKeysLayout.Inputs
				accountKey={accountKey}
				productKey="enterprise-search"
				productTitle="Enterprise Search"
				sessionId={sessionId}
			/>
		</ActivationKeysLayout>
	);
};

export default EnterpriseSearch;
