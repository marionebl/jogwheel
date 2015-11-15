import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';

import runningAnimation from './fixtures/running-animation';
import pausedAnimation from './fixtures/paused-animation';
import slowAnimation from './fixtures/slow-animation';

import JogWheel from '../../library/';

tape('instance.seek', t => {
	const element = {
		...elementStub,
		style: {
			...elementStub.style,
			...pausedAnimation
		}
	};

	const instance = JogWheel.create(element, {}, windowStub, documentStub);
	t.ok(
		instance.seek() === instance,
		'should return the JogWheel instance'
	);
	t.end();

	instance.seek(0.5);

	t.equals(
		instance.progress,
		0.5,
		'should jump to correct progress for paused-animation'
	);

	instance.players.forEach(player => {
		t.equals(
			player.currentTime,
			150,
			'should jump each player instance to correct currentTime for paused-animation'
		);
	});

	instance.seek(0);

	t.equals(
		instance.progress,
		0,
		'should jump to correct progress for paused-animation'
	);

	instance.players.forEach(player => {
		t.equals(
			player.currentTime,
			0,
			'should jump each player instance to correct currentTime for paused-animation'
		);
	});

	const runningElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...runningAnimation
		}
	};

	const runningInstance = JogWheel.create(runningElement, {}, windowStub, documentStub);
	runningInstance.seek(1);

	t.equals(
		runningInstance.progress,
		1,
		'should jump to correct progress for running-animation'
	);

	runningInstance.seek(0.2);

	t.equals(
		runningInstance.progress,
		0.2,
		'should jump to correct progress for running-animation'
	);

	const slowElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...slowAnimation
		}
	};

	const slowInstance = JogWheel.create(slowElement, {}, windowStub, documentStub);
	slowInstance.seek(0.5);

	t.equals(
		slowInstance.progress,
		0.5,
		'should jump to correct progress for slow-animation'
	);

	slowInstance.seek(0.75);

	t.equals(
		slowInstance.progress,
		0.75,
		'should jump to correct progress for slow-animation'
	);
});
