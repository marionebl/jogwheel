import camelCase from 'lodash.camelcase';

import parseKeyframeKey from './parse-keyframe-key';
import getDefinedStyles from './get-defined-styles';
import removeVendorPrefix from './remove-vendor-prefix';

/**
 * Normalize as cssPropertyName to its unprefixed, camelcased form
 * @param  {string} propertyName
 * @return {string}
 * @private
 */
function normalizePropertyName(propertyName) {
	return camelCase(removeVendorPrefix(propertyName));
}

/**
 * Transforms KeyFrameRule to array of web animation compatible keyframes
 * @param  {Object} keyFrameRule KeyFrameRule to transform
 * @return {Array}               Array of webanimation keyframes
 * @private
 */
export default function transformKeyframeDeclaration(keyFrameRule) {
	// Convert keyFrame.keyText to integers holding percentage of keyframe
	const percentages = parseKeyframeKey(keyFrameRule.keyText);
	const style = getDefinedStyles(keyFrameRule.style);

	// Normalize to unprefixed styles
	const normalizedStyles = Object.keys(style).reduce((result, propertyName) => {
		const name = normalizePropertyName(propertyName);
		result[name] = style[propertyName];
		return result;
	}, {});

	return percentages.map(percentage => {
		return {
			// Convert percentage to fraction of 1 for webanimation compat
			offset: percentage / 100,
			// Mixin with extracted keyframe styling
			...normalizedStyles
		};
	});
}
