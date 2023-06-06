import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { edit, trash } from '@wordpress/icons';

import { ModalIcon } from '../icon';

export default function PluginSidebarTest() {
	const modals = useSelect( ( select ) => {
		return select( blockEditorStore )
			.getBlocks()
			.filter(
				( block ) => block.name === 'cloudcatch/simple-modal-block'
			);
	} );

	const { selectBlock, removeBlock } = useDispatch( blockEditorStore );

	return (
		<PluginSidebar
			name="plugin-sidebar-test"
			title={ __( 'Modals', 'simple-modal-block' ) }
			icon={ ModalIcon }
		>
			<div className="plugin-sidebar-content">
				{ modals.length > 0 &&
					modals.map( ( modal, key ) => (
						<div key={ key }>
							<Card className="simple-modal-block__card">
								<CardBody>
									<Heading size={ 4 }>
										{ modal.attributes.label ||
											__(
												'New Modal',
												'simple-modal-block'
											) }
									</Heading>
									<div>
										<Button
											icon={ edit }
											label={ __(
												'Edit Modal',
												'simple-modal-block'
											) }
											onClick={ () =>
												selectBlock( modal.clientId )
											}
										/>
										<Button
											icon={ trash }
											label={ __(
												'Remove Modal',
												'simple-modal-block'
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
									'simple-modal-block'
								) }
							</p>
						</CardBody>
					</Card>
				) }
			</div>
		</PluginSidebar>
	);
}
