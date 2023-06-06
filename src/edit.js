/**
 * External dependencies
 */
import classNames from 'classnames';
import { debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	useSetting,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useEffect, useRef, useState, useMemo } from '@wordpress/element';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	SVG,
	Path,
	withNotices,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import './editor.scss';
import { generateModalId } from './utils';

export function Edit( props ) {
	const {
		attributes,
		setAttributes,
		isSelected,
		clientId,
		noticeOperations,
	} = props;
	const {
		id,
		label,
		width,
		backdropColor,
		enableCloseButton,
		triggerType,
		triggerDelay,
		enableTriggerDelay,
		triggerSelector,
	} = attributes;
	const ref = useRef( null );
	const [ open, setOpen ] = useState( false );

	const isInnerBlockSelected = useSelect(
		( select ) => {
			const { hasSelectedInnerBlock } = select( blockEditorStore );

			return hasSelectedInnerBlock( clientId, true );
		},
		[ clientId ]
	);

	const modals = useSelect( ( select ) => {
		return select( blockEditorStore )
			.getBlocks()
			.filter(
				( block ) => block.name === 'cloudcatch/simple-modal-block'
			);
	} );

	useEffect( () => {
		if ( ! id ) {
			setAttributes( { id: generateModalId() } );
		}
	}, [] );

	useEffect( () => {
		if ( isSelected || isInnerBlockSelected ) {
			setOpen( true );
		} else {
			setOpen( false );
		}
	}, [ isSelected, isInnerBlockSelected ] );

	const close = () => {
		setOpen( false );
	};

	const debouncedClose = useMemo( () => debounce( close, 150 ), [] );

	const units = useCustomUnits( {
		availableUnits: useSetting( 'spacing.units' ) || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
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
			'wp-block-cloudcatch-simple-modal-block__wrapper',
			{ 'is-open': open }
		),
		style: backdropColor ? { backgroundColor: backdropColor } : undefined,
		'data-trigger-delay': enableTriggerDelay ? triggerDelay : undefined,
		'data-trigger-selector': triggerSelector || undefined,
		'data-modal-id': id,
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={ __( 'Modal Label', 'simple-modal-block' ) }
						value={ label }
						placeholder={ __( 'New Modal', 'simple-modal-block' ) }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						help={ __(
							'Used to differentiate modals from one another',
							'simple-modal-block'
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
						label={ __(
							'Show Close Button',
							'simple-modal-block'
						) }
						checked={ enableCloseButton || false }
						onChange={ () => {
							setAttributes( {
								enableCloseButton: ! enableCloseButton,
							} );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Triggers', 'simple-modal-block' ) }>
					<ToggleControl
						label={ __(
							'Show Modal on Page Load',
							'simple-modal-block'
						) }
						checked={ enableTriggerDelay || false }
						onChange={ () => {
							setAttributes( {
								enableTriggerDelay: ! enableTriggerDelay,
							} );
						} }
					/>
					{ enableTriggerDelay && (
						<UnitControl
							label={ __( 'Delay', 'simple-modal-block' ) }
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
					) }
					<TextControl
						label={ __( 'Selector', 'simple-modal-block' ) }
						value={ triggerSelector }
						onChange={ ( val ) =>
							setAttributes( { triggerSelector: val } )
						}
						style={ { fontFamily: 'monospace' } }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...wrapperBlockProps }>
				<div { ...blockProps }>
					<div
						{ ...useInnerBlocksProps( {
							className:
								'wp-block-cloudcatch-simple-modal-block__content',
						} ) }
					/>
					{ enableCloseButton && (
						<button
							className="wp-block-cloudcatch-simple-modal-block__close"
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
