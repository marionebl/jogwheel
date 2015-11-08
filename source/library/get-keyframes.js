// CSSRule type enums
const enums = {
	unknown: 0,
	style: 1,
	charset: 2,
	import: 3,
	media: 4,
	fontface: 5,
	page: 6,
	keyframes: 7,
	keyframe: 8,
	namespace: 9,
	counter: 11,
	supports: 12,
	document: 13,
	fontfeature: 14,
	viewport: 15,
	region: 16
};

/**
 * Gets all CSSRules of type typeName and matching the predecate from rules
 * @param  {string} [typeName='style']    - CSSRule type to search for, valid types:
 *                                          unknown, style, charset, import, media, fontface, page, keyframes, keyframe, namespace, counter, supports, document, fontfeature, viewport, region
 * @param  {array} [rules=[]]             - Array of CSSRules to search
 * @param  {function} [predecate=Boolean] - Predecate function to filter matches
 * @return {array} Array of matching CSSRules
 * @private
 */
export function getDeclarations(typeName = 'style', rules = [], predecate = Boolean) {
	// Get target type enum
	const type = enums[typeName];

	return [...rules]
		// filter by rule type
		.filter(rule => rule.type === type)
		// filter with user-provided predecate
		.filter(predecate)
		// unwrap cssRules
		.map(rule => rule.cssRules)
		// flatten cssRules
		.reduce((results, cssRules) => {
			return [...results, ...cssRules];
		}, []);
}

/**
 * Gets all KeyFrameRule declarations attached to CSS animationName preset in rules
 * @param  {string} animationName - CSS animationName to search KeyFrameRule declarations for
 * @param  {array} rules - Array of CSSRules to search
 * @return {array} Array of matching KeyFrameRules
 * @private
 */
export function getKeyframeDeclarations(animationName, rules) {
	// Filter for KeyFrameRules matching an animationName
	return getDeclarations('keyframes', rules, rule => rule.name === animationName);
}

/**
 * Parses KeyFrameRule.keyText to an array of integers holding keyframe percentages
 * @param  {string} keyText KeyFrameRule.keyText to parse
 * @return {array}          Array of percentages for this KeyFrameRule
 * @private
 */
export function parseKeyframeKey(keyText) {
	// Split multivalue key,
	return keyText.split(',')
		// Trim any remaining whitespace
		.map(key => key.trim())
		// "Understand" CSS keyText keywords
		.map(key => key
			.replace('from', '0')
			.replace('to', '100'))
		// Remove any math symbols
		.map(key => key.replace('%', ''))
		// Parse to integer
		.map(key => parseInt(key, 10));
}

/**
 * Transforms KeyFrameRule to array of web animation compatible keyframes
 * @param  {Object} keyFrameRule KeyFrameRule to transform
 * @return {Array}               Array of webanimation keyframes
 * @private
 */
export function transformKeyframeDeclaration(keyFrameRule) {
	// Convert keyFrame.keyText to integers holding percentage of keyframe
	const percentages = parseKeyframeKey(keyFrameRule.keyText);

	return percentages.map(percentage => {
		return {
			// Convert percentage to fraction of 1 for webanimation compat
			offset: percentage / 100,
			// Mixin with extracted keyframe styling
			...keyFrameRule.style
		};
	});
}

/**
 * Gets webanimation keyframes attached to a CSS animationName
 * @param {string} animationName - CSS animationName to search keyframes for
 * @param {Window} [window=global.window] - Global context to use
 * @param {Document} [document=global.window] - Document context to use
 * @return {array} Array of webanimation keyframes attached to animationName
 * @private
 */
export default function getKeyframes(animationName, window = global.window, document = global.document) {
	return [...document.styleSheets]
		// Collect all css keyframe declarations present in the document
		.reduce((results, styleSheet) => {
			return [...results, ...getKeyframeDeclarations(animationName, styleSheet.cssRules)];
		}, [])
		// Transform keyframe declarations to web animation compatible format
		.map(transformKeyframeDeclaration)
		// Flatten mulitdimensional array of transformed keyframe declarations
		.reduce((results, declaration) => {
			const amend = Array.isArray(declaration) ? declaration : [declaration];
			return [...results, ...amend];
		}, []);
}
