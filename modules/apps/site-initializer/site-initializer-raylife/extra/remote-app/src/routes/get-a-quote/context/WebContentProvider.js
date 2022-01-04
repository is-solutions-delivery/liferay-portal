import {createContext, useContext, useEffect, useState} from 'react';
import {useCustomEvent} from '../../../common/hooks/useCustomEvent';
import {getLiferayGroupId} from '../../../common/services/liferay/themeDisplay';
import {DEVICES} from '../../../common/utils/constants';
import {
	getContentTemplates,
	getStructuredContentFolders,
} from '../services/WebContent';
import {AppContext} from './AppContextProvider';

const WEB_CONTENT_NAME = 'Tip';
const siteGroupId = getLiferayGroupId();

const WebContentContext = createContext();

const getTipFolderId = async () => {
	const {
		data: {items: structuredContentFolders = []},
	} = await getStructuredContentFolders(
		siteGroupId,
		`?filter=name eq '${WEB_CONTENT_NAME}'`
	);

	return structuredContentFolders[0]?.id;
};

const getTipTemplateId = async () => {
	const {
		data: {items: contentTemplates},
	} = await getContentTemplates(
		siteGroupId,
		`?filter=contains(name, '${WEB_CONTENT_NAME}')`
	);

	return contentTemplates[0]?.id;
};

const WebContentProvider = ({children}) => {
	const {
		state: {dimensions},
	} = useContext(AppContext);
	const [dispatchEvent] = useCustomEvent();
	const [context, setContext] = useState();
	const isMobile = dimensions.deviceSize === DEVICES.PHONE;

	const getInitialData = async () => {
		const [tipFolderId, tipTemplateId] = await Promise.allSettled([
			getTipFolderId(),
			getTipTemplateId(),
		]);

		if (!tipFolderId) {
			return console.warn('Raylife TIP Folder not found');
		}

		if (!tipTemplateId) {
			return console.warn('Raylife TIP Template not found');
		}

		setContext({
			tipFolderId,
			tipTemplateId,
		});
	};

	const dispatchCustomEvent = (data, event) => {
		if (isMobile) {
			return alert('Abrindo Modal!');
		}

		dispatchEvent(data, event);
	};

	useEffect(() => {
		if (isMobile && !context) {
			getInitialData();
		}
	}, [isMobile, context]);

	return (
		<WebContentContext.Provider value={[context, dispatchCustomEvent]}>
			{children}
		</WebContentContext.Provider>
	);
};

export default WebContentProvider;

export {WebContentContext};
