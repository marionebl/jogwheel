/**
 * Parses KeyFrameRule.keyText to an array of integers holding keyframe percentages
 * @param  {string} keyText KeyFrameRule.keyText to parse
 * @return {array}          Array of percentages for this KeyFrameRule
 * @private
 */
export default function parseKeyframeKey(keyText) {
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
