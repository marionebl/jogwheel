import defaults from './defaults.js';
import getPlayer from './get-player.js';

class JogWheel {
	/**
	 * Creates a new JogWheel instance
	 * @constructor
	 * @param  {HTMLElement} element  HTMLElement to instantiate on
	 * @param  {object} options Options object
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Seek to middle of animation sequence
	 * wheel.seek(0.5);
	 *
	 * // Play the animation
	 * wheel.play();
	 */
	static create(...args) {
		return Object.seal(Object.freeze(new JogWheel(...args)));
	}

	static _cache = {
		media: null
	};

	/**
	 * Creates a new JogWheel instance
	 * @constructor
	 * @param  {HTMLElement} element  HTMLElement to instantiate on
	 * @param  {object} options Options object
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a JogWheel instance on element
	 * const wheel = new JogWheel(element);
	 */
	constructor(element, options, window = global.window, document = global.document) {
		if (!element) {
			throw new Error(`Could not construct JogWheel, missing element`);
		}

		this.element = element;
		this.player = getPlayer(element, window, document);
		this.settings = {...defaults, ...options};
	}

	/**
	 * Plays the animation
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Seek to middle of animation sequence and play
	 * wheel.seek(0.5).play();
	 */
	play() {
		this.player.play();
		return this;
	}

	/**
	 * Pauses the animation
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: false
	 * });
	 *
	 * // Pause the animation and reset it to animation start
	 * wheel.pause().seek(0);
	 */
	pause() {
		this.player.pause();
		return this;
	}

	/**
	 * Seeks the timeline of the animation
	 * @param  {float} progress fraction of the animation timeline [0..1]
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Keep track of scroll position
	 * let scrollTop = document.scrollTop;
	 * document.addEventListener('scroll', () => scrollTop = document.scrollTop);
	 *
	 * // Seek the animation [0..1] for scroll position of [0..300]
	 * function loop() {
	 * 	const fraction = Math.max((300 / scrollTop) - 1, 0);
	 * 	wheel.seek(fraction);
	 * 	window.requestAnimationFrame(loop);
	 * }
	 *
	 * // Start the render loop
	 * loop();
	 */
	seek(progress) {
		const duration = this.player.effect ? this.player.effect.activeDuration || this.player.effect.timing.duration : this.player._totalDuration;
		this.player.currentTime = duration * progress;
		return this;
	}

	/**
	 * Reregister all eventListeners and cache entries for this JogWheel instance
	 * @return {JogWheel} JogWheel instance
	 * @private
 	 * @example
 	 * import JogWheel from 'jogwheel';
 	 * const element = document.querySelector('[data-animated]');
 	 *
 	 * // Instantiate a paused JogWheel instance on element
 	 * const wheel = JogWheel.create(element);
 	 *
 	 * // Attach new styling on the page
 	 * const link = document.createElement('link');
 	 * link.rel = 'stylesheet';
 	 * link.src = 'http://google.com/'
 	 *
 	 * // Unplug and plug again to read new styling information
 	 * wheel.unplug().plug();
 	 */
	plug() {
		// TODO: implement this
		// TODO: test this
		return this;
	}

	/**
	 * Unregisters all eventListeners and cache entries for this JogWheel instance
	 * @return {JogWheel} JogWheel instance
	 * @private
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element);
	 *
	 * // Attach new styling on the page
	 * const link = document.createElement('link');
	 * link.rel = 'stylesheet';
	 * link.src = 'http://google.com/'
	 *
	 * // Unplug and plug again to read new styling information
	 * wheel.unplug().plug();
	 */
	unplug() {
		// TODO: implement this
		// TODO: test this
		return this;
	}

	/**
	 * Renders inline styles on the instance element if applicable
	 * @return {JogWheel} JogWheel instance
	 * @private
	 */
	render(styles) {
		// TODO: add documentation
		// TODO: implement this, must proxy elemnt writes for e.g. react integration
		this.settings.render(this.element, styles);
		return this;
	}
}

export default JogWheel;
