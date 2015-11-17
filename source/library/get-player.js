import {prefix} from './get-vendor-prefix';
import getKeyframes from './get-keyframes';
import getAnimationProperties from './get-animation-properties';
import convertAnimationDuration from './convert-animation-duration';
import convertAnimationIterations from './convert-animation-iterations';

/**
 * Gets a web animation player based on the currently assigned CSS animation
 * @param element {HTMLElement} DOM element to scan for an applied CSS animation
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {Object} `player` and `duration` attached to element
 * @private
 */
export default function getPlayer(element, window = global.window, document = global.document) {
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

	// TODO: Should bail/stub? here if no keyframes are found
	// Construct options for the webanimation player instance
	const options = {
		duration: convertAnimationDuration(duration),
		iterations: convertAnimationIterations(iterationCount),
		fill: fillMode,
		easing: timingFunction
	};

	// TODO: Test get-keyframes for sorting and duplication
	// Sort by offset and remove duplicates
	keyframes.sort((a, b) => a.offset - b.offset);

	// Construct webanimation player instance with keyframes and options
	const player = element.animate(keyframes, options);

	// Detach the former animation to prevent problems with polyfill
	element.style[prefix('animationName', window, document)] = `__jogwheelName-${name}`;
	player.__jogwheelName = name;

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return {
		player,
		duration: options.duration
	};
}
