import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';
import nodeListStub from './stubs/node-list.js';

import JogWheel from '../../library/index.js';

tape('constructor', t => {
	t.throws(() => {
		new JogWheel(undefined, windowStub, documentStub); // eslint-disable-line no-new
	}, 'should throw when called without element');

	t.doesNotThrow(() => {
		new JogWheel(elementStub, {}, windowStub, documentStub); // eslint-disable-line no-new
	}, 'should not throw when called with element');

	t.doesNotThrow(() => {
		new JogWheel(nodeListStub, {}, windowStub, documentStub); // eslint-disable-line no-new
	}, 'should not throw when called with node-list');

	t.end();
});
