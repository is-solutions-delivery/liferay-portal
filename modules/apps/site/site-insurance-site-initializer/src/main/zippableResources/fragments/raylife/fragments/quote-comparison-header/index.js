function getCookie(name) {
	name = name + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		
		if (cookie.indexOf(name) == 0) {
			let cookieObject = cookie.substring(name.length, cookie.length);
			let firstName = JSON.parse(cookieObject).basics.businessInformation.firstName;
		
			return firstName;
		}
	}
}

const firstName = getCookie("raylife-application-form");

if (firstName) {
	document.getElementById('quote-comparison-user-first-name').innerHTML = firstName;
}