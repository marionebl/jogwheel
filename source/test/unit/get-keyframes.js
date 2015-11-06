import tape from 'tape';
import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import keywordDocumentStub from './stubs/keyword-document';
import elementStub from './stubs/element.js';

import pausedAnimation from './fixtures/paused-animation.js';

import {
	animation as simpleAnimationDefinition
} from './fixtures/simple-animation-declaration.js';

import {
	animation as keyWordAnimationDefinition
} from './fixtures/keyword-animation-declaration.js';

import getKeyframes from '../../library/get-keyframes.js';

tape('get-keyframes', t => {
	const element = {...elementStub, styles: {
		...elementStub.styles,
		...pausedAnimation
	}};

	t.ok(
		Array.isArray(getKeyframes(element, windowStub, documentStub)),
		'should return an array');

	t.deepEqual(
		getKeyframes('default-animation', windowStub, documentStub),
		simpleAnimationDefinition,
		'should return the correct keyframes for simple-animation'
	);

	t.deepEqual(
		getKeyframes('default-animation', windowStub, keywordDocumentStub),
		keyWordAnimationDefinition,
		'should return the correct keyframes for keyword-animation'
	);

	t.end();
});
