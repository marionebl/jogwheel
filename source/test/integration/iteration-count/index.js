import 'web-animations-js';

const tape = require('tape');
const jogwheel = require('jogwheel');

tape('iteration-count', t => {
	const element = document.querySelector('[data-animated]');
	const wheel = jogwheel.create(element, {}, window, document);

	t.doesNotThrow(() => {
		wheel.seek(0.5);
	});

	t.doesNotThrow(() => {
		wheel.play();
	});

	t.end();
});
