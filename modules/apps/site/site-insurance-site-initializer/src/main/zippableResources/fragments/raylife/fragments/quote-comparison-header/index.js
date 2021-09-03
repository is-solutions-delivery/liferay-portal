function getCookie(name) {
	name = name + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.indexOf(name) == 0) {
			return cookie.substring(name.length, cookie.length);;
		}
	}
}

const firstName = JSON.parse(getCookie("raylife-application-form")).basics.businessInformation.firstName;

if (firstName) {
	document.getElementById('quote-comparison-user-first-name').innerHTML = firstName;
}