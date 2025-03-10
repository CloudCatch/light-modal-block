/**
 * Internal dependencies
 */
import Modal from './view/modal';

window.addEventListener( 'DOMContentLoaded', () => {
	'use strict';

	window.lightModalBlocks = new Map();

	const modals = document.querySelectorAll(
		'.wp-block-cloudcatch-light-modal-block__wrapper'
	);

	modals.forEach( ( modal ) => {
		const modalId = modal.getAttribute( 'data-modal-id' );
		const modalSelector = modal.getAttribute( 'data-trigger-selector' );
		const modalDelay = parseInt(
			modal.getAttribute( 'data-trigger-delay' )
		);
		const modalCookieDuration =
			parseInt( modal.getAttribute( 'data-cookie-duration' ) ) || 0;
		const interactionSetsCookie =
			( modal.getAttribute( 'data-cookie-interaction' ) || false ) ===
			'true';

		const options = Object.assign(
			{},
			{ openTrigger: 'data-trigger-modal' }
		);

		const triggers = [
			...document.querySelectorAll(
				`[${ options.openTrigger }="${ modalId }"]`
			),
			...document.querySelectorAll( `${ modalSelector }` ),
		];

		options.targetModal = modalId;
		options.triggers = triggers;
		options.cookieDuration = modalCookieDuration;
		options.interactionSetsCookie = interactionSetsCookie;

		window.lightModalBlocks.set( modalId, new Modal( options ) );

		if ( null !== modalDelay && ! isNaN( modalDelay ) ) {
			setTimeout(
				() => window.lightModalBlocks.get( modalId ).showModal(),
				modalDelay
			);
		}
	} );
} );
