import tape from 'tape';
import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';

import pausedAnimation from '../fixtures/paused-animation';
import runningAnimation from '../fixtures/running-animation';
import slowAnimation from '../fixtures/slow-animation';

import getPlayer from '../../library/get-player.js';

tape('get-player', t => {
	t.ok(
		typeof getPlayer(elementStub, windowStub, documentStub) === 'object',
		'should return an object');

	const pausedElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...pausedAnimation
		}
	};

	const pausedInstance = getPlayer(pausedElement, windowStub, documentStub);

	t.equals(
		pausedInstance.playState,
		'paused',
		'should return a paused AnimationPlayer instance'
	);

	const runningElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...runningAnimation
		}
	};

	const runningInstance = getPlayer(runningElement, windowStub, documentStub);

	t.equals(
		runningInstance.playState,
		'running',
		'should return a running AnimationPlayer instance'
	);

	const fastInstance = getPlayer(runningElement, windowStub, documentStub);

	t.equals(
		fastInstance.effect.activeDuration,
		300,
		'should return a running AnimationPlayer with a correct activeDuration'
	);

	const slowElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...slowAnimation
		}
	};

	const slowInstance = getPlayer(slowElement, windowStub, documentStub);

	t.equals(
		slowInstance.effect.activeDuration,
		1000,
		'should return a running AnimationPlayer with a correct activeDuration'
	);

	t.end();
});
