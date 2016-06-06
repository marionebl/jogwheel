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
	if (typeof fn !== 'function') {
		return false;
	}

	return Function.prototype.toString.call(fn).match(/\{\s*\[native code\]\s*\}/); // eslint-disable-line prefer-reflect
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
	// Gracefully handle cases where element.animate is not defined
	if (typeof element.animate !== 'function') {
		const {HTMLElement = {}} = window;
		const {prototype: ElementPrototype = {}} = HTMLElement;
		const {animateMethod} = ElementPrototype;
		const animateAvailable = typeof animateMethod === 'function';

		// Log warnings in development mode
		if (process.env.NODE_ENV !== 'production') {
			const polyFillMessage = animateAvailable === false ? [
				`Did you include a WebAnimation polyfill?`,
				`https://git.io/vVV3x`
			] : [];

			const message = [
				`Initializing JogWheel on an object without animate method`,
				`falling back to noop WebAnimationsPlayer instance.`,
				...polyFillMessage
			];

			console.warn(...message);
		}

		element.animate = () => {
			return {
				...element,
				currentTime: 0,
				play() {},
				pause() {}
			};
		};
	}

	// Create a proxy for the playerElement if needed
	// - no native implementation
	// - render function is given
	const isNative = isNativeFunction(element.animate);
	const hasRenderCallback = typeof render === 'function';

	const playerElement = isNative === false && hasRenderCallback ?
		createTrap(element, 'style', render) :
		element;

	// Log warnings in development mode
	if (process.env.NODE_ENV !== 'production') {

	}

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
