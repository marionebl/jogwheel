import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';

import pausedAnimation from './fixtures/paused-animation';

import jogwheel from '../../library/';

tape('instance.play', t => {
	const instance = jogwheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.play() === instance,
		'should return the jogwheel instance'
	);

	const pausedElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...pausedAnimation
		}
	};

	const pausedInstance = jogwheel.create(pausedElement, {}, windowStub, documentStub);
	pausedInstance.play();

	t.equals(
		pausedInstance.playState,
		'running',
		'should start a paused jogwheel instance'
	);

	t.end();
});
