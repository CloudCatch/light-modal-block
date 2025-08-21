/**
 * Internal dependencies
 */
import Modal from './view/modal.ts';
import { resolvePreferredTriggerElement } from './helpers.js';

window.addEventListener( 'DOMContentLoaded', () => {
	'use strict';

	window.lightModalBlocks = new Map();

	const modals = document.querySelectorAll(
		'.wp-block-cloudcatch-light-modal-block__wrapper'
	);

	modals.forEach( ( modal ) => {
		const modalId = modal.getAttribute( 'data-modal-id' );
		const modalSelector = modal.getAttribute( 'data-trigger-selector' );
		const modalDelay = parseInt( modal.getAttribute( 'data-trigger-delay' ) );
		const modalCookieDuration = parseInt( modal.getAttribute( 'data-cookie-duration' ) ) || 0;
		const interactionSetsCookie =
		( modal.getAttribute( 'data-cookie-interaction' ) || false ) === 'true';

		const options = Object.assign( {}, { openTrigger: 'data-trigger-modal' } );

		const containerSelectors = [
			`[${ options.openTrigger }="${ modalId }"]`,
			...( modalSelector ? [ modalSelector ] : [] ),
		];
		const containers = containerSelectors.flatMap( ( sel ) => [ ...document.querySelectorAll( sel ) ] );
		const triggers = containers.map( resolvePreferredTriggerElement );
		const uniqueTriggers = Array.from( new Set( triggers ) );

		options.targetModal = modalId;
		options.triggers = uniqueTriggers;
		options.cookieDuration = modalCookieDuration;
		options.interactionSetsCookie = interactionSetsCookie;

		window.lightModalBlocks.set( modalId, new Modal( options ) );

		if ( null !== modalDelay && ! isNaN( modalDelay ) ) {
			setTimeout( () => window.lightModalBlocks.get( modalId ).showModal(), modalDelay );
		}
	} );

	// Dispatch event when done
	document.dispatchEvent( new CustomEvent( 'light-modal-block:ready' ) );
} );
