import uniq from 'lodash.uniq';

import toArray from './to-array';
import cssRuleEnumerations from './cssrule-enumerations';
import getCSSRules from './get-css-rules';

/**
 * Gets media query rules from styleSheets
 * @param {CSSStyleSheetList} styleSheets - StyleSheetList to search in
 * @returns {Array} Array of media query rule media texts
 * @private
 */
export default function getMediaqueryMedia(styleSheets) {
	// Collect CSSRules present in document
	const CSSRules = toArray(styleSheets)
		.reduce((results, styleSheet) => [...results, ...getCSSRules(styleSheet)], []);

	// Get all media query declarations and return array of media rules
	const type = cssRuleEnumerations.media;

	return uniq(
		CSSRules
			// filter for media queries
			.filter(rule => rule.type === type)
			// map to media rules
			.map(rule => rule.media.mediaText)
			// filter not all media query
			.filter(media => media !== 'not all')
	);
}
