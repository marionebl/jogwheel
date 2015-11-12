import 'babel-polyfill';
import 'web-animations-js/web-animations-next.min.js';
import JogWheel from '../../library';

let state = {
	scrollTop: 0,
	navigationTop: Infinity,
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
		const teaserDelta = clamp((state.teaserBottom - state.navigationTop) * -1, -Infinity, 0) + state.teaserHeight;
		const navigationFixed = state.navigationTop < state.scrollTop;

		if (teaserDelta !== 0) {
			const fraction = round(clamp(1 - (teaserDelta / state.teaserHeight)), 5);
			options.seekTeaser(fraction);
		}

		options.seekNavigationList(navigationFixed ? 1 : 0);
		options.toggleNavigationList(navigationFixed);

		options.window.requestAnimationFrame(frame);
	};
}

function onScroll(context, data = {}) {
	return () => {
		const scrollTop = context.document.body.scrollTop;
		const navigationTop = context.navigation.getBoundingClientRect().top;

		state = {
			...state,
			...data,
			scrollTop,
			navigationTop
		};
	};
}

function main(window, document) {
	const logoWheel = JogWheel.create(document.querySelector('.jogwheel-logo'));
	logoWheel.play();

	const teaser = document.querySelector('.jogwheel-teaser');
	const teaserWheel = JogWheel.create(teaser);
	teaserWheel.pause();

	const navigation = document.querySelector('.jogwheel-navigation');

	const navigationList = document.querySelector('.jogwheel-navigation-list');
	const navigationListWheel = JogWheel.create(navigationList);

	const options = {
		window, document,
		navigationList: navigationListWheel,
		navigation,
		logo: logoWheel,
		teaser: teaserWheel,
		seekTeaser: distinct(teaserWheel.seek, teaserWheel),
		seekNavigationList: distinct(navigationListWheel.seek, navigationListWheel),
		toggleNavigationList: distinct(fixed => {
			if (fixed) {
				navigation.style.height = `${navigationList.getBoundingClientRect().height}px`;
				navigationList.classList.add('jogwheel-navigation-list--fixed');
			} else {
				navigation.style.height = '';
				navigationList.classList.remove('jogwheel-navigation-list--fixed');
			}
		})
	};

	const teaserRect = teaser.getBoundingClientRect();

	document.addEventListener('scroll', onScroll(options, {
		teaserHeight: teaserRect.height,
		teaserBottom: teaserRect.bottom
	}));

	loop(options)();

	window.JogWheel = JogWheel;
	window.teaser = teaserWheel;
}

main(global, global.document);
