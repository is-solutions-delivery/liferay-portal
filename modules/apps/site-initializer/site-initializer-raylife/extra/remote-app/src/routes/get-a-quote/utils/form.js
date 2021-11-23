export const hasEmail = (form) => {
	const {
		basics: {
			businessInformation: {
				business: {email},
			},
		},
	} = form;

	return email !== '' ? true : false;
};
