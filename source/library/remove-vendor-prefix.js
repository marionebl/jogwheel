const prefixes = [
	'ms',
	'webkit',
	'moz'
];

/**
 * remove vendor prefixes from CSSPropertyNames
 * @param  {string} propertyName prefixed property name
 * @return {string}              unprefixed property name
 * @private
 */
export default function removeVendorPrefix(propertyName = '') {
	const fragments = propertyName.split('-');

	if (prefixes.indexOf(fragments[1]) > -1) {
		return fragments.slice(2).join('-');
	}

	return propertyName;
}
