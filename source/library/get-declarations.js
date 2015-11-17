import cssRuleEnumerations from './cssrule-enumerations';
import toArray from './to-array';

/**
 * Gets all CSSRules of type typeName and matching the predecate from rules
 * @param  {string} [typeName='style']    - CSSRule type to search for, valid types:
 *                                          unknown, style, charset, import, media, fontface, page, keyframes, keyframe, namespace, counter, supports, document, fontfeature, viewport, region
 * @param  {array} [rules=[]]             - Array of CSSRules to search
 * @param  {function} [predecate=Boolean] - Predecate function to filter matches
 * @return {array} Array of matching CSSRules
 * @private
 */
export default function getDeclarations(typeName = 'style', rules = [], predecate = Boolean) {
	// Get target type enum
	const type = cssRuleEnumerations[typeName];

	return toArray(rules)
		// filter by rule type
		.filter(rule => rule.type === type)
		// filter with user-provided predecate
		.filter(predecate)
		// unwrap cssRules
		.map(rule => rule.cssRules)
		// flatten cssRules
		.reduce((results, cssRules) => {
			return [
				...results,
				...toArray(cssRules)
			];
		}, []);
}
