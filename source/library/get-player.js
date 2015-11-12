import getKeyframes from './get-keyframes';
import {prefix as getPrefixed} from './get-vendor-prefix';

/**
 * Converts CSS animation duration string to integer holding duration in milliseconds
 * @param CSSAnimationDuration {string} [CSSAnimationDuration='0s'] The CSS animation duration string to convert
 * @return {integer} The duration of the css animation string in milliseconds
 * @private
 */
function getAnimationDuration(CSSAnimationDuration = '0s') {
	const [unit, factor] = CSSAnimationDuration.includes('ms') ? ['ms', 1] : ['s', 1000];
	const trimmed = CSSAnimationDuration.replace(unit, '').trim();
	const duration = trimmed[0] === '.' ? `0${trimmed}` : trimmed;
	return parseFloat(duration, 10) * factor;
}

/**
 * Gets a web animation player based on the currently assigned CSS animation
 * @param element {HTMLElement} DOM element to scan for an applied CSS animation
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {Object} Configured web animation player instance
 * @private
 */
export default function getPlayer(element, window = global.window, document = global.document) {
	function prefix(propertyName) {
		return getPrefixed(propertyName, window, document);
	}

	// TODO: Make this a function, test it
	// Read all animation related styles from element, respect prefixes
	const {
		[prefix('animationName')]: animationName,
		[prefix('animationDuration')]: CSSDuration,
		[prefix('animationIterations')]: iterations,
		[prefix('animationEasing')]: easing,
		[prefix('animationFillMode')]: fill,
		[prefix('animationPlayState')]: playState
	} = window.getComputedStyle(element);

	// Generate keyframes based on the assigned animationName
	const keyframes = getKeyframes(animationName, window, document);

	// TODO: Should bail/stub? here if no keyframes are found
	// Construct options for the webanimation player instance
	const options = {
		duration: getAnimationDuration(CSSDuration),
		iterations, easing, fill
	};

	// Sort by offset and remove duplicates
	// TODO: Test get-keyframes for sorting and duplication
	keyframes.sort((a, b) => a.offset - b.offset);

	// Construct webanimation player instance with keyframes and options
	const player = element.animate(keyframes, options);
	element.style[prefix('animationName')] = 'jogwheel-none';

	// Detach the former animation to prevent problems with polyfill
	player.__jogwheelName = animationName;

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return player;
}
