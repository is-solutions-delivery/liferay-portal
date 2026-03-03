
const productIcon = document.getElementById(`product-icon-${configuration.fragmentId}`);
const productIconImg = document.querySelector(`.product-icon-img-${configuration.fragmentId}`);

productIconImg.src = productIcon.textContent;