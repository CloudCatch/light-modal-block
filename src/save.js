import classNames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { SVG, Path } from '@wordpress/components';

export default function save( props ) {
	const { attributes } = props;
	const {
		id,
		width,
		backdropColor,
		enableCloseButton,
		triggerType,
		triggerDelay,
		enableTriggerDelay,
		triggerSelector,
	} = attributes;

	const widthWithUnit = Number.isFinite( width ) ? width + '%' : width;

	const blockProps = useBlockProps.save( {
		style: widthWithUnit ? { maxWidth: widthWithUnit } : undefined,
	} );

	const wrapperBlockProps = {
		role: 'dialog',
		'aria-modal': true,
		className: classNames(
			'wp-block-cloudcatch-simple-modal-block__wrapper'
		),
		style: backdropColor ? { backgroundColor: backdropColor } : undefined,
		'data-trigger-delay': enableTriggerDelay ? triggerDelay : undefined,
		'data-trigger-selector': triggerSelector || undefined,
		'data-modal-id': id,
	};

	return (
		<div { ...wrapperBlockProps }>
			<div { ...blockProps }>
				<div
					{ ...useInnerBlocksProps.save( {
						className:
							'wp-block-cloudcatch-simple-modal-block__content',
					} ) }
				/>
				{ enableCloseButton && (
					<button className="wp-block-cloudcatch-simple-modal-block__close">
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
	);
}
