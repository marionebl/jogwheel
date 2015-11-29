import getKeyframeDeclarations from './get-keyframe-declarations';
import transformKeyframeDeclaration from './transform-keyframe-declaration';
import toArray from './to-array';

/**
 * Gets webanimation keyframes attached to a CSS animationName
 * @param {string} animationName - CSS animationName to search keyframes for
 * @param {Window} [window=global.window] - Global context to use
 * @param {Document} [document=global.window] - Document context to use
 * @return {array} Array of webanimation keyframes attached to animationName
 * @private
 */
export default function getKeyframes(animationName, window = global.window, document = global.document) {
	return toArray(document.styleSheets)
		// Collect all css keyframe declarations present in the document
		.reduce((results, styleSheet) => {
			const rules = toArray(styleSheet.cssRules || []);
			return [...results, ...toArray(getKeyframeDeclarations(animationName, rules))];
		}, [])
		// Transform keyframe declarations to web animation compatible format
		.map(transformKeyframeDeclaration)
		// Flatten mulitdimensional array of transformed keyframe declarations
		.reduce((results, declaration) => {
			const amend = Array.isArray(declaration) ? declaration : [declaration];
			return [...results, ...amend];
		}, []);
}
