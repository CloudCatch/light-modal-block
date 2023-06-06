export default class Modal {
	modal: HTMLElement;

	openTrigger: string = 'data-trigger-modal';

	closeTrigger: string = 'wp-block-cloudcatch-simple-modal-block__close';

	openClass: string = 'is-open';

	activeElement: Element;

	focusableElements: string =
		'a[href],area[href],input:not([disabled]):not([type="hidden"]):not([aria-hidden]),select:not([disabled]):not([aria-hidden]),textarea:not([disabled]):not([aria-hidden]),button:not([disabled]):not([aria-hidden]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

	constructor( { targetModal, triggers = [] } ) {
		// Save a reference of the modal
		this.modal = document.querySelector(
			`[data-modal-id="${ targetModal }"]`
		);

		// Register click events only if pre binding eventListeners
		if ( triggers.length > 0 ) this.registerTriggers( ...triggers );

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
				this.showModal( event )
			);
		} );
	}

	showModal( event = null ) {
		this.activeElement = document.activeElement;
		this.modal.classList.add( this.openClass );
		this.addEventListeners();
		this.setFocusToFirstNode();
	}

	closeModal( event = null ) {
		const modal = this.modal;
		this.removeEventListeners();

		if ( this.activeElement && this.activeElement.focus ) {
			this.activeElement.focus();
		}

		modal.classList.remove( this.openClass );
	}

	closeModalById( targetModal ) {
		this.modal = document.getElementById( targetModal );
		if ( this.modal ) this.closeModal();
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
				'wp-block-cloudcatch-simple-modal-block__wrapper'
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
