import { registerPlugin } from '@wordpress/plugins';

import PluginSidebarTest from './render';

registerPlugin( 'light-modal-block', { render: PluginSidebarTest } );
