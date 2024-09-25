=== Light Modal Block ===
Contributors:      cloudcatch, dkjensen
Tags:              block, modal, popup, lightbox, gutenberg, full-site-editing
Tested up to:      6.6.2
Stable tag:        0.0.0-development
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires PHP:      7.0
Requires at least: 6.2
Donate link:       https://www.buymeacoffee.com/dkjensen

Lightweight, customizable modal block for the WordPress block editor

== Description ==

A simple yet robust solution for creating modals within the WordPress block editor.

🚀 [View Demo](https://light-modal-block.cloudcatch.io/)

== Features ==
* Fully customizable using the native block editor style controls
* Trigger modal on click for any element via CSS selector
* Trigger modal on page load after X milliseconds
  * Set cookie to not show modal again on page load until X minutes have elapsed
* Custom modal width
* Optional close button
* API enabled
* Only 2kb gzipped
* Accessibility enabled

== Attribution ==

The Light Modal block uses a modified version of the [Micromodal](https://github.com/Ghosh/micromodal) library.

== Changelog ==

= 1.3.2 =

* Fix: Unique modal ID not generating when duplicating block

= 1.3.1 =

* Fix: When editing a pattern with a modal block, open modal by default

= 1.3.0 =

* Enhancement: Add support for drop shadows

= 1.2.1 =

* Fix: Modal blocks not showing in sidebar or advanced controls if a nested block

= 1.2.0 =

* Enhancement: Add typography style controls

= 1.1.1 =

* Fix: Block editor toolbar crash

= 1.1.0 =

* Fix: Add backdrop color control
* Enhancement: Set cookie to not display modal again until X minutes have elapsed
* Enhancement: API to programatically open and close modal

= 1.0.1 =

* Fix: Update CSS styling

= 1.0.0 =

* Initial release

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/light-modal-block` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= How can I programatically open or close a modal? =

Each modal is given a unique ID, which can be found inside the inspector controls of the block settings. It will look something like: `Mk6I8L4haJB`

To open a modal:

    window.lightModalBlocks.get('modal-id-here').showModal(true);

To close a modal:

    window.lightModalBlocks.get('modal-id-here').closeModal();

== Screenshots ==

1. Block editor modal settings
2. Show Modal block control enabled under the Advanced panel for various blocks
3. Native block styling enabled for modals
4. Custom panel reveals all modals enabled on page
5. Modal in list view
