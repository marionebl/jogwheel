import 'web-animations-js';

const tape = require('tape');
const jogwheel = require('jogwheel');

const element = document.querySelector('[data-animated]');

tape('simple integration', t => {
	let actual = {};

	const wheel = jogwheel.create(element, {
		render(element, styles) {
			actual = styles;
			Object.keys(styles)
				.filter(propertyName => propertyName !== 'length')
				.forEach(propertyName => element.style[propertyName] = styles[propertyName]);
		}
	}, window, document);

	t.comment('Pausing and seeking to 0');
	t.doesNotThrow(() => wheel.pause(), 'Pausing does not throw');
	t.doesNotThrow(() => wheel.seek(0), 'Seeking does not throw');

	window.setTimeout(() => {
		let value = actual.opacity || window.getComputedStyle(element).opacity;
		t.equals(value, '0', 'Should leave element with opacity of 0');

		t.comment('Seeking to 0.5');
		wheel.seek(0.5);

		window.setTimeout(() => {
			value = actual.opacity || window.getComputedStyle(element).opacity;
			t.notEqual(value, '0', 'Should leave element with opacity other than 0');

			t.comment('Seeking to 1');
			wheel.seek(1);
			window.setTimeout(() => {
				value = actual.opacity || window.getComputedStyle(element).opacity;
				t.equals(value, '0', 'Should leave element with opacity of 0');

				t.comment('Playing the animation');
				wheel.play();

				const previous = actual.opacity || window.getComputedStyle(element).opacity;

				setTimeout(() => { // eslint-disable-line max-nested-callbacks
					value = actual.opacity || window.getComputedStyle(element).opacity;
					t.notEqual(value, previous, 'Should leave element with different opacity after timeout');
					wheel.pause();
					t.end();
				}, 300);
			}, 300);
		}, 300);
	}, 300);
});
