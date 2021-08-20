const nameCookie 	= "raylife-application-id";
const btnBack       = fragmentElement.querySelector("#contact-agent-btn-back");
const btnCall       = fragmentElement.querySelector("#contact-agent-btn-call");
const valueCall     = fragmentElement.querySelector("#value-number-call").textContent;

btnBack.onclick = function(){
	window.history.back();
}

btnCall.onclick = function(){
	window.location.href = 'tel:' + valueCall;
}

function getCookie(name) {
	name = name + '=';
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookies = decodedCookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i].trim();
		if (cookie.indexOf(name) == 0) {
		return cookie.substring(name.length, cookie.length);
		}
	}
}

if(getCookie(nameCookie) != undefined && getCookie(nameCookie) != "" )
{
	document.getElementById("content-agent-text-your-application").textContent = "Your Application #"+getCookie(nameCookie);
}
