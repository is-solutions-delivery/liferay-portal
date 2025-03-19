/* global Liferay */

import axios from 'axios';
import {config} from './constants';
import {getCurrentSiteId} from './util';

export async function getOAuthToken() {
	const prom = new Promise((resolve, reject) => {
		Liferay.OAuth2Client.FromUserAgentApplication(config.agentOauthAppId)
			._getOrRequestToken()
			.then(
				(token) => {
					resolve(token.access_token);
				},
				(error) => {
					resolve(null);
				}
			)
			.catch((error) => {
				resolve(null);
			});
	});

	return prom;
}

export function getServerUrl() {
	return Liferay.OAuth2Client.FromUserAgentApplication(config.agentOauthAppId)
		.homePageURL;
}

export async function getSpringOAuthToken() {
	const prom = new Promise((resolve, reject) => {
		Liferay.OAuth2Client.FromUserAgentApplication(
			config.agentOauthSpringAppId
		)
			._getOrRequestToken()
			.then(
				(token) => {
					resolve(token.access_token);
				},
				(error) => {
					resolve(null);
				}
			)
			.catch((error) => {
				resolve(null);
			});
	});

	return prom;
}

export async function oAuthRequest(config) {
	return request({
		headers: {
			'Authorization': `Bearer ${await getOAuthToken()}`,
			'Accept-Language':
				Liferay.ThemeDisplay.getLanguageId().split('_')[0],
			'scope-id': getCurrentSiteId(),
		},
		...config,
	});
}

export function request(config) {
	return new Promise((resolve, reject) => {
		axios
			.request(
				{
					headers: {
						'x-csrf-token': Liferay.authToken,
						'Accept-Language':
							Liferay.ThemeDisplay.getLanguageId().split('_')[0],
						'scope-id': getCurrentSiteId(),
					},
					method: 'get',
					...config,
				},
				(error) => {
					reject({error, message: error || ''});
				}
			)
			.then((response) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject({error, message: error || ''});
			});
	});
}
