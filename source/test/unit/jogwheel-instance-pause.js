import tape from 'tape-catch';

import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';

import runningAnimation from '../fixtures/running-animation';

import JogWheel from '../../library/';

tape('instance.pause', t => {
	const instance = JogWheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.pause() === instance,
		'should return the JogWheel instance'
	);
	t.end();

	const runningElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...runningAnimation
		}
	};

	const runningInstance = JogWheel.create(runningElement, {}, windowStub, documentStub);
	runningInstance.pause();

	t.equals(
		runningInstance.player.playState,
		'paused',
		'should pause a running JogWheel instance'
	);
});
