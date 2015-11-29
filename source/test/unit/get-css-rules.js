import tape from 'tape';

import getCSSRules from '../../library/get-css-rules.js';

import simple, {
	animation as simpleAnimationDefinition
} from './fixtures/simple-animation-declaration.js';

import keyWord, {
	animation as keyWordAnimationDefinition
} from './fixtures/keyword-animation-declaration.js';

import crossDomain, {
	animation as crossDomainAnimationDefinition
} from './fixtures/cross-domain-stylesheets.js';

import crossDomainUnsafe, {
	animation as crossDomainUnsafeAnimationDefinition
} from './fixtures/cross-domain-unsafe-stylesheets.js';

tape('get-css-rules', t => {
	t.ok(
		Array.isArray(getCSSRules(simple)),
		'should return an array for simple-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(keyWord)),
		'should return an array for keyword-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(crossDomain)),
		'should return an array for cross-domain-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(crossDomainUnsafe)),
		'should return an array for cross-domain-unsafe-stylesheet');

	t.doesNotThrow(
		() => getCSSRules(simple),
		'should not fail for simple-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(keyWord),
		'should not fail for keyword-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(crossDomain),
		'should not fail for cross-domain-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(crossDomainUnsafe),
		'should not fail for cross-domain-unsafe-stylesheet'
	);

	t.deepEqual(
		getCSSRules(simple),
		simpleAnimationDefinition,
		'returns correct css rules for simple-stylesheet'
	);

	t.deepEqual(
		getCSSRules(keyWord),
		keyWordAnimationDefinition,
		'returns correct css rules for keyword-stylesheet'
	);

	t.deepEqual(
		getCSSRules(crossDomain),
		crossDomainAnimationDefinition,
		'returns correct css rules for cross-domain-stylesheet'
	);

	t.deepEqual(
		getCSSRules(crossDomainUnsafe),
		crossDomainUnsafeAnimationDefinition,
		'returns correct css rules for cross-domain-unsafe-stylesheet'
	);

	t.end();
});
