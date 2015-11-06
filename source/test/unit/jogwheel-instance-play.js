import tape from 'tape-catch';

import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';

import pausedAnimation from '../fixtures/paused-animation';

import JogWheel from '../../library/';

tape('instance.play', t => {
	const instance = JogWheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.play() === instance,
		'should return the JogWheel instance'
	);

	const pausedElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...pausedAnimation
		}
	};

	const pausedInstance = JogWheel.create(pausedElement, {}, windowStub, documentStub);
	pausedInstance.play();

	t.equals(
		pausedInstance.player.playState,
		'running',
		'should start a paused JogWheel instance'
	);

	t.end();
});
