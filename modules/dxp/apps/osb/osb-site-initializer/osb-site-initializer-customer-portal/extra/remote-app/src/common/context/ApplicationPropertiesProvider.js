import {createContext, useContext} from 'react';

const defaultProperties = {
	createSupportRequest: '',
	licenseKeyDownloadURL: '',
	liferaywebdavurl: '',
	oktaSessionURL: '',
	page: '',
	route: '',
	supportLink: '',
};

export const ApplicationPropertiesContext = createContext(defaultProperties);

/**
 * @description The Context contains all properties settled on Web Component
 * @param {Object} Props -> Contains object with Properties of Application
 * Inserted from index.html properties for Web Component
 */

const ApplicationContextProvider = ({children, properties}) => (
	<ApplicationPropertiesContext.Provider value={properties}>
		{children}
	</ApplicationPropertiesContext.Provider>
);

export default ApplicationContextProvider;

const useApplicationProvider = () => useContext(ApplicationPropertiesContext);

export {useApplicationProvider};
