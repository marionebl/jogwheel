import tape from 'tape';
import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';

import simpleAnimation from './fixtures/simple-animation-declaration.js';
const simpleAnimationKeyFramesRule = simpleAnimation[0].cssRules;
const simpleAnimationKeyFrameRules = simpleAnimation[0].cssRules[0].cssRules;

import {getKeyframeDeclarations} from '../../library/get-keyframes.js';

tape('get-keyframe-declarations', t => {
	t.ok(
		Array.isArray(
			getKeyframeDeclarations(
				'default-animation',
				simpleAnimationKeyFramesRule,
				windowStub,
				documentStub
			)
		),
		'should return an array');
	t.deepEqual(
		getKeyframeDeclarations(
			'default-animation',
			simpleAnimationKeyFramesRule,
			windowStub,
			documentStub
		),
		simpleAnimationKeyFrameRules,
		'should return an array of keyframes');
	t.end();
});
