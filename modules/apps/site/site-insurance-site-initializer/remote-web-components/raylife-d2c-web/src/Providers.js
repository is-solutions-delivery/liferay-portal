import {ClayIconSpriteContext} from '@clayui/icon';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';

import {Template} from './components/Template';
import {AppProvider} from './context/AppContext';
import {STORAGE_KEYS, Storage} from './services/liferay/storage';

const getDefaultValues = () => {
	try {
		let data = '';

		if (Storage.itemExist(STORAGE_KEYS.BACK_TO_EDIT)) {
			data = JSON.parse(Storage.getItem(STORAGE_KEYS.APPLICATION_FORM));
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
