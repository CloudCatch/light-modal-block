import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { useDispatch } from '@wordpress/data';
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
import { useModals } from '../utils';

const ALLOWED_BLOCKS = [
	'core/button',
	'core/image',
	'core/heading',
	'core/group',
];

const addAttributes = ( settings, name ) => {
	if (
		settings?.attributes !== undefined &&
		ALLOWED_BLOCKS.includes( name )
	) {
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
	}

	return settings;
};

const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		const modals = useModals();

		const selectedModal = modals.filter(
			( block ) => attributes?.modalEnabled === block?.attributes?.id
		)[ 0 ];

		const { selectBlock } = useDispatch( blockEditorStore );

		const modalOptions = [
			{ label: __( 'Select Modal', 'light-modal-block' ), value: '' },
			...modals.map( ( modal ) => {
				return {
					label:
						modal?.attributes?.label ||
						__( 'New Modal', 'light-modal-block' ),
					value: modal?.attributes?.id,
				};
			} ),
		];

		if ( ! ALLOWED_BLOCKS.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ name !== 'cloudcatch/light-modal-block' && (
					<InspectorAdvancedControls>
						<BaseControl __nextHasNoMarginBottom>
							<ToggleControl
								label={ __(
									'Show Modal on Click',
									'light-modal-block'
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
								__nextHasNoMarginBottom
							/>
							{ attributes?.modalTriggerEnabled && (
								<SelectControl
									label={ __( 'Modal', 'light-modal-block' ) }
									value={ attributes?.modalEnabled }
									options={ modalOptions }
									onChange={ ( val ) => {
										setAttributes( {
											modalEnabled: val,
										} );
									} }
									__nextHasNoMarginBottom
								/>
							) }
							{ selectedModal != null && (
								<Button
									label={ __(
										'Edit Modal',
										'light-modal-block'
									) }
									variant="secondary"
									onClick={ () =>
										selectBlock( selectedModal.clientId )
									}
								>
									{ __( 'Open Modal', 'light-modal-block' ) }
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
	'cloudcatch/LightModalBlockAttributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'cloudcatch/LightModalBlockAdvancedControls',
	withAdvancedControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'cloudcatch/LightModalBlockAttributes',
	applyAttributes
);
