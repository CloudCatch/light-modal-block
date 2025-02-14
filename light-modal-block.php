<?php
/**
 * Plugin Name:       Light Modal Block
 * Description:       Lightweight, customizable modal block for the WordPress block editor
 * Requires at least: 6.2
 * Requires PHP:      7.0
 * Version:           0.0.0-development
 * Author:            CloudCatch LLC
 * Author URI:        https://cloudcatch.io
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       light-modal-block
 *
 * @package           CloudCatch\LightModalBlock
 */

/**
 * Register the block.
 *
 * @return void
 */
function cloudcatch_light_modal_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'cloudcatch_light_modal_block_block_init' );

/**
 * Modifies the post template block, filtering the modal ID to include the current query ID and post ID.
 *
 * @param string   $block_content The block content.
 * @param array    $block The block.
 * @param WP_Block $instance The block instance.
 * @return string The rendered block.
 */
function cloudcatch_light_modal_block_post_template( $block_content, $block, $instance ) {
	$query_id = (int) ( $instance->context['queryId'] ?? 1 );

	$tags = new WP_HTML_Tag_Processor( $block_content );

	$current_post_id = null;

	while ( $tags->next_tag() ) {

		if ( $tags->has_class( 'wp-block-post' ) ) {
			$matches = null;

			$post_class = $tags->get_attribute( 'class' );

			preg_match( '/post-(\d+)/', $post_class, $matches );

			if ( isset( $matches[1] ) ) {
				$current_post_id = (int) $matches[1];
			}

			if ( ! $current_post_id ) {
				continue;
			}
		}

		if ( $current_post_id ) {
			if ( $tags->get_attribute( 'data-trigger-modal' ) ) {
				$modal_id = $tags->get_attribute( 'data-trigger-modal' );

				$tags->set_attribute( 'data-trigger-modal', $modal_id . '-q' . $query_id . '-p' . $current_post_id );
			}

			if ( $tags->get_attribute( 'data-modal-id' ) ) {
				$modal_id = $tags->get_attribute( 'data-modal-id' );

				$tags->set_attribute( 'data-modal-id', $modal_id . '-q' . $query_id . '-p' . $current_post_id );
			}
		}
	}

	$block_content = $tags->get_updated_html();

	return $block_content;
}
add_filter( 'render_block_core/post-template', 'cloudcatch_light_modal_block_post_template', 10, 3 );
