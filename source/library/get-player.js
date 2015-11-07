import getKeyframes from './get-keyframes';
import {prefix as getPrefixed} from './get-vendor-prefix';

function getAnimationDuration(CSSAnimationDuration = '0s') {
	const [unit, factor] = CSSAnimationDuration.includes('ms') ? ['ms', 1] : ['s', 1000];
	const trimmed = CSSAnimationDuration.replace(unit, '').trim();
	const duration = trimmed[0] === '.' ? `0${trimmed}` : trimmed;
	return parseFloat(duration, 10) * factor;
}

export default function getPlayer(element, window = global.window, document = global.document) {
	function prefix(propertyName) {
		return getPrefixed(propertyName, window, document);
	}

	const {
		[prefix('animationDuration')]: animationName,
		[prefix('animationDuration')]: CSSDuration,
		[prefix('animationIterations')]: iterations,
		[prefix('animationEasing')]: easing,
		[prefix('animationFill')]: fill,
		[prefix('animationPlayState')]: playState
	} = window.getComputedStyle(element);

	const keyframes = getKeyframes(animationName, window, document);
	const options = {
		duration: getAnimationDuration(CSSDuration),
		iterations, easing, fill
	};

	const player = element.animate(keyframes, options);

	if (playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return player;
}
