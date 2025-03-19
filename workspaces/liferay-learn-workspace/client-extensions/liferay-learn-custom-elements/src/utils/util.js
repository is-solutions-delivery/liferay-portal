/* eslint-disable default-case */

/* global Liferay */

export const convertMinutesToDuration = (minutes, format = 'hours') => {
	const totalSeconds = Math.floor(minutes * 60);
	const hours =
		format === 'hours'
			? (Math.round(minutes / 30) / 2).toFixed(1)
			: Math.floor(minutes / 60);
	const mins = Math.floor(minutes % 60);
	const seconds = totalSeconds % 60;
	const fractionalHours = `${String(Math.floor(minutes / 60)).padStart(
		2,
		'0'
	)}:${String(minutes % 60).padStart(2, '0')} hours`;

	switch (format === 'hours') {
		case minutes < 15:
			return (minutes = `0.5 hour`);
		case minutes >= 45 && minutes <= 75:
			return (minutes = `1.0 hour`);
	}

	switch (format) {
		case 'hours':
			return `${hours} hours`;
		case 'hours:minutes':
			return `${fractionalHours}`;
		case 'hours:minutes:seconds':
			return `${String(hours).padStart(2, '0')}:${String(mins).padStart(
				2,
				'0'
			)}:${String(seconds).padStart(2, '0')}`;
		default:
			return `${fractionalHours}`;
	}
};

export const deleteLessonNavigationCookies = () => {
	const regex = /^lesson_\d+_(previous|next)$/;

	const cookies = document.cookie.split(';');

	cookies.forEach((cookie) => {
		const cookieName = cookie.split('=')[0].trim();

		if (regex.test(cookieName)) {
			document.cookie =
				cookieName +
				'=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		}
	});
};

export const extractYearAndMonth = (dateString) => {
	const [year, month] = dateString.split('T')[0].split('-');
	return {
		year,
		month,
	};
};

export const fetchLiferayAsJSON = async (url) => {
	const response = await Liferay.Util.fetch(url);

	const json = await response.json();

	return json;
};

export const formatDate = (dateString) => {
	const date = new Date(dateString);

	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).format(date);
};

export const getAdminPanelUrl = () => {
	let url = Liferay.ThemeDisplay.getLayoutRelativeControlPanelURL();

	if (url.indexOf('?') > -1) {
		return url.split('?')[0];
	}
	else {
		return Liferay.ThemeDisplay.getLayoutRelativeControlPanelURL();
	}
};

export const getChildByAttribute = (element, attribute, value) => {
	return element.querySelector(`[${attribute}="${value}"]`);
};

export const getCourseFirstLessonId = async (courseId) => {
	const data = await fetchLiferayAsJSON(
		`/o/c/modules/scopes/${getCurrentSiteId()}?filter=r_module_c_courseId%20eq%20%27${courseId}%27%20and%20position%20eq%200&nestedFields=lesson`
	);

	return data.items[0].lesson[0].id;
};

export const getCreateAccountPath = () => {
	return `${Liferay.ThemeDisplay.getPathMain()}/signin/register`;
};

export const getCurrentLanguage = () => {
	return Liferay.ThemeDisplay.getLanguageId();
};

export const getCurrentLanguageKey = () => {
	const [languageKey] = Liferay.ThemeDisplay.getLanguageId().split('_');

	return languageKey;
};

export const getCurrentSiteId = () => {
	return Liferay.ThemeDisplay.getScopeGroupId();
};

export const getCurrentUserId = () => {
	return Liferay.ThemeDisplay.getUserId();
};

export const getDPTAssetId = () => {
	if (window.location.pathname.indexOf('/l/') > -1) {
		let path = window.location.pathname.substring(
			window.location.pathname.indexOf('/l/')
		);

		const regex = /\/l\/(\d+)$/;

		const match = path.match(regex);

		if (match) {
			return match[1];
		}

		return null;
	}
	else {
		return null;
	}
};

export const getNextLessonLocalStorage = (assetId) => {
	const nextLessonLocalStorage = JSON.parse(
		localStorage.getItem(`lesson_${assetId}_next`)
	);

	return nextLessonLocalStorage;
};

export const getPersonas = (personaArray) => {
	let persona = '';

	if (personaArray) {
		persona = personaArray[0].name;

		if (personaArray.length > 1) {
			persona += ', +' + (personaArray.length - 1);
		}
	}
	return persona;
};

export const getPreviousLessonLocalStorage = (assetId) => {
	const previousLessonLocalStorage = JSON.parse(
		localStorage.getItem(`lesson_${assetId}_previous`)
	);

	return previousLessonLocalStorage;
};

export const getPersonaStringList = (personaArray) => {
	return personaArray
		.map((persona) => persona.name)
		.sort()
		.join(', ');
};

export const getShortText = (text, characterLimit = 150) => {
	if (text.length > characterLimit) {
		const lastSpaceIndex = text
			.substring(0, characterLimit)
			.lastIndexOf(' ');
		text = text.substring(0, lastSpaceIndex) + '...';
	}
	return text;
};

export const getSignInPath = () => {
	return `${Liferay.ThemeDisplay.getPathMain()}/login`;
};

export const getTooltipPersona = (personaArray) => {
	let persona = '';

	personaArray.forEach((personas) => {
		persona += personas.name + ', ';
	});

	return persona.slice(0, -2);
};

export const isSignedIn = () => {
	return Liferay.ThemeDisplay.isSignedIn();
};

export const loadStyle = (styleRef) => {
	return new Promise((resolve, reject) => {
		fetch(styleRef)
			.then((response) => response.text())
			.then((cssText) => {
				resolve(cssText + '\n');
			})
			.catch((error) => console.error('Error fetching CSS:', error));
	});
};

export const NotifyComponent = (componentId, key, value) => {
	const modulesListComponent = document.querySelector(componentId);
	modulesListComponent.setAttribute(key, value);
};

export const showError = (title, message) => {
	Liferay.Util.openToast({message, title, type: 'danger'});
};

export const showSuccess = (
	title,
	message = 'The request has been successfully completed.'
) => {
	Liferay.Util.openToast({message, title, type: 'success'});
};

export const splitStringtoArray = (str, delimiter = ',') =>
	str.split(delimiter).map(Number);
