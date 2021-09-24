function handleClick() {
  var cards = fragmentElement.getElementsByClassName("card");
  Array.prototype.forEach.call(cards, (card) => card.classList.toggle("active"));
}


var button =fragmentElement.getElementsByClassName("btn-sla")[0];
button.addEventListener("click", () => handleClick());