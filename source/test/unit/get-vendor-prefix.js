import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import prefixes from './fixtures/prefixes.js';

import getVendorPrefix, {prefix} from '../../library/get-vendor-prefix';

function getPrefixedDocument(prefix) {
	return {
		...documentStub,
		body: {
			style: {
				...documentStub.body.style,
				...prefix.style
			}
		}
	};
}

tape('get-vendor-prefix', t => {
	t.ok(
		typeof getVendorPrefix(windowStub, documentStub) === 'string',
		'should return a string'
	);

	t.comment('... given a document without prefixed style properties');
	t.equals(
		getVendorPrefix(windowStub, documentStub),
		'',
		'it should return an empty string'
	);

	t.comment('... given a document with prefixed style properties');

	prefixes.forEach(prefix => {
		const prefixedDocumentStub = getPrefixedDocument(prefix);

		t.equals(
			getVendorPrefix(windowStub, prefixedDocumentStub),
			prefix.prefix,
			'should return the correct prefix'
		);
	});

	t.end();
});

tape('prefix', t => {
	t.ok(
		typeof prefix('', windowStub, documentStub) === 'string',
		'should return a string'
	);
	t.end();

	t.comment('... given a document without prefixed style properties');
	t.equals(
		prefix('animationName', windowStub, documentStub),
		'animationName',
		'it should return the property unaltered'
	);

	prefixes.forEach(prefixData => {
		const prefixedDocumentStub = getPrefixedDocument(prefixData);

		t.equals(
			prefix(prefixData.unprefixed, windowStub, prefixedDocumentStub),
			prefixData.prefixed,
			'should return the correct prefixed property'
		);

		t.equals(
			prefix(prefixData.available, windowStub, prefixedDocumentStub),
			prefixData.available,
			'should return the unprefixed property if available'
		);
	});
});
