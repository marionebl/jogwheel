import getPlayer from './get-player';
import getMediaqueryMedia from './get-mediaquery-media';
import {prefix} from './get-vendor-prefix';

class JogWheel {
	/**
	 * Creates a new jogwheel instance
	 * @constructor
	 * @param  {Node|NodeList} nodes  Node or NodeList to instantiate on
	 * @param  {object} options Options object
	 * @param.name {string} [name=computedStyle.animationName] animation-name to read keyframes for
	 * @param.duration {number} [duration=computedStyle.animationDuration] duration in milliseconds, positive
	 * @param.delay {number} [delay=computedStyle.animationDelay] delay in milliseconds, positive or negative
	 * @param.iterationCount {number} [iterationCount=computedStyle.animationIterationCount] positive number of times the animation runs
	 * @param.timingFunction {string} [timingFunction=computedStyle.animationTimingFunction] CSS timing function string
	 * @param.playState {string} [playState=computedStyle.playState] CSS playstate string. Either 'paused' or 'running'
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {jogwheel} jogwheel instance
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *:
	 * // Instantiate a paused jogwheel instance on element
	 * const wheel = jogwheel.create(element, {
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
		return new JogWheel(...args);
	}

	/**
	 * Creates a new jogwheel instance
	 * @constructor
	 * @param  {Node|NodeList} nodes  Node or NodeList to instantiate on
	 * @param  {object} options Options object
	 * @param.name {string} [name=computedStyle.animationName] animation-name to read keyframes for
	 * @param.duration {number} [duration=computedStyle.animationDuration] duration in milliseconds, positive
	 * @param.delay {number} [delay=computedStyle.animationDelay] delay in milliseconds, positive or negative
	 * @param.iterationCount {number} [iterationCount=computedStyle.animationIterationCount] positive number of times the animation runs
	 * @param.timingFunction {string} [timingFunction=computedStyle.animationTimingFunction] CSS timing function string
	 * @param.playState {string} [playState=computedStyle.playState] CSS playstate string. Either 'paused' or 'running'
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {jogwheel} jogwheel instance
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a jogwheel instance on element
	 * const wheel = new jogwheel(element);
	 */
	constructor(nodes, options, window = global.window, document = global.document) {
		// Lax sanity check
		if (!nodes) {
			throw new Error(`Could not construct jogwheel, missing element`);
		}

		// Copy options to avoid copy-by-reference bugs
		const settings = {...options};

		// Normalize nodes to array
		const elements = nodes instanceof window.NodeList ? [].slice.call(nodes) : [nodes]; // eslint-disable-line prefer-reflect

		// Get WANPlayer configuration for each element
		const configurations = elements.map(element => getPlayer(element, settings, window, document));

		// Get media query rules
		const medias = getMediaqueryMedia(document.styleSheets)
			.map(window.matchMedia);

		// Listen for media query changes and update accordingly
		medias.forEach(media => media.addListener(this.onMatchMedia.bind(this)));

		// Unwrap values relevant for instance
		const players = configurations.map(configuration => configuration.player);
		const durations = configurations.map(configuration => configuration.duration);

		// Hold references for later use
		this.__instance = {
			elements, players, durations, settings, medias, window, document
		};
	}

	/**
	 * @name JogWheel.prototype.playState
	 * @readonly
	 * @return {string} playState, either `running` or `paused`
	 */
	get playState() {
		// jogwheel does not support asynchronously running animations
		// in one instance, thus fetching the first player is enough
		const player = this.players[0];
		return player.playState;
	}

	/**
	 * @name JogWheel.prototype.progress
	 * @readonly
	 * @return {float} progress in fraction of 1 [0..1]
	 */
	get progress() {
		// jogwheel does not support asynchronously running animations
		// in one instance, thus fetching the first player is enough
		const player = this.players[0];
		const duration = this.durations[0];
		return player.currentTime / duration;
	}

	/**
	 * @name JogWheel.prototype.players
	 * @readonly
	 * @return {array} WebAnimationPlayer instances by jogwheel instance
	 */
	get players() {
		return this.__instance.players;
	}

	/**
	 * @name JogWheel.prototype.durations
	 * @readonly
	 * @return {array} durations used by jogwheel instance
	 */
	get durations() {
		return this.__instance.durations;
	}

	/*
	 * @name JogWheel.prototype.onMatchMedia
	 * @return null
	 * @private
	 */
	onMatchMedia() {
		const {
			elements,
			players,
			settings,
			window,
			document
		} = this.__instance;

		// Save current state
		const state = {
			progress: this.progress,
			playState: this.playState
		};

		// Cancel all players
		players.forEach(player => player.cancel());

		// Clean up element animationName reset
		elements.map(element =>
			element.style[prefix('animationName', window, document)] = ''
		);

		// Init new instance
		// Get WANPlayer configuration for each element
		const configurations = elements.map(element => getPlayer(element, settings, window, document));

		// Unwrap values relevant for instance
		const updatedPlayers = configurations.map(configuration => configuration.player);
		const durations = configurations.map(configuration => configuration.duration);

		global.instance = this;

		// Resume from last progress
		if (settings.resume !== false) {
			const start = state.playState === 'paused' ? this.pause : this.play;
			this.seek(state.progress);
			start.bind(this)();
		}

		this.__instance = {
			...this.__instance,
			players: updatedPlayers,
			durations
		};
	}

	/**
	 * Plays the animation
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused jogwheel instance on element
	 * const wheel = jogwheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Seek to middle of animation sequence and play
	 * wheel.seek(0.5).play();
	 */
	play() {
		this.players.forEach(player => player.play());
		return this;
	}

	/**
	 * Pauses the animation
	 * @return {jogwheel} jogwheel instance
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused jogwheel instance on element
	 * const wheel = jogwheel.create(element, {
	 * 	paused: false
	 * });
	 *
	 * // Pause the animation and reset it to animation start
	 * wheel.pause().seek(0);
	 */
	pause() {
		this.players.forEach(player => player.pause());
		return this;
	}

	/**
	 * Seeks the timeline of the animation
	 * @name JogWheel.prototype.seek()
	 * @param  {float} progress fraction of the animation timeline [0..1]
	 * @return {jogwheel} jogwheel instance
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused jogwheel instance on element
	 * const wheel = jogwheel.create(element, {
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
		this.__instance.players.forEach((player, index) => {
			player.currentTime = this.durations[index] * progress;
		});
		return this;
	}

	/**
	 * Reregister all eventListeners and cache entries for this jogwheel instance
	 * @return {jogwheel} jogwheel instance
	 * @private
 	 * @example
 	 * import jogwheel from 'jogwheel';
 	 * const element = document.querySelector('[data-animated]');
 	 *
 	 * // Instantiate a paused jogwheel instance on element
 	 * const wheel = jogwheel.create(element);
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
		const {elements, settings, window, document} = this.__instance;

		// Get WANPlayer configuration for each element
		const configurations = elements.map(element => getPlayer(element, settings, window, document));

		// Get media query rules
		const medias = getMediaqueryMedia(document.styleSheets)
			.map(window.matchMedia);

		// Listen for media query changes and update accordingly
		medias.forEach(media => media.addListener(this.onMatchMedia.bind(this)));

		// Unwrap values relevant for instance
		const players = configurations.map(configuration => configuration.player);
		const durations = configurations.map(configuration => configuration.duration);

		// Listen for media query changes and update accordingly
		medias.forEach(media => media.addListener(this.onMatchMedia.bind(this)));

		// Update references for later use
		this.__instance = {
			...this.__instance, players, durations, medias
		};

		return this;
	}

	/**
	 * Unregisters all eventListeners and cache entries for this jogwheel instance
	 * @return {jogwheel} jogwheel instance
	 * @private
	 * @example
	 * import jogwheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused jogwheel instance on element
	 * const wheel = jogwheel.create(element);
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
		const {medias, elements, players, window, document} = this.__instance;

		// Cancel all players
		players.forEach(player => player.cancel());

		// Remove former matchMedia callbacks
		medias.forEach(media => media.removeListener(this.onMatchMedia));

		// Clean up element animationName reset
		elements.map(element => element.style[prefix('animationName', window, document)] = '');

		// Cleanse state
		this.__instance = {
			...this.__instance,
			players: [],
			durations: [],
			medias: []
		};

		return this;
	}
}

export default JogWheel;
