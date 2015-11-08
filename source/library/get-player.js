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
	// Try to take a shortcut and use HTMLElement.prototype.getAnimations
	// This should make this idempotent
	const animations = element.getAnimations();

	// Warn the user about the fact that we do not support more than one animation
	if (animations.length > 1) {
		console.warn(`JogWheel supports one CSS animation per element, found ${animations.length}. Will use only first animation.`);
		console.debug(animations);
	}

	// If HTMLElement.prototype.getAnimations retrieves something, use it
	if (animations.length > 0) {
		return animations[0];
	}

	// "Curry" getPrefixed for easier usage
	function prefix(propertyName) {
		return getPrefixed(propertyName, window, document);
	}

	// Read all animation related styles from element, respect prefixes
	const {
		[prefix('animationDuration')]: animationName,
		[prefix('animationDuration')]: CSSDuration,
		[prefix('animationIterations')]: iterations,
		[prefix('animationEasing')]: easing,
		[prefix('animationFill')]: fill,
		[prefix('animationPlayState')]: playState
	} = window.getComputedStyle(element);

	// TODO: Should bail/stub? here if no animationName is found
	// Generate keyframes based on the assigned animationName
	const keyframes = getKeyframes(animationName, window, document);

	// TODO: Should bail/stub? here if no keyframes are found
	// Construct options for the webanimation player instance
	const options = {
		duration: getAnimationDuration(CSSDuration),
		iterations, easing, fill
	};

	// Construct webanimation player instance with keyframes and options
	const player = element.animate(keyframes, options);

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return player;
}
