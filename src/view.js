import Modal from './view/modal';

window.addEventListener( 'DOMContentLoaded', () => {
	'use strict';

	const generateTriggerMap = ( triggers, triggerAttr ) => {
		const triggerMap = [];

		triggers.forEach( ( trigger ) => {
			const targetModal = trigger.attributes[ triggerAttr ].value;
			if ( triggerMap[ targetModal ] === undefined )
				triggerMap[ targetModal ] = [];
			triggerMap[ targetModal ].push( trigger );
			// trigger.removeAttribute( 'data-trigger-modal' );
		} );

		return triggerMap;
	};

	const modals = document.querySelectorAll(
		'.wp-block-cloudcatch-simple-modal-block__wrapper'
	);

	modals.forEach( ( modal ) => {
		const modalId = modal.getAttribute( 'data-modal-id' );
		const modalSelector = modal.getAttribute( 'data-trigger-selector' );
		const modalDelay = parseInt(
			modal.getAttribute( 'data-trigger-delay' )
		);

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

		const init = new Modal( options );

		if ( modalDelay ) {
			setTimeout( () => init.showModal(), modalDelay );
		}
	} );
} );
