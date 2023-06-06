/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/view/modal.ts":
/*!***************************!*\
  !*** ./src/view/modal.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Modal)
/* harmony export */ });
class Modal {
  openTrigger = 'data-trigger-modal';
  closeTrigger = 'wp-block-cloudcatch-simple-modal-block__close';
  openClass = 'is-open';
  focusableElements = 'a[href],area[href],input:not([disabled]):not([type="hidden"]):not([aria-hidden]),select:not([disabled]):not([aria-hidden]),textarea:not([disabled]):not([aria-hidden]),button:not([disabled]):not([aria-hidden]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';
  constructor(_ref) {
    let {
      targetModal,
      triggers = []
    } = _ref;
    // Save a reference of the modal
    this.modal = document.querySelector(`[data-modal-id="${targetModal}"]`);

    // Register click events only if pre binding eventListeners
    if (triggers.length > 0) this.registerTriggers(...triggers);

    // pre bind functions for event listeners
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }

  /**
   * Loops through all openTriggers and binds click event
   *
   * @param {Array} triggers [Array of node elements]
   * @return {void}
   */
  registerTriggers() {
    for (var _len = arguments.length, triggers = new Array(_len), _key = 0; _key < _len; _key++) {
      triggers[_key] = arguments[_key];
    }
    triggers.filter(Boolean).forEach(trigger => {
      trigger.addEventListener('click', event => this.showModal(event));
    });
  }
  showModal() {
    let event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    this.activeElement = document.activeElement;
    this.modal.classList.add(this.openClass);
    this.addEventListeners();
    this.setFocusToFirstNode();
  }
  closeModal() {
    let event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    const modal = this.modal;
    this.removeEventListeners();
    if (this.activeElement && this.activeElement.focus) {
      this.activeElement.focus();
    }
    modal.classList.remove(this.openClass);
  }
  closeModalById(targetModal) {
    this.modal = document.getElementById(targetModal);
    if (this.modal) this.closeModal();
  }
  addEventListeners() {
    this.modal.addEventListener('touchstart', this.onClick);
    this.modal.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKeydown);
  }
  removeEventListeners() {
    this.modal.removeEventListener('touchstart', this.onClick);
    this.modal.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKeydown);
  }
  onClick(event) {
    if (event.target.classList.contains(this.closeTrigger) || event.target.parentNode.classList.contains(this.closeTrigger) || event.target.classList.contains('wp-block-cloudcatch-simple-modal-block__wrapper')) {
      event.preventDefault();
      event.stopPropagation();
      this.closeModal(event);
    }
  }
  onKeydown(event) {
    if (event.keyCode === 27) this.closeModal(event); // esc
    if (event.keyCode === 9) this.retainFocus(event); // tab
  }

  getFocusableNodes() {
    const nodes = this.modal.querySelectorAll(this.focusableElements);
    return Array(...nodes);
  }

  /**
   * Tries to set focus on a node which is not a close trigger
   * if no other nodes exist then focuses on first close trigger
   */
  setFocusToFirstNode() {
    const focusableNodes = this.getFocusableNodes();

    // no focusable nodes
    if (focusableNodes.length === 0) return;

    // remove nodes on whose click, the modal closes
    // could not think of a better name :(
    const nodesWhichAreNotCloseTargets = focusableNodes.filter(node => {
      return !node.classList.contains(this.closeTrigger);
    });
    if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus();
    if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus();
  }
  retainFocus(event) {
    let focusableNodes = this.getFocusableNodes();

    // no focusable nodes
    if (focusableNodes.length === 0) return;

    /**
     * Filters nodes which are hidden to prevent
     * focus leak outside modal
     */
    focusableNodes = focusableNodes.filter(node => {
      return node.offsetParent !== null;
    });
    const focusedItemIndex = focusableNodes.indexOf(document.activeElement);
    if (event.shiftKey && focusedItemIndex === 0) {
      focusableNodes[focusableNodes.length - 1].focus();
      event.preventDefault();
    }
    if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
      focusableNodes[0].focus();
      event.preventDefault();
    }
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/modal */ "./src/view/modal.ts");

window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const generateTriggerMap = (triggers, triggerAttr) => {
    const triggerMap = [];
    triggers.forEach(trigger => {
      const targetModal = trigger.attributes[triggerAttr].value;
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
      triggerMap[targetModal].push(trigger);
      // trigger.removeAttribute( 'data-trigger-modal' );
    });

    return triggerMap;
  };
  const modals = document.querySelectorAll('.wp-block-cloudcatch-simple-modal-block__wrapper');
  modals.forEach(modal => {
    const modalId = modal.getAttribute('data-modal-id');
    const modalSelector = modal.getAttribute('data-trigger-selector');
    const modalDelay = parseInt(modal.getAttribute('data-trigger-delay'));
    const options = Object.assign({}, {
      openTrigger: 'data-trigger-modal'
    });
    const triggers = [...document.querySelectorAll(`[${options.openTrigger}="${modalId}"]`), ...document.querySelectorAll(`${modalSelector}`)];
    options.targetModal = modalId;
    options.triggers = triggers;
    const init = new _view_modal__WEBPACK_IMPORTED_MODULE_0__["default"](options);
    if (modalDelay) {
      setTimeout(() => init.showModal(), modalDelay);
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=view.js.map