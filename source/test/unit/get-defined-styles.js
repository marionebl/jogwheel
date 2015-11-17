import tape from 'tape';

import simpleAnimation from './fixtures/simple-animation-declaration.js';
const simpleAnimationKeyFrameRules = simpleAnimation[0].cssRules[0].cssRules;

import getDefinedStyles from '../../library/get-defined-styles.js';

tape('get-defined-styles', t => {
	t.ok(
		typeof getDefinedStyles(simpleAnimationKeyFrameRules[0].style) === 'object',
		'should return an object'
	);

	t.deepEqual(
		getDefinedStyles(simpleAnimationKeyFrameRules[0].style),
		{
			height: '0',
			width: '0'
		}, 'should return the correct style map');

	t.deepEqual(
		getDefinedStyles(simpleAnimationKeyFrameRules[1].style),
		{
			height: '100px',
			width: '100px'
		}, 'should return the correct style map');

	t.end();
});
