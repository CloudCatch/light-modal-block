/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { modalIcon as icon } from './icon';

import './style.scss';

import './sidebar';
import './advanced-controls';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	icon,
} );
