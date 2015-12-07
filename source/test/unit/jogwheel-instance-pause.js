import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';

import runningAnimation from './fixtures/running-animation';

import jogwheel from '../../library/';

tape('instance.pause', t => {
	const instance = jogwheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.pause() === instance,
		'should return the jogwheel instance'
	);
	t.end();

	const runningElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...runningAnimation
		}
	};

	const runningInstance = jogwheel.create(runningElement, {}, windowStub, documentStub);
	runningInstance.pause();

	t.equals(
		runningInstance.playState,
		'paused',
		'should pause a running jogwheel instance'
	);
});
