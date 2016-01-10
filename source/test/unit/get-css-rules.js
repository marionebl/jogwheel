import tape from 'tape';

import getCSSRules from '../../library/get-css-rules.js';

import simple from './fixtures/simple-animation-declaration.js';

import keyWord from './fixtures/keyword-animation-declaration.js';

import crossDomain, {
	animation as crossDomainAnimationDefinition
} from './fixtures/cross-domain-stylesheets.js';

import crossDomainUnsafe, {
	animation as crossDomainUnsafeAnimationDefinition
} from './fixtures/cross-domain-unsafe-stylesheets.js';

tape('get-css-rules', t => {
	t.ok(
		Array.isArray(getCSSRules(simple[0])),
		'should return an array for simple-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(keyWord[0])),
		'should return an array for keyword-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(crossDomain)),
		'should return an array for cross-domain-stylesheet');

	t.ok(
		Array.isArray(getCSSRules(crossDomainUnsafe)),
		'should return an array for cross-domain-unsafe-stylesheet');

	t.doesNotThrow(
		() => getCSSRules(simple[0]),
		'should not fail for simple-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(keyWord[0]),
		'should not fail for keyword-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(crossDomain[0]),
		'should not fail for cross-domain-stylesheet'
	);

	t.doesNotThrow(
		() => getCSSRules(crossDomainUnsafe[0]),
		'should not fail for cross-domain-unsafe-stylesheet'
	);

	t.deepEqual(
		getCSSRules(simple[0]),
		simple[0].cssRules,
		'returns correct css rules for simple-stylesheet'
	);

	t.deepEqual(
		getCSSRules(keyWord[0]),
		keyWord[0].cssRules,
		'returns correct css rules for keyword-stylesheet'
	);

	t.deepEqual(
		getCSSRules(crossDomain[0]),
		crossDomainAnimationDefinition,
		'returns correct css rules for cross-domain-stylesheet'
	);

	t.deepEqual(
		getCSSRules(crossDomainUnsafe[0]),
		crossDomainUnsafeAnimationDefinition,
		'returns correct css rules for cross-domain-unsafe-stylesheet'
	);

	t.end();
});
