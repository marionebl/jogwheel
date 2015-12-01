import tape from 'tape';
import getAnimationProperties from '../../library/get-animation-properties.js';

import elementStub from './stubs/element.js';
import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';

import pausedAnimation from './fixtures/paused-animation';
import filledAnimation from './fixtures/filled-animation';

tape('get-animation-properties', t => {
	t.throws(() => {
		getAnimationProperties();
	}, 'should throw when called without arguments');

	t.doesNotThrow(() => {
		getAnimationProperties(elementStub, windowStub, documentStub);
	}, 'should not throw when called with arguments');

	const pausedElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...pausedAnimation
		}
	};

	const pausedProperties = getAnimationProperties(pausedElement, windowStub, documentStub);

	t.deepEqual(
		Object.keys(pausedProperties),
		[
			'name',
			'duration',
			'iterationCount',
			'timingFunction',
			'fillMode',
			'playState',
			'delay'
		],
		'should return an object with the expected property values');

	t.deepEqual(
		pausedProperties,
		{
			name: 'default-animation',
			duration: '300ms',
			delay: undefined,
			iterationCount: undefined,
			timingFunction: 'linear',
			fillMode: undefined,
			playState: 'paused'
		},
		'should return an object with the expected property values');

	const filledElement = {
		...elementStub,
		style: {
			...elementStub.style,
			...filledAnimation
		}
	};

	const filledProperties = getAnimationProperties(filledElement, windowStub, documentStub);

	t.deepEqual(
		filledProperties,
		{
			name: 'filled-animation',
			duration: '1s',
			delay: '.5s',
			iterationCount: '10',
			timingFunction: 'linear',
			fillMode: 'both',
			playState: 'running'
		},
		'should return an object with the expected property values');

	t.end();
});
