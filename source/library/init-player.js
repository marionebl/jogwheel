import {prefix} from './get-vendor-prefix';
import createTrap from './create-trap';

/**
 * isNativeFunction
 * Tests if fn is a native function
 * @param fn {function} function to test
 * @return {bool}
 * @private
 */
function isNativeFunction(fn) {
	Function.prototype.toString.call(fn).match(/\{\s*\[native code\]\s*\}/); // eslint-disable-line prefer-reflect
}

/**
 * Initialize a WebAnimationsPlayer instance
 * @param  {HTMLElement} element   HTMLElement to instantiate on
 * @param  {array} keyframes   keyframes passed to render
 * @param  {object} options    options passed to render
 * @param  {function} [render] render function used to apply interpolated inline styles
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {object}         WebAnimationsPlayer instance
 * @private
 */
export default function initPlayer(element, keyframes, options, render, window = global.window, document = global.document) {
	// Create a proxy for the playElement if needed
	// - no native implementation
	// - render function is given
	const playerElement = isNativeFunction(element.animate) === false && render ?
		createTrap(element, 'style', render) :
		element;

	// Create the WebAnimationPlayer instance
	const player = playerElement.animate(keyframes, options);

	// Detach the former animation to prevent problems with polyfill
	playerElement.style[prefix('animationName', window, document)] = `__jogwheelName-${options.name}`;
	player.__jogwheelName = options.name;

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (options.playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return player;
}
