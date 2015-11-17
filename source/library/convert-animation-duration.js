/**
 * Converts CSS animation duration string to integer holding duration in milliseconds
 * @param CSSAnimationDuration {string} [CSSAnimationDuration='0s'] The CSS animation duration string to convert
 * @return {integer} The duration of the css animation string in milliseconds
 * @private
 */
export default function convertAnimationDuration(CSSAnimationDuration = '0s') {
	const [unit, factor] = CSSAnimationDuration.includes('ms') ? ['ms', 1] : ['s', 1000];
	const trimmed = CSSAnimationDuration.replace(unit, '').trim();
	const duration = trimmed[0] === '.' ? `0${trimmed}` : trimmed;
	return parseFloat(duration, 10) * factor;
}
