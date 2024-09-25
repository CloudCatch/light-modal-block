/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	useSettings,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	SVG,
	Path,
	withNotices,
} from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

import './editor.scss';
import { generateModalId, useModals } from './utils';

export function Edit( props ) {
	const { attributes, setAttributes, isSelected, clientId } = props;
	const {
		id,
		label,
		width,
		backdropColor,
		enableCloseButton,
		triggerDelay,
		enableTriggerDelay,
		triggerSelector,
		cookieDuration,
	} = attributes;

	const modals = useModals();

	// Ensure that the modal ID is unique.
	useEffect( () => {
		const duplicates = modals.filter( ( obj, index, arr ) =>
			arr.find(
				( innerObj ) =>
					innerObj.attributes.id === obj.attributes.id &&
					innerObj.clientId !== obj.clientId
			)
		);

		if ( duplicates.length <= 1 ) {
			return;
		}

		for ( let i = 1; i < duplicates.length; i++ ) {
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				duplicates[ i ].clientId,
				{ id: generateModalId() }
			);
		}
	}, [ clientId, modals ] );

	const [ alreadyOpenedDefault, setAlreadyOpenedDefault ] = useState( false );

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const postType = useSelect( ( select ) => {
		const { getCurrentPostType } = select( editorStore );

		return getCurrentPostType();
	}, [] );

	const ref = useRef( null );
	const [ open, setOpen ] = useState( false );

	const isInnerBlockSelected = useSelect(
		( select ) => {
			const { hasSelectedInnerBlock } = select( blockEditorStore );

			return hasSelectedInnerBlock( clientId, true );
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( ! id ) {
			setAttributes( { id: generateModalId() } );
		}
	}, [ id, setAttributes ] );

	useEffect( () => {
		if ( isSelected || isInnerBlockSelected ) {
			setOpen( true );
		} else if ( 'wp_block' === postType && ! alreadyOpenedDefault ) {
			setAlreadyOpenedDefault( true );
			setOpen( true );
		} else {
			setOpen( false );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isSelected, isInnerBlockSelected, postType ] );

	const close = () => {
		setOpen( false );
	};

	const [ availableUnits ] = useSettings( 'spacing.units' );
	const units = useCustomUnits( {
		availableUnits: availableUnits || [ '%', 'px', 'em', 'rem', 'vw' ],
	} );

	const widthWithUnit = Number.isFinite( width ) ? width + '%' : width;

	const blockProps = useBlockProps( {
		style: widthWithUnit ? { maxWidth: widthWithUnit } : undefined,
	} );

	const wrapperBlockProps = {
		ref,
		role: 'dialog',
		'aria-modal': true,
		className: classNames(
			'wp-block-cloudcatch-light-modal-block__wrapper',
			{
				'is-open': open,
			}
		),
		style: backdropColor ? { backgroundColor: backdropColor } : undefined,
		'data-trigger-delay': enableTriggerDelay ? triggerDelay : undefined,
		'data-trigger-selector': triggerSelector || undefined,
		'data-cookie-duration': cookieDuration || undefined,
		'data-modal-id': id,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<p className="wp-block-cloudcatch-light-modal-block__editor-id">
						{ __( 'Modal ID', 'light-modal-block' ) }
						{ ': ' }
						<code>{ id }</code>
					</p>
					<TextControl
						label={ __( 'Modal Label', 'light-modal-block' ) }
						value={ label }
						placeholder={ __( 'New Modal', 'light-modal-block' ) }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						help={ __(
							'Used to differentiate modals from one another',
							'light-modal-block'
						) }
					/>
					<UnitControl
						label={ __( 'Width' ) }
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={ width || '' }
						onChange={ ( nextWidth ) => {
							nextWidth =
								0 > parseFloat( nextWidth ) ? '0' : nextWidth;
							setAttributes( { width: nextWidth } );
						} }
						units={ units }
					/>
					<ToggleControl
						label={ __( 'Show close button', 'light-modal-block' ) }
						checked={ enableCloseButton || false }
						onChange={ () => {
							setAttributes( {
								enableCloseButton: ! enableCloseButton,
							} );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Triggers', 'light-modal-block' ) }>
					<ToggleControl
						label={ __(
							'Show modal on page load',
							'light-modal-block'
						) }
						checked={ enableTriggerDelay || false }
						onChange={ () => {
							setAttributes( {
								enableTriggerDelay: ! enableTriggerDelay,
							} );
						} }
					/>
					{ enableTriggerDelay && (
						<>
							<UnitControl
								label={ __( 'Delay', 'light-modal-block' ) }
								labelPosition="edge"
								__unstableInputWidth="80px"
								value={ triggerDelay }
								placeholder="0"
								onChange={ ( val ) =>
									setAttributes( { triggerDelay: val } )
								}
								unit="ms"
								units={ {
									ms: {
										value: 'ms',
										label: 'ms',
										default: '',
										a11yLabel: __( 'Milliseconds (ms)' ),
										step: 1,
									},
								} }
							/>
							<UnitControl
								label={ __(
									'Cookie duration',
									'light-modal-block'
								) }
								labelPosition="edge"
								__unstableInputWidth="80px"
								value={ cookieDuration }
								help={ __(
									'Duration in minutes before this modal will appear again after being closed. Leave blank to always show this modal.',
									'light-modal-block'
								) }
								placeholder="0"
								onChange={ ( val ) =>
									setAttributes( { cookieDuration: val } )
								}
								unit="min"
								units={ {
									ms: {
										value: 'min',
										label: 'min',
										default: '',
										a11yLabel: __( 'Minutes (min)' ),
										step: 1,
									},
								} }
							/>
						</>
					) }
					<TextControl
						label={ __( 'Selector', 'light-modal-block' ) }
						value={ triggerSelector }
						onChange={ ( val ) =>
							setAttributes( { triggerSelector: val } )
						}
						style={ { fontFamily: 'monospace' } }
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							colorValue: backdropColor,
							label: __( 'Backdrop', 'light-modal-block' ),
							onColorChange: ( val ) =>
								setAttributes( { backdropColor: val } ),
							isShownByDefault: true,
							enableAlpha: true,
							resetAllFilter: () => ( {
								backdropColor: undefined,
							} ),
						},
					] }
					panelId={ clientId }
					{ ...colorGradientSettings }
				/>
			</InspectorControls>
			<div { ...wrapperBlockProps }>
				<div { ...blockProps }>
					<div
						{ ...useInnerBlocksProps( {
							className:
								'wp-block-cloudcatch-light-modal-block__content',
						} ) }
					/>
					{ enableCloseButton && (
						<button
							className="wp-block-cloudcatch-light-modal-block__close"
							onClick={ close }
						>
							<SVG
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
							>
								<Path d="M24 1.2 22.8 0 12 10.8 1.2 0 0 1.2 10.8 12 0 22.8 1.2 24 12 13.2 22.8 24l1.2-1.2L13.2 12 24 1.2z" />
							</SVG>
						</button>
					) }
				</div>
			</div>
		</>
	);
}

export default withNotices( Edit );
