import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/editor';
import { useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { edit, trash } from '@wordpress/icons';

import { modalIcon as icon } from '../icon';
import { useModals } from '../utils';

export default function PluginSidebarTest() {
	const modals = useModals();

	const { selectBlock, removeBlock } = useDispatch( blockEditorStore );

	return (
		<PluginSidebar
			name="plugin-sidebar-test"
			title={ __( 'Modals', 'light-modal-block' ) }
			icon={ icon }
		>
			<div className="plugin-sidebar-content">
				{ modals.length > 0 &&
					modals.map( ( modal, key ) => (
						<div key={ key }>
							<Card className="light-modal-block__card">
								<CardBody>
									<Heading size={ 4 }>
										{ modal.attributes.label ||
											__(
												'New Modal',
												'light-modal-block'
											) }
									</Heading>
									<div>
										<Button
											icon={ edit }
											label={ __(
												'Edit Modal',
												'light-modal-block'
											) }
											onClick={ () =>
												selectBlock( modal.clientId )
											}
										/>
										<Button
											icon={ trash }
											label={ __(
												'Remove Modal',
												'light-modal-block'
											) }
											onClick={ () =>
												removeBlock( modal.clientId )
											}
										/>
									</div>
								</CardBody>
							</Card>
						</div>
					) ) }
				{ modals.length < 1 && (
					<Card isBorderless={ true }>
						<CardBody>
							<p>
								{ __(
									'There are no modals on this page',
									'light-modal-block'
								) }
							</p>
						</CardBody>
					</Card>
				) }
			</div>
		</PluginSidebar>
	);
}
