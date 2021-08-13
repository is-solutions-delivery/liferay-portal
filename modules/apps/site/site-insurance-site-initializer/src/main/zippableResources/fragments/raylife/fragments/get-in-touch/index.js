const btnCall   = fragmentElement.querySelector("#contact-agent-btn-call");
const valueCall = fragmentElement.querySelector("#value-number-call").textContent;

btnCall.onclick = function(){
	window.location.href = 'tel:' + valueCall;
}