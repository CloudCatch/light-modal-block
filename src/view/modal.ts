/**
 * External dependencies
 */
import Cookies from 'js-cookie';

export default class Modal {
	modal: HTMLElement;

	modalId: string;

	openTrigger: string = 'data-trigger-modal';

	closeTrigger: string = 'wp-block-cloudcatch-light-modal-block__close';

	openClass: string = 'is-open';

	cookieDuration: number = 0;

	activeElement: Element;

	focusableElements: string =
		'a[href],area[href],input:not([disabled]):not([type="hidden"]):not([aria-hidden]),select:not([disabled]):not([aria-hidden]),textarea:not([disabled]):not([aria-hidden]),button:not([disabled]):not([aria-hidden]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

	constructor( { targetModal, triggers = [], cookieDuration } ) {
		this.modalId = targetModal;
		this.cookieDuration = cookieDuration;

		// Save a reference of the modal
		this.modal = document.querySelector(
			`[data-modal-id="${ this.modalId }"]`
		);

		// Register click events only if pre binding eventListeners
		if ( triggers.length > 0 ) this.registerTriggers( ...triggers );

		this.modal.removeAttribute( 'data-trigger-delay' );
		this.modal.removeAttribute( 'data-trigger-selector' );
		this.modal.removeAttribute( 'data-cookie-duration' );

		// pre bind functions for event listeners
		this.onClick = this.onClick.bind( this );
		this.onKeydown = this.onKeydown.bind( this );
	}

	/**
	 * Loops through all openTriggers and binds click event
	 *
	 * @param {Array} triggers [Array of node elements]
	 * @return {void}
	 */
	registerTriggers( ...triggers ) {
		triggers.filter( Boolean ).forEach( ( trigger ) => {
			trigger.addEventListener( 'click', ( event ) =>
				this.showModal( true )
			);
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
		this.addEventListeners();
		this.setFocusToFirstNode();
	}

	closeModal() {
		const modal = this.modal;
		this.removeEventListeners();

		if ( this.activeElement && this.activeElement.focus ) {
			this.activeElement.focus();
		}

		modal.classList.remove( this.openClass );

		if ( this.cookieDuration ) {
			this.setCookie();
		}
	}

	addEventListeners() {
		this.modal.addEventListener( 'touchstart', this.onClick );
		this.modal.addEventListener( 'click', this.onClick );
		document.addEventListener( 'keydown', this.onKeydown );
	}

	removeEventListeners() {
		this.modal.removeEventListener( 'touchstart', this.onClick );
		this.modal.removeEventListener( 'click', this.onClick );
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
			this.closeModal( event );
		}
	}

	onKeydown( event ) {
		if ( event.keyCode === 27 ) this.closeModal( event ); // esc
		if ( event.keyCode === 9 ) this.retainFocus( event ); // tab
	}

	getFocusableNodes() {
		const nodes = this.modal.querySelectorAll( this.focusableElements );
		return Array( ...nodes );
	}

	/**
	 * Tries to set focus on a node which is not a close trigger
	 * if no other nodes exist then focuses on first close trigger
	 */
	setFocusToFirstNode() {
		const focusableNodes = this.getFocusableNodes();

		// no focusable nodes
		if ( focusableNodes.length === 0 ) return;

		// remove nodes on whose click, the modal closes
		// could not think of a better name :(
		const nodesWhichAreNotCloseTargets = focusableNodes.filter(
			( node ) => {
				return ! node.classList.contains( this.closeTrigger );
			}
		);

		if ( nodesWhichAreNotCloseTargets.length > 0 )
			nodesWhichAreNotCloseTargets[ 0 ].focus();
		if ( nodesWhichAreNotCloseTargets.length === 0 )
			focusableNodes[ 0 ].focus();
	}

	retainFocus( event ) {
		let focusableNodes = this.getFocusableNodes();

		// no focusable nodes
		if ( focusableNodes.length === 0 ) return;

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
