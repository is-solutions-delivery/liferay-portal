import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {ClayIconSpriteContext} from '@clayui/icon';

import {AppProvider} from './context/AppContext';
import {Template} from './components/Template';

const getIconSpriteMap = () => {
	try {
		// eslint-disable-next-line no-undef
		if (!themeDisplay) new Error('themeDisplay is not defined');
		// eslint-disable-next-line no-undef
		return `${themeDisplay.getPathThemeImages()}/clay/icons.svg`;
	} catch (err) {
		console.warn(err.message);
		return require('@clayui/css/lib/images/icons/icons.svg').default;
	}
};

export const Providers = ({children}) => {
	const form = useForm({mode: 'onChange'});

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
