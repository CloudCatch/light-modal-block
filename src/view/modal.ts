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

	private triggeringDebounce: boolean = false;

	openClass: string = 'is-open';

	cookieDuration: number = 0;

	interactionSetsCookie: boolean = false;

	autoplayMedia: boolean = false;

	activeElement: Element;

	focusableElements: string =
		'a[href],area[href],input:not([disabled]):not([type="hidden"]):not([aria-hidden]),select:not([disabled]):not([aria-hidden]),textarea:not([disabled]):not([aria-hidden]),button:not([disabled]):not([aria-hidden]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';

	constructor( {
		targetModal,
		triggers = [],
		cookieDuration,
		interactionSetsCookie = false,
		autoplayMedia = false,
	} ) {
		this.modalId = targetModal;
		this.triggers = triggers;
		this.cookieDuration = cookieDuration;
		this.interactionSetsCookie = interactionSetsCookie;
		this.autoplayMedia = autoplayMedia;

		// Save a reference of the modal
		this.modal = document.querySelector( `[data-modal-id="${ this.modalId }"]` );

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

		// Prepare YouTube iframes for API control
		this.prepareYouTubeIframes();
	}

	/**
	 * Loops through all openTriggers and binds click event
	 *
	 * @param {Array} triggers [Array of node elements]
	 * @return {void}
	 */
	registerTriggers( ...triggers ) {
		triggers.filter( Boolean ).forEach( ( trigger ) => {
			const debouncedShow = () => {
				if ( this.triggeringDebounce ) {
					return;
				}

				this.triggeringDebounce = true;

				this.showModal( true );

				setTimeout( () => {
					this.triggeringDebounce = false;
				}, 100 );
			};

			trigger.addEventListener( 'click', debouncedShow );

			trigger.addEventListener( 'keydown', ( event ) => {
				if ( event.keyCode === 13 || event.keyCode === 32 ) {
					event.preventDefault();
					debouncedShow();
				}
			} );
		} );
	}

	setCookie() {
		const exp = new Date(
			new Date().getTime() + ( this.cookieDuration * 60 * 1000 ),
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

		this.activeElement = this.modal.ownerDocument.activeElement;
		this.modal.classList.add( this.openClass );
		document.body.classList.add( 'lmb-open' );
		this.addEventListeners();
		this.setFocusToFirstNode();

		// Autoplay media if enabled
		if ( this.autoplayMedia ) {
			// Small delay to ensure iframes are ready
			setTimeout( () => {
				this.playVideos();
			}, 100 );
		}

		// Dispatch event when showing modal
		this.modal.dispatchEvent(
			new CustomEvent( 'light-modal-block:modal-show', { bubbles: true } ),
		);
	}

	closeModal() {
		const modal = this.modal;
		this.removeEventListeners();

		if ( this.activeElement && this.activeElement.focus ) {
			this.activeElement.focus();
		}

		modal.classList.remove( this.openClass );
		document.body.classList.remove( 'lmb-open' );

		// Pause all videos when modal closes
		this.pauseVideos();

		if ( this.cookieDuration ) {
			this.setCookie();
		}

		// Dispatch event when closing modal
		this.modal.dispatchEvent(
			new CustomEvent( 'light-modal-block:modal-close', {
				bubbles: true,
			} ),
		);
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
				'wp-block-cloudcatch-light-modal-block__wrapper',
			)
		) {
			event.preventDefault();
			event.stopPropagation();
			this.closeModal();
		} else if ( this.interactionSetsCookie ) {
			if ( event.target.tagName === 'A' || event.target.tagName === 'BUTTON' ) {
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
		const nodesWhichAreNotCloseTargets = focusableNodes.filter( ( node ) => {
			return ! node.classList.contains( this.closeTrigger );
		} );

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

		const focusedItemIndex = focusableNodes.indexOf( this.modal.ownerDocument.activeElement );

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

	/**
	 * Pauses all videos in the modal
	 * Handles HTML5 video elements and iframe embeds (YouTube, Vimeo, etc.)
	 */
	pauseVideos() {
		// Pause HTML5 video elements
		const videoElements = this.modal.querySelectorAll( 'video' );
		videoElements.forEach( ( video: HTMLVideoElement ) => {
			if ( ! video.paused ) {
				video.pause();
			}
		} );

		// Pause HTML5 audio elements
		const audioElements = this.modal.querySelectorAll( 'audio' );
		audioElements.forEach( ( audio: HTMLAudioElement ) => {
			if ( ! audio.paused ) {
				audio.pause();
			}
		} );

		// Pause iframe embeds (YouTube, Vimeo, etc.)
		const iframes = this.modal.querySelectorAll( 'iframe' );
		iframes.forEach( ( iframe: HTMLIFrameElement ) => {
			const src = iframe.src;

			// YouTube iframes
			if ( src.includes( 'youtube.com' ) || src.includes( 'youtu.be' ) ) {
				// Enable API if not already enabled
				if ( ! src.includes( 'enablejsapi=1' ) ) {
					const separator = src.includes( '?' ) ? '&' : '?';
					iframe.src = src + separator + 'enablejsapi=1';
				}

				// Send pause command
				iframe.contentWindow?.postMessage(
					'{"event":"command","func":"pauseVideo","args":""}',
					'*'
				);
			}

			// Vimeo iframes
			if ( src.includes( 'vimeo.com' ) ) {
				iframe.contentWindow?.postMessage(
					'{"method":"pause"}',
					'*'
				);
			}

			// For other embeds, stop by reloading the iframe
			if ( ! src.includes( 'youtube.com' ) &&
				! src.includes( 'youtu.be' ) &&
				! src.includes( 'vimeo.com' ) ) {
				const currentSrc = iframe.src;
				iframe.src = '';
				iframe.src = currentSrc;
			}
		} );
	}

	/**
	 * Prepares YouTube iframes for API control
	 * Must be called before trying to control playback
	 */
	prepareYouTubeIframes() {
		const iframes = this.modal.querySelectorAll( 'iframe' );
		iframes.forEach( ( iframe: HTMLIFrameElement ) => {
			const src = iframe.src;

			if ( src && ( src.includes( 'youtube.com' ) || src.includes( 'youtu.be' ) ) ) {
				if ( ! src.includes( 'enablejsapi=1' ) ) {
					const separator = src.includes( '?' ) ? '&' : '?';
					iframe.src = src + separator + 'enablejsapi=1';
				}
			}
		} );
	}

	/**
	 * Plays all videos in the modal
	 * Handles HTML5 video elements and iframe embeds (YouTube, Vimeo, etc.)
	 */
	playVideos() {
		// Play HTML5 video elements
		const videoElements = this.modal.querySelectorAll( 'video' );
		videoElements.forEach( ( video: HTMLVideoElement ) => {
			video.play().catch( () => {
				// Autoplay was prevented, ignore the error
			} );
		} );

		// Play HTML5 audio elements
		const audioElements = this.modal.querySelectorAll( 'audio' );
		audioElements.forEach( ( audio: HTMLAudioElement ) => {
			audio.play().catch( () => {
				// Autoplay was prevented, ignore the error
			} );
		} );

		// Play iframe embeds (YouTube, Vimeo, etc.)
		const iframes = this.modal.querySelectorAll( 'iframe' );
		iframes.forEach( ( iframe: HTMLIFrameElement ) => {
			const src = iframe.src;

			// YouTube iframes
			if ( src.includes( 'youtube.com' ) || src.includes( 'youtu.be' ) ) {
				// Mute first to allow autoplay
				iframe.contentWindow?.postMessage(
					'{"event":"command","func":"mute","args":""}',
					'*'
				);

				// Play the video
				iframe.contentWindow?.postMessage(
					'{"event":"command","func":"playVideo","args":""}',
					'*'
				);

				// Unmute after a short delay to ensure playback has started
				setTimeout( () => {
					iframe.contentWindow?.postMessage(
						'{"event":"command","func":"unMute","args":""}',
						'*'
					);
				}, 500 );
			}

			// Vimeo iframes
			if ( src.includes( 'vimeo.com' ) ) {
				iframe.contentWindow?.postMessage(
					'{"method":"play"}',
					'*'
				);
			}
		} );
	}
}
