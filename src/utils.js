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
		const data = [];
		const blocks = select( blockEditorStore ).getBlocks();

		const searchNestedBlocks = ( block ) => {
			if ( block?.innerBlocks ) {
				block.innerBlocks.forEach( ( innerBlock ) => {
					if ( innerBlock.name === 'cloudcatch/light-modal-block' ) {
						data.push( innerBlock );
					}

					searchNestedBlocks( innerBlock );
				} );
			}
		};

		blocks.forEach( ( block ) => {
			if ( block.name === 'cloudcatch/light-modal-block' ) {
				data.push( block );
			}

			searchNestedBlocks( block );
		} );

		return data;
	} );
};
