const cacheKey = '__jogwheel_vendor_prefix_cache';

export default function getVendorPrefix(window = global.window, document = global.document) {
	if (document[cacheKey]) {
		return document[cacheKey];
	}

	document[cacheKey] = '';

	const prefixes = /^(Moz|Webkit|ms)(?=[A-Z])/;
	const element = document.body;

	for (const property in element.style) {
		if (prefixes.test(property)) {
			document[cacheKey] = property.match(prefixes)[0];
			return document[cacheKey];
		}
	}

	return document[cacheKey];
}

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
