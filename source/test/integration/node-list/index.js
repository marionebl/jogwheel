import 'web-animations-js';

const tape = require('tape');
const JogWheel = require('jogwheel');

tape('iteration-count', t => {
	const elements = document.querySelectorAll('[data-animated]');
	const wheel = JogWheel.create(elements, {}, window, document);

	t.doesNotThrow(() => {
		wheel.seek(0.5);
	});

	t.doesNotThrow(() => {
		wheel.play();
	});

	setTimeout(() => {
		t.doesNotThrow(() => {
			wheel.pause();
		});

		t.end();
	}, 500);
});
