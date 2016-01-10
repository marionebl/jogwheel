import toArray from './to-array';
import getCSSRules from './get-css-rules';
import getKeyframeDeclarations from './get-keyframe-declarations';
import transformKeyframeDeclaration from './transform-keyframe-declaration';

/**
 * Gets webanimation keyframes attached to a CSS animationName
 * @param {string} animationName - CSS animationName to search keyframes for
 * @param {StyleSheetList} list of stylesheets to search in
 * @return {array} Array of webanimation keyframes attached to animationName
 * @private
 */
export default function getKeyframes(animationName, styleSheets) {
	// Collect CSSRules present in the document
	const CSSRules = toArray(styleSheets)
		.reduce((results, styleSheet) => [...results, ...getCSSRules(styleSheet)], []);

	// Filter CSSRules for KeyFrameRules
	return getKeyframeDeclarations(animationName, CSSRules)
		// Transform KeyFrameRules to web animation compatible format
		.map(transformKeyframeDeclaration)
		// Flatten mulitdimensional array of transformed keyframes
		.reduce((results, declaration) => {
			const amend = Array.isArray(declaration) ? declaration : [declaration];
			return [...results, ...amend];
		}, []);
}
