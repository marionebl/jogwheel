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

	t.comment('Pausing and seeking to 0');
	t.doesNotThrow(() => wheel.pause(), 'Pausing does not throw');
	t.doesNotThrow(() => wheel.seek(0), 'Seeking does not throw');

	window.setTimeout(() => {
		t.equals(window.getComputedStyle(element).opacity, '0', 'Should leave element with opacity of 0');

		t.comment('Seeking to 0.5');
		wheel.seek(0.5);

		window.setTimeout(() => {
			t.notEqual(window.getComputedStyle(element).opacity, '0', 'Should leave element with opacity other than 0');

			t.comment('Seeking to 1');
			wheel.seek(1);
			window.setTimeout(() => {
				t.equals(window.getComputedStyle(element).opacity, '0', 'Should leave element with opacity of 0');

				t.comment('Playing the animation');
				wheel.play();

				const previous = window.getComputedStyle(element).opacity;

				setTimeout(() => { // eslint-disable-line max-nested-callbacks
					t.notEqual(window.getComputedStyle(element).opacity, previous, 'Should leave element with different opacity after timeout');
					t.end();
				}, 300);
			}, 300);
		}, 300);
	}, 300);
});
