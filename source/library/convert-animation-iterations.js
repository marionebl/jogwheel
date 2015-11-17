/**
 * Converts CSS animation iteration count string to integer
 * @param CSSIterationCount {string} [CSSIterationCount='1'] CSS animation iteration count
 * @return {integer}
 * @private
 */
export default function convertAnimationIterations(CSSIterationCount = '1') {
	if (CSSIterationCount === 'infinite') {
		return Infinity;
	}

	return parseInt(CSSIterationCount, 10);
}
