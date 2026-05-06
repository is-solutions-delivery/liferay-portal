import ky from 'ky';
import { createClient } from 'liferay-headless-rest-client';

import { liferayAuthSchema } from '../config/auth-schema';

const {
    LIFERAY_HOST,
    LIFERAY_CLIENT_ID,
    LIFERAY_CLIENT_SECRET,
    LIFERAY_PASSWORD,
    LIFERAY_USERNAME,
} = liferayAuthSchema.parse(import.meta.env);

const isBasicAuth = LIFERAY_USERNAME && LIFERAY_PASSWORD;

const liferay = ky.extend({
    prefixUrl: LIFERAY_HOST,
});

const cache = new Map();

const kyFetch = liferay.extend({
    throwHttpErrors: false,
    headers: {
        Authorization: isBasicAuth
            ? `Basic ${btoa(`${LIFERAY_USERNAME}:${LIFERAY_PASSWORD}`)}`
            : '',
    },
    timeout: 60000,
    hooks: {
        beforeRequest: [
            async (request) => {
                if (isBasicAuth) {
                    return request.headers.set(
                        'authorization',
                        `Basic ${btoa(`${LIFERAY_USERNAME}:${LIFERAY_PASSWORD}`)}`,
                    );
                }

                if (!LIFERAY_CLIENT_ID || !LIFERAY_CLIENT_SECRET) {
                    return;
                }

                let authorization = cache.get('authorization');

                const isExpired = cache.has('expires_in')
                    ? Date.now() > cache.get('expires_in')
                    : false;

                if (!authorization || isExpired) {
                    const searchParams = new URLSearchParams();

                    searchParams.set('client_id', LIFERAY_CLIENT_ID);
                    searchParams.set('client_secret', LIFERAY_CLIENT_SECRET);
                    searchParams.set('grant_type', 'client_credentials');

                    const response = await liferay.post('o/oauth2/token', {
                        body: searchParams,
                    });

                    console.info('Token exchanged');

                    const data = await response.json<any>();

                    authorization = `${data.token_type} ${data.access_token}`;

                    cache.set(
                        'expires_in',
                        data.expires_in * 1000 + Date.now() - 15000,
                    );

                    cache.set('authorization', authorization);
                }

                return request.headers.set('authorization', authorization);
            },
        ],
    },
    retry: {
        limit: 5,
        methods: ['get', 'post'],
        statusCodes: [403, 401],
        delay: (attemptCount) => 5000 * attemptCount,
    },
});

export const liferayClient = createClient({
    baseUrl: LIFERAY_HOST,
    fetch: kyFetch,
});

export default kyFetch;
