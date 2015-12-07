import 'babel-polyfill';
import 'web-animations-js/web-animations-next.min.js';
import jogwheel from '../../library';

/* let state = {
	scrollTop: 0,
	teaserBottom: 0,
	teaserHeight: 0
};

function clamp(input, min = 0, max = 1) {
	return Math.max(min, Math.min(max, input));
}

function round(input, precision = 2) {
	return Math.round(input * (10 ^ precision)) / (10 ^ precision);
}

function equals(a = [], b = []) {
	let result = true;

	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i += 1) {
		for (let j = 0; j < b.length; j += 1) {
			result = a[i] === b[i];
			if (!result) {
				return result;
			}
		}
	}

	return result;
}

function distinct(fn, thisArg = this) {
	let memo;
	return function (...args) { // eslint-disable-line no-extra-bind
		if (!equals(memo, args)) {
			memo = args;
			return fn.apply(thisArg, args); // eslint-disable-line prefer-reflect
		}
	};
}

function loop(options) {
	return function frame() {
		const fraction = clamp(1 - state.teaserHeight - state.scrollTop / state.teaserHeight, 0, 1);
		console.log(fraction);
		options.seekTeaser(fraction);

		options.window.requestAnimationFrame(frame);
	};
}

function measure(context, data = {}) {
	return () => {
		const scrollTop = context.document.body.scrollTop;

		state = {
			...state,
			...data,
			scrollTop
		};
	};
}

function main(window, document) {
	const logoWheel = jogwheel.create(document.querySelector('.jogwheel-logo'));
	logoWheel.play();

	const teaser = document.querySelector('.jogwheel-teaser');
	const teaserWheel = jogwheel.create(teaser);
	teaserWheel.pause();

	const options = {
		window, document,
		logo: logoWheel,
		teaser: teaserWheel,
		seekTeaser: distinct(teaserWheel.seek, teaserWheel)
	};

	const teaserRect = teaser.getBoundingClientRect();
	const data = {
		teaserHeight: teaserRect.height,
		teaserBottom: teaserRect.bottom
	};

	document.addEventListener('scroll', measure(options, data));

	measure(options, data)();
	loop(options)();

	window.jogwheel = jogwheel;
	window.teaser = teaserWheel;
}

main(global, global.document); */
