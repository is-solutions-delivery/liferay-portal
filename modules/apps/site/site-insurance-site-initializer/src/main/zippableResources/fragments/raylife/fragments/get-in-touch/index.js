let   applicationId = "";
let   auxCookie     = "";
const decodedCookie = decodeURIComponent(document.cookie);
const infoCookie 	= decodedCookie.split(';');
const nameCookie 	= "raylife-application-id=";
const btnBack       = fragmentElement.querySelector("#contact-agent-btn-back");
const btnCall       = fragmentElement.querySelector("#contact-agent-btn-call");
const valueCall     = fragmentElement.querySelector("#value-number-call").textContent;

btnBack.onclick = function(){
	window.history.back();
}

btnCall.onclick = function(){
	window.location.href = 'tel:' + valueCall;
}

for(let i = 0; i < infoCookie.length; i++) {
	auxCookie = infoCookie[i];
	while (auxCookie.charAt(0) == ' ') {
		auxCookie = auxCookie.substring(1);
	}
	if (auxCookie.indexOf(nameCookie) == 0) {
		applicationId = auxCookie.substring(nameCookie.length, auxCookie.length);
		document.getElementById("content-agent-text-your-application").textContent = "Your Application #"+applicationId;
	}
}