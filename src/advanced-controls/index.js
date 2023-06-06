import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useSelect, useDispatch } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	InspectorAdvancedControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	BaseControl,
	ToggleControl,
	SelectControl,
	Button,
} from '@wordpress/components';

const addAttributes = ( settings, name ) => {
	settings.attributes = {
		...settings.attributes,
		modalTriggerEnabled: {
			type: 'boolean',
			default: false,
		},
		modalEnabled: {
			type: 'string',
		},
	};

	return settings;
};

const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		const modals = useSelect( ( select ) => {
			return select( blockEditorStore )
				.getBlocks()
				.filter(
					( block ) => block.name === 'cloudcatch/simple-modal-block'
				);
		} );

		const selectedModal = modals.filter(
			( block ) => attributes?.modalEnabled === block?.attributes?.id
		)[ 0 ];

		const { selectBlock } = useDispatch( blockEditorStore );

		const modalOptions = [
			{ label: __( 'Select Modal', 'simple-modal-block' ), value: '' },
			...modals.map( ( modal ) => {
				return {
					label:
						modal?.attributes?.label ||
						__( 'New Modal', 'simple-modal-block' ),
					value: modal?.attributes?.id,
					// value: modal?.clientId,
				};
			} ),
		];

		return (
			<>
				<BlockEdit { ...props } />
				{ name !== 'cloudcatch/simple-modal-block' && (
					<InspectorAdvancedControls>
						<BaseControl>
							<ToggleControl
								label={ __(
									'Show Modal on Click',
									'simple-modal-block'
								) }
								checked={
									attributes?.modalTriggerEnabled || false
								}
								onChange={ () => {
									setAttributes( {
										modalTriggerEnabled: ! (
											attributes?.modalTriggerEnabled ||
											false
										),
									} );
								} }
							/>
							{ attributes?.modalTriggerEnabled && (
								<SelectControl
									label={ __(
										'Modal',
										'simple-modal-block'
									) }
									value={ attributes?.modalEnabled }
									options={ modalOptions }
									onChange={ ( val ) => {
										setAttributes( {
											modalEnabled: val,
										} );
									} }
								/>
							) }
							{ selectedModal != null && (
								<Button
									label={ __(
										'Edit Modal',
										'simple-modal-block'
									) }
									variant="secondary"
									onClick={ () =>
										selectBlock( selectedModal.clientId )
									}
								>
									{ __( 'Open Modal', 'simple-modal-block' ) }
								</Button>
							) }
						</BaseControl>
					</InspectorAdvancedControls>
				) }
			</>
		);
	};
}, 'withInspectorControl' );

const applyAttributes = ( extraProps, blockType, attributes ) => {
	const { modalTriggerEnabled, modalEnabled } = attributes;

	if ( true === modalTriggerEnabled && null != modalEnabled ) {
		return {
			...extraProps,
			'data-trigger-modal': modalEnabled,
		};
	}

	return extraProps;
};

addFilter(
	'blocks.registerBlockType',
	'cloudcatch/SimpleModalBlockAttributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'cloudcatch/SimpleModalBlockAdvancedControls',
	withAdvancedControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'cloudcatch/SimpleModalBlockAttributes',
	applyAttributes
);
