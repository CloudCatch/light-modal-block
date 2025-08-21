/**
 * Maps preferred trigger class names to their corresponding selector.
 *
 * @type {Object<string, string>}
 */
export const preferredTriggerClassToSelectorMap = {
	'wp-block-button': '.wp-block-button__link',
};

/**
 * Returns the preferred trigger element given a possible container.
 * If the container matches a known block class, returns the preferred child;
 * otherwise returns the original element.
 *
 * @param {Element} element - The potential trigger container element.
 * @return {Element} The preferred trigger element.
 */
export function resolvePreferredTriggerElement( element ) {
	for ( const className in preferredTriggerClassToSelectorMap ) {
		if ( element.classList.contains( className ) ) {
			const child = element.querySelector( preferredTriggerClassToSelectorMap[ className ] );
			if ( child ) {
				return child;
			}
		}
	}
	return element;
}
