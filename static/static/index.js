import 'babel-polyfill';
import 'web-animations-js/web-animations.min.js';
import JogWheel from '../../library';

function main(window, document) {
	const teaser = document.querySelector('.jogwheel-teaser');
	const teaserWheel = JogWheel.create(teaser);
	teaserWheel.pause().seek(0);
	window.teaserWheel = teaserWheel;
}

main(global, global.document);
