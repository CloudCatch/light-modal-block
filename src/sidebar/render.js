import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/editor';
import { store as editorStore } from '@wordpress/edit-post';
import { useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
	__experimentalHeading as Heading,
	__experimentalVStack as VStack,
	PanelBody,
} from '@wordpress/components';
import { pencil, trash } from '@wordpress/icons';

import { modalIcon as icon } from '../icon';
import { useModals } from '../utils';

export default function ModalsPluginSidebar() {
	const modals = useModals();

	const { selectBlock, removeBlock } = useDispatch( blockEditorStore );
	const { openGeneralSidebar } = useDispatch( editorStore );

	return (
		<PluginSidebar
			name="plugin-sidebar-test"
			title={ __( 'Modals', 'light-modal-block' ) }
			icon={ icon }
		>
			<PanelBody className="plugin-sidebar-content">
				<VStack spacing={ 3 }>
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
											icon={ pencil }
											label={ __(
												'Edit Modal',
												'light-modal-block'
											) }
											onClick={ async () => {
												await selectBlock( modal.clientId );
												openGeneralSidebar( 'edit-post/block' );
											} }
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
											isDestructive
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
				</VStack>
			</PanelBody>
		</PluginSidebar>
	);
}
