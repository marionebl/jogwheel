import getDeclarations from './get-declarations';

/**
 * Gets all KeyFrameRule declarations attached to CSS animationName preset in rules
 * @param  {string} animationName - CSS animationName to search KeyFrameRule declarations for
 * @param  {array} rules - Array of CSSRules to search
 * @return {array} Array of matching KeyFrameRules
 * @private
 */
export default function getKeyframeDeclarations(animationName, rules) {
	// Filter for KeyFrameRules matching an animationName
	return getDeclarations('keyframes', rules, rule => rule.name === animationName);
}
