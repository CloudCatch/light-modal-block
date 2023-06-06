<?php
/**
 * Plugin Name:       Simple Modal Block
 * Description:       Lightweight, customizable modal block for the WordPress block editor
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.0.0-development
 * Author:            CloudCatch LLC
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       simple-modal-block
 *
 * @package           cloudcatch
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function cloudcatch_simple_modal_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'cloudcatch_simple_modal_block_block_init' );
