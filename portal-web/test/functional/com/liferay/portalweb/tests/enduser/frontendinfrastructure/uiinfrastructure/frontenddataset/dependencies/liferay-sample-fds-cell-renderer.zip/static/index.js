import * as __WEBPACK_EXTERNAL_MODULE_react__ from "react";
import * as __WEBPACK_EXTERNAL_MODULE_react_dom_7dac9eee__ from "react-dom";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ src)
});

;// CONCATENATED MODULE: external "react"
var x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var y = x => () => x
const external_react_namespaceObject = x({ ["default"]: () => __WEBPACK_EXTERNAL_MODULE_react__["default"] });
;// CONCATENATED MODULE: external "react-dom"
var external_react_dom_x = y => { var x = {}; __webpack_require__.d(x, y); return x; }
var external_react_dom_y = x => () => x
const external_react_dom_namespaceObject = external_react_dom_x({ ["default"]: () => __WEBPACK_EXTERNAL_MODULE_react_dom_7dac9eee__["default"] });
;// CONCATENATED MODULE: ./src/index.tsx


const fdsCellRenderer = ({ value }) => {
    const element = document.createElement('div');
    const isGreen = value === 'Green';
    if (isGreen) element.classList.add ("apple");
    external_react_dom_namespaceObject["default"].render(external_react_namespaceObject["default"].createElement(external_react_namespaceObject["default"].Fragment, null, isGreen ? '🍏' : value), element);
    return element;
};
/* harmony default export */ const src = (fdsCellRenderer);

var __webpack_exports__default = __webpack_exports__.Z;
export { __webpack_exports__default as default };
