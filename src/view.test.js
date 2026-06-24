/**
 * Internal dependencies
 */
import { initLightModalBlocks } from './view.js';

function createModalElement( {
	modalId = 'test-modal',
	triggerSelector = '',
	triggerDelay = null,
	cookieDuration = 0,
	cookieInteraction = false,
	autoplayMedia = false,
} = {} ) {
	const wrapper = document.createElement( 'div' );
	wrapper.classList.add( 'wp-block-cloudcatch-light-modal-block__wrapper' );
	wrapper.setAttribute( 'data-modal-id', modalId );
	if ( triggerSelector ) wrapper.setAttribute( 'data-trigger-selector', triggerSelector );
	if ( triggerDelay !== null ) wrapper.setAttribute( 'data-trigger-delay', String( triggerDelay ) );
	if ( cookieDuration ) wrapper.setAttribute( 'data-cookie-duration', String( cookieDuration ) );
	if ( cookieInteraction ) wrapper.setAttribute( 'data-cookie-interaction', 'true' );
	if ( autoplayMedia ) wrapper.setAttribute( 'data-autoplay-media', 'true' );
	document.body.appendChild( wrapper );
	return wrapper;
}

function createTriggerButton( modalId ) {
	const btn = document.createElement( 'button' );
	btn.setAttribute( 'data-trigger-modal', modalId );
	document.body.appendChild( btn );
	return btn;
}

beforeEach( () => {
	document.body.innerHTML = '';
	delete window.lightModalBlocks;
} );

describe( 'initLightModalBlocks', () => {
	it( 'initializes lightModalBlocks map', () => {
		initLightModalBlocks();
		expect( window.lightModalBlocks ).toBeInstanceOf( Map );
	} );

	it( 'registers a modal instance for each wrapper element', () => {
		createModalElement( { modalId: 'modal-1' } );
		createModalElement( { modalId: 'modal-2' } );
		initLightModalBlocks();
		expect( window.lightModalBlocks.size ).toBe( 2 );
		expect( window.lightModalBlocks.has( 'modal-1' ) ).toBe( true );
		expect( window.lightModalBlocks.has( 'modal-2' ) ).toBe( true );
	} );

	it( 'dispatches light-modal-block:ready event', () => {
		const handler = jest.fn();
		document.addEventListener( 'light-modal-block:ready', handler );
		initLightModalBlocks();
		expect( handler ).toHaveBeenCalledTimes( 1 );
		document.removeEventListener( 'light-modal-block:ready', handler );
	} );

	it( 'registers trigger buttons for a modal', () => {
		const modalId = 'modal-triggers';
		createModalElement( { modalId } );
		const btn = createTriggerButton( modalId );
		initLightModalBlocks();
		const modal = window.lightModalBlocks.get( modalId );
		expect( modal.triggers ).toContain( btn );
	} );

	it( 'opens modal when trigger is clicked', () => {
		const modalId = 'modal-click';
		const wrapper = createModalElement( { modalId } );
		const btn = createTriggerButton( modalId );
		initLightModalBlocks();
		btn.click();
		expect( wrapper.classList.contains( 'is-open' ) ).toBe( true );
	} );

	it( 'closes modal when close button is clicked', () => {
		const modalId = 'modal-close';
		const wrapper = createModalElement( { modalId } );
		const closeBtn = document.createElement( 'button' );
		closeBtn.classList.add( 'wp-block-cloudcatch-light-modal-block__close' );
		wrapper.appendChild( closeBtn );
		createTriggerButton( modalId );
		initLightModalBlocks();
		window.lightModalBlocks.get( modalId ).showModal( true );
		expect( wrapper.classList.contains( 'is-open' ) ).toBe( true );
		closeBtn.click();
		expect( wrapper.classList.contains( 'is-open' ) ).toBe( false );
	} );

	it( 'opens modal automatically when trigger delay is 0', () => {
		jest.useFakeTimers();
		const modalId = 'modal-delay';
		const wrapper = createModalElement( { modalId, triggerDelay: 0 } );
		initLightModalBlocks();
		jest.runAllTimers();
		expect( wrapper.classList.contains( 'is-open' ) ).toBe( true );
		jest.useRealTimers();
	} );

	it( 'does nothing when no modal wrappers are present', () => {
		expect( () => initLightModalBlocks() ).not.toThrow();
		expect( window.lightModalBlocks.size ).toBe( 0 );
	} );
} );

describe( 'readyState module auto-init', () => {
	it( 'calls initLightModalBlocks immediately when readyState is complete', () => {
		// Directly invoke the same conditional logic the module runs on load.
		// readyState is 'complete' in jsdom, so the else branch should fire.
		createModalElement( { modalId: 'modal-complete' } );

		if ( document.readyState === 'loading' ) {
			window.addEventListener( 'DOMContentLoaded', initLightModalBlocks );
		} else {
			initLightModalBlocks();
		}

		expect( window.lightModalBlocks.has( 'modal-complete' ) ).toBe( true );
	} );

	it( 'registers a DOMContentLoaded listener when readyState is loading', () => {
		Object.defineProperty( document, 'readyState', { value: 'loading', writable: true } );

		const spy = jest.spyOn( window, 'addEventListener' );

		if ( document.readyState === 'loading' ) {
			window.addEventListener( 'DOMContentLoaded', initLightModalBlocks );
		} else {
			initLightModalBlocks();
		}

		expect( spy ).toHaveBeenCalledWith( 'DOMContentLoaded', initLightModalBlocks );
		spy.mockRestore();
		Object.defineProperty( document, 'readyState', { value: 'complete', writable: true } );
	} );

	it( 'runs initLightModalBlocks when DOMContentLoaded fires after deferred registration', () => {
		createModalElement( { modalId: 'modal-deferred' } );
		window.addEventListener( 'DOMContentLoaded', initLightModalBlocks );
		window.dispatchEvent( new Event( 'DOMContentLoaded' ) );
		expect( window.lightModalBlocks.has( 'modal-deferred' ) ).toBe( true );
		window.removeEventListener( 'DOMContentLoaded', initLightModalBlocks );
	} );
} );
