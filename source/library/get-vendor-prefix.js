const cacheKey = '__jogwheel_vendor_prefix_cache';

/**
 * Gets the primary CSS vendor prefix for the current or provided document environment
 * @param  {Window} [window = global.window] The window context to use
 * @param  {Document} [document = global.document] The document context to use
 * @return {string} The primary CSS vendor prefix
 * @private
 */
export default function getVendorPrefix(window = global.window, document = global.document) {
	// Replace this when we get WeakMaps
	if (document[cacheKey]) {
		return document[cacheKey];
	}

	document[cacheKey] = '';

	const prefixes = /^(Moz|Webkit|ms)(?=[A-Z])/i;
	const element = document.body;

	for (const property in element.style) { // eslint-disable-line guard-for-in
		if (prefixes.test(property)) {
			document[cacheKey] = property.match(prefixes)[0];
			return document[cacheKey];
		}
	}

	return document[cacheKey];
}

/**
 * Prefixes a given CSS property if needed in the current or provided document environment
 * @param  {string} propertyName CSS property to prefix
 * @param  {Window} [window = global.window] The window context to use
 * @param  {Document} [document = global.document] The document context to use
 * @return {string} The prefixed version of the CSS property
 * @private
 */
export function prefix(propertyName, window = global.window, document = global.document) {
	const element = document.body;
	const prefix = getVendorPrefix(window, document);

	if (prefix === '') {
		return propertyName;
	}

	if (propertyName in element.style) {
		return propertyName;
	}

	return `${prefix}${propertyName[0].toUpperCase()}${propertyName.slice(1)}`;
}
