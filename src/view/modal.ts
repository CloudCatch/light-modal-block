/**
 * External dependencies
 */
import Cookies from 'js-cookie';

declare global {
	interface Window {
		lmbFocusableElements?: string;
	}
}

export default class Modal {
	modal: HTMLElement;

	modalId: string;

	triggers: HTMLElement[];

	openTrigger: string = 'data-trigger-modal';

	closeTrigger: string = 'wp-block-cloudcatch-light-modal-block__close';

	openClass: string = 'is-open';

	cookieDuration: number = 0;

	interactionSetsCookie: boolean = false;

	activeElement: Element;

	focusableElements: string =
		'a[href],area[href],input:not([disabled]):not([type="hidden"]):not([aria-hidden]),select:not([disabled]):not([aria-hidden]),textarea:not([disabled]):not([aria-hidden]),button:not([disabled]):not([aria-hidden]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

	constructor( {
		targetModal,
		triggers = [],
		cookieDuration,
		interactionSetsCookie = false,
	} ) {
		this.modalId = targetModal;
		this.triggers = triggers;
		this.cookieDuration = cookieDuration;
		this.interactionSetsCookie = interactionSetsCookie;

		// Save a reference of the modal
		this.modal = document.querySelector(
			`[data-modal-id="${ this.modalId }"]`
		);

		// Register click events only if pre binding eventListeners
		if ( triggers.length > 0 ) {
			this.registerTriggers( ...triggers );
		}

		this.modal.removeAttribute( 'data-trigger-delay' );
		this.modal.removeAttribute( 'data-trigger-selector' );
		this.modal.removeAttribute( 'data-cookie-duration' );
		this.modal.removeAttribute( 'data-cookie-interaction' );

		// pre bind functions for event listeners
		this.onClick = this.onClick.bind( this );
		this.onKeydown = this.onKeydown.bind( this );
		this.onSubmit = this.onSubmit.bind( this );
	}

	/**
	 * Loops through all openTriggers and binds click event
	 *
	 * @param {Array} triggers [Array of node elements]
	 * @return {void}
	 */
	registerTriggers( ...triggers ) {
		triggers.filter( Boolean ).forEach( ( trigger ) => {
			trigger.addEventListener( 'click', () => this.showModal( true ) );
		} );
	}

	setCookie() {
		const exp = new Date(
			new Date().getTime() + this.cookieDuration * 60 * 1000
		);
		Cookies.set( 'wordpress_lmb_' + this.modalId, '1', {
			expires: exp,
		} );
	}

	getCookie() {
		return Cookies.get( 'wordpress_lmb_' + this.modalId );
	}

	showModal( force: boolean = false ) {
		if ( this.cookieDuration && this.getCookie() && false === force ) {
			return;
		}

		this.activeElement = document.activeElement;
		this.modal.classList.add( this.openClass );
		document.body.classList.add( 'lmb-open' );
		this.addEventListeners();
		this.setFocusToFirstNode();

		// Dispatch event when showing modal
		this.modal.dispatchEvent(new CustomEvent("light-modal-block:modal-show", {bubbles: true}));
	}

	closeModal() {
		const modal = this.modal;
		this.removeEventListeners();

		if ( this.activeElement && this.activeElement.focus ) {
			this.activeElement.focus();
		}

		modal.classList.remove( this.openClass );
		document.body.classList.remove( 'lmb-open' );

		if ( this.cookieDuration ) {
			this.setCookie();
		}

		// Dispatch event when closing modal
		this.modal.dispatchEvent(new CustomEvent("light-modal-block:modal-close", {bubbles: true}));
	}

	addEventListeners() {
		this.modal.addEventListener( 'touchstart', this.onClick );
		this.modal.addEventListener( 'click', this.onClick );
		this.modal.addEventListener( 'submit', this.onSubmit );
		document.addEventListener( 'keydown', this.onKeydown );
	}

	removeEventListeners() {
		this.modal.removeEventListener( 'touchstart', this.onClick );
		this.modal.removeEventListener( 'click', this.onClick );
		this.modal.removeEventListener( 'submit', this.onSubmit );
		document.removeEventListener( 'keydown', this.onKeydown );
	}

	onClick( event ) {
		if (
			event.target.classList.contains( this.closeTrigger ) ||
			event.target.parentNode.classList.contains( this.closeTrigger ) ||
			event.target.classList.contains(
				'wp-block-cloudcatch-light-modal-block__wrapper'
			)
		) {
			event.preventDefault();
			event.stopPropagation();
			this.closeModal();
		} else if ( this.interactionSetsCookie ) {
			if (
				event.target.tagName === 'A' ||
				event.target.tagName === 'BUTTON'
			) {
				this.setCookie();
			}
		}
	}

	onKeydown( event ) {
		if ( event.keyCode === 27 ) {
			this.closeModal();
		} // esc
		if ( event.keyCode === 9 ) {
			this.retainFocus( event );
		} // tab
	}

	onSubmit() {
		if ( this.interactionSetsCookie ) {
			this.setCookie();
		}
	}

	getFocusableNodes() {
		const focusableNodes =
			typeof window.lmbFocusableElements !== 'undefined'
				? window.lmbFocusableElements
				: this.focusableElements;

		if ( ! focusableNodes ) {
			return [];
		}

		const nodes = this.modal.querySelectorAll( focusableNodes );
		return Array.from( nodes );
	}

	/**
	 * Tries to set focus on a node which is not a close trigger
	 * if no other nodes exist then focuses on first close trigger
	 */
	setFocusToFirstNode() {
		const focusableNodes = this.getFocusableNodes();

		// no focusable nodes
		if ( focusableNodes.length === 0 ) {
			return;
		}

		// remove nodes on whose click, the modal closes
		// could not think of a better name :(
		const nodesWhichAreNotCloseTargets = focusableNodes.filter(
			( node ) => {
				return ! node.classList.contains( this.closeTrigger );
			}
		);

		if ( nodesWhichAreNotCloseTargets.length > 0 ) {
			nodesWhichAreNotCloseTargets[ 0 ].focus();
		}
		if ( nodesWhichAreNotCloseTargets.length === 0 ) {
			focusableNodes[ 0 ].focus();
		}
	}

	retainFocus( event ) {
		let focusableNodes = this.getFocusableNodes();

		// no focusable nodes
		if ( focusableNodes.length === 0 ) {
			return;
		}

		/**
		 * Filters nodes which are hidden to prevent
		 * focus leak outside modal
		 */
		focusableNodes = focusableNodes.filter( ( node ) => {
			return node.offsetParent !== null;
		} );

		const focusedItemIndex = focusableNodes.indexOf(
			document.activeElement
		);

		if ( event.shiftKey && focusedItemIndex === 0 ) {
			focusableNodes[ focusableNodes.length - 1 ].focus();
			event.preventDefault();
		}

		if (
			! event.shiftKey &&
			focusableNodes.length > 0 &&
			focusedItemIndex === focusableNodes.length - 1
		) {
			focusableNodes[ 0 ].focus();
			event.preventDefault();
		}
	}
}
