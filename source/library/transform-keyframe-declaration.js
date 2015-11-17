import parseKeyframeKey from './parse-keyframe-key';
import getDefinedStyles from './get-defined-styles';

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

	return percentages.map(percentage => {
		return {
			// Convert percentage to fraction of 1 for webanimation compat
			offset: percentage / 100,
			// Mixin with extracted keyframe styling
			...style
		};
	});
}
