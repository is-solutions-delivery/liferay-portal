const defaultColor = configuration.textColor;
const h1Element = fragmentElement.querySelector("h1");
const h5Elements = fragmentElement.querySelectorAll("h5");

h1Element.style.color = defaultColor;
h5Elements.forEach(h5Element => h5Element.style.color = defaultColor)