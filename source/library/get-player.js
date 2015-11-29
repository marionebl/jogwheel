import {prefix} from './get-vendor-prefix';
import getKeyframes from './get-keyframes';
import getAnimationProperties from './get-animation-properties';
import convertAnimationDuration from './convert-animation-duration';
import convertAnimationIterations from './convert-animation-iterations';

/**
 * Gets a web animation player based on the currently assigned CSS animation
 * @param element {HTMLElement} DOM element to scan for an applied CSS animation
 * @param settings {object} Settings object passed to JogWheel instance
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {Object} `player` and `duration` attached to element
 * @private
 */
export default function getPlayer(element, settings, window = global.window, document = global.document) {
	// Read all animation related styles from element, respect prefixes
	const {
		name,
		duration,
		iterationCount,
		timingFunction,
		fillMode,
		playState
	} = getAnimationProperties(element, window, document);

	// Generate keyframes based on the assigned animationName
	const keyframes = getKeyframes(name, window, document);
	console.log(keyframes);

	// TODO: Should bail/stub? here if no keyframes are found
	// Construct options for the webanimation player instance
	const options = {
		duration: convertAnimationDuration(duration),
		iterations: convertAnimationIterations(iterationCount),
		fill: fillMode,
		easing: timingFunction,
		playState,
		...settings
	};

	// TODO: Test get-keyframes for sorting and duplication
	// Sort by offset and remove duplicates
	keyframes.sort((a, b) => a.offset - b.offset);

	// Use user-provided animate function (ponyfill) or HTMLElement.prototype.animate
	const animate = settings.animate ?
		(...args) => settings.animate(element, ...args) :
		element.animate;

	if (typeof animate !== 'function') {
		console.warn('No animation function found. Have you forgotten to include a pony- or polyfill?');
	}

	// Construct webanimation player instance with keyframes and options
	const player = animate.bind(element)(keyframes, options);

	// Detach the former animation to prevent problems with polyfill
	element.style[prefix('animationName', window, document)] = `__jogwheelName-${name}`;
	player.__jogwheelName = name;

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (options.playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return {
		player,
		duration: options.duration
	};
}
