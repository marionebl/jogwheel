import defaults from './defaults.js';
import getPlayer from './get-player.js';

class JogWheel {
	static create(...args) {
		return new JogWheel(...args);
	}

	static _cache = {
		media: null
	};

	constructor(element, options) {
		if (!element) {
			throw new Error(`Could not construct JogWheel, missing element`);
		}

		this.element = element;
		this.player = getPlayer(element);
		this.settings = {...defaults, ...options};
	}

	play() {
		this.player.play();
		return this;
	}

	pause() {
		this.player.pause();
		return this;
	}

	seek(progress) {
		this.player.currentTime = this.player.effect.activeDuration * progress;
		return this;
	}

	unplug() {
		return this;
	}

	render(styles) {
		this.settings.render(this.element, styles);
		return this;
	}
}

export default JogWheel;
