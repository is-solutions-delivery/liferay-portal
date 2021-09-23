import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';

import {Template} from '~/shared/components/Template';
import {AppProvider} from '~/apps/get-a-quote/context/AppContext';
import {STORAGE_KEYS, Storage} from '~/shared/services/liferay/storage';
import ClayIconProvider from '~/shared/context/ClayIconProvider';

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

export const Providers = ({children}) => {
	const defaultValues = getDefaultValues();
	const form = useForm({mode: 'onChange', defaultValues});

	return (
		<AppProvider>
			<ClayIconProvider>
				<FormProvider {...form}>
					<Template>{children}</Template>
				</FormProvider>
			</ClayIconProvider>
		</AppProvider>
	);
};
