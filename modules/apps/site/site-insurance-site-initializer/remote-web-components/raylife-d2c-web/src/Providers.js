import {ClayIconSpriteContext} from '@clayui/icon';
import React from 'react';
import Cookie from 'js-cookie';
import {FormProvider, useForm} from 'react-hook-form';

import {Template} from './components/Template';
import {AppProvider} from './context/AppContext';
import {COOKIES} from './utils/constants';

const getDefaultValues = () => {
	try {
		let data = '';

		if (document.cookie.includes(COOKIES.BACK_TO_EDIT)) {
			data = JSON.parse(Cookie.get(COOKIES.APPLICATION_FORM));
		}

		return data;
	} catch (error) {
		console.warn(error.message);
		return {};
	}
};

const getIconSpriteMap = () => {
	try {
		// eslint-disable-next-line no-undef
		if (!themeDisplay) {
			new Error('themeDisplay is not defined');
		}

		// eslint-disable-next-line no-undef
		return `${themeDisplay.getPathThemeImages()}/clay/icons.svg`;
	} catch (error) {
		console.warn(error.message);

		return require('@clayui/css/lib/images/icons/icons.svg').default;
	}
};

export const Providers = ({children}) => {
	const defaultValues = getDefaultValues();
	const form = useForm({mode: 'onChange', defaultValues});

	return (
		<AppProvider>
			<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
				<FormProvider {...form}>
					<Template>{children}</Template>
				</FormProvider>
			</ClayIconSpriteContext.Provider>
		</AppProvider>
	);
};
