import 'web-animations-js';

const tape = require('tape');
const JogWheel = require('jogwheel');

const element = document.querySelector('[data-animated]');

tape('simple integration', t => {
	/**
	 * Reset a running animation
	 * - pause
	 * - rewind to 0
	 * - play
	 */
	const wheel = JogWheel.create(element, {}, window, document);
	t.doesNotThrow(() => wheel.pause(), 'Pausing does not throw');
	t.doesNotThrow(() => wheel.seek(0), 'Seeking does not throw');

	setTimeout(() => {
		wheel.play();
		t.end();
	}, 10);
});
