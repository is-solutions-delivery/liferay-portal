import {LiferayService} from '../services/liferay';

export function getWebDavUrl() {
	const siteName = LiferayService.getLiferaySiteName().replace('/web/', '');

	return `/webdav/${siteName}/document_library`;
}
