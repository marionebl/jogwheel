import 'web-animations-js';

const tape = require('tape');
const JogWheel = require('jogwheel');

tape('iteration-count', t => {
	const element = document.querySelector('[data-animated]');
	const wheel = JogWheel.create(element, {}, window, document);

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
	}, 500);

	t.end();
});
