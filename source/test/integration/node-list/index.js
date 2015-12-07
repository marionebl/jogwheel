import 'web-animations-js';

const tape = require('tape');
const jogwheel = require('jogwheel');

tape('node-list', t => {
	const elements = document.querySelectorAll('[data-animated]');
	const wheel = jogwheel.create(elements, {}, window, document);

	t.doesNotThrow(() => {
		wheel.seek(0.5);
	});

	t.doesNotThrow(() => {
		wheel.play();
	});

	t.end();
});
