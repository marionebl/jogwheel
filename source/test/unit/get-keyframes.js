import tape from 'tape';
import documentStub from './stubs/document.js';
import keywordDocumentStub from './stubs/keyword-document';
import crossDomainDocumentStub from './stubs/cross-domain-document';
import elementStub from './stubs/element.js';

import pausedAnimation from './fixtures/paused-animation.js';

import {
	animation as simpleAnimationDefinition
} from './fixtures/simple-animation-declaration.js';

import {
	animation as keyWordAnimationDefinition
} from './fixtures/keyword-animation-declaration.js';

import {
	animation as crossDomainAnimationDefinition
} from './fixtures/cross-domain-stylesheets.js';

import getKeyframes from '../../library/get-keyframes.js';

tape('get-keyframes', t => {
	const element = {...elementStub, styles: {
		...elementStub.styles,
		...pausedAnimation
	}};

	t.ok(
		Array.isArray(getKeyframes(element, documentStub.styleSheets)),
		'should return an array');

	t.doesNotThrow(
		() => getKeyframes('default-animation', crossDomainDocumentStub.styleSheets),
		crossDomainAnimationDefinition,
		'should not fail for cross-domain-stylesheet'
	);

	t.deepEqual(
		getKeyframes('default-animation', crossDomainDocumentStub.styleSheets),
		crossDomainAnimationDefinition,
		'should return empty keyframes for cross-domain-stylesheet'
	);

	t.deepEqual(
		getKeyframes('default-animation', documentStub.styleSheets),
		simpleAnimationDefinition,
		'should return the correct keyframes for simple-animation'
	);

	{
		const actual = getKeyframes('default-animation', keywordDocumentStub.styleSheets);
		const expected = keyWordAnimationDefinition;

		t.deepEqual(
			actual,
			expected,
			'should return the correct keyframes for keyword-animation'
		);
	}

	t.end();
});
