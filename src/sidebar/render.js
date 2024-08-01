import { __ } from '@wordpress/i18n';
import { PluginSidebar } from '@wordpress/editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
	Button,
	Card,
	CardBody,
	__experimentalHeading as Heading,
} from '@wordpress/components';
import { edit, search, trash } from '@wordpress/icons';

import { modalIcon as icon } from '../icon';

export default function PluginSidebarTest() {
	const modals = useSelect( ( select ) => {
		const data = [];
		const blocks = select( blockEditorStore ).getBlocks();

		const searchNestedBlocks = ( block ) => {
			if ( block?.innerBlocks ) {
				block.innerBlocks.forEach( ( innerBlock ) => {
					if ( innerBlock.name === 'cloudcatch/light-modal-block' ) {
						data.push( innerBlock );
					}

					searchNestedBlocks( innerBlock );
				} );
			}
		};

		blocks.forEach( ( block ) => {
			if ( block.name === 'cloudcatch/light-modal-block' ) {
				data.push( block );
			}

			searchNestedBlocks( block );
		} );

		return data;
	} );

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
