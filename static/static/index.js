import 'babel-polyfill';
import 'web-animations-js/web-animations-next.min.js';
import JogWheel from '../../library';

function main(window, document) {
	const teaser = document.querySelector('.jogwheel-teaser');
	const teaserWheel = JogWheel.create(teaser);

	window.teaserWheel = teaserWheel;
}

main(window, document);
