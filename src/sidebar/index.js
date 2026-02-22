import { registerPlugin } from '@wordpress/plugins';

import ModalsPluginSidebar from './render';

registerPlugin( 'light-modal-block', { render: ModalsPluginSidebar } );
