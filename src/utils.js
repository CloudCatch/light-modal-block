import { customAlphabet } from 'nanoid';

import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

export const generateModalId = () => {
	const nanoid = customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		11
	);

	return nanoid();
};

export const useModals = () => {
	return useSelect( ( select ) => {
		const { getBlocksByName, getBlock } = select( blockEditorStore );
		return getBlocksByName( 'cloudcatch/light-modal-block' ).map( getBlock );
	} );
};
