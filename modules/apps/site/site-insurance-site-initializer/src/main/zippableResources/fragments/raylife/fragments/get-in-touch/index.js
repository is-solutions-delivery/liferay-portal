const btnBack   = fragmentElement.querySelector("#contact-agent-btn-back");
const btnCall   = fragmentElement.querySelector("#contact-agent-btn-call");
const valueCall = fragmentElement.querySelector("#value-number-call").textContent;

btnBack.onclick = function(){
	window.history.back();
}

btnCall.onclick = function(){
	window.location.href = 'tel:' + valueCall;
}