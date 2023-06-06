import { registerPlugin } from '@wordpress/plugins';

import PluginSidebarTest from './render';

registerPlugin( 'simple-modal-block', { render: PluginSidebarTest } );
