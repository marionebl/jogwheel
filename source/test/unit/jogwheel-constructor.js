import tape from 'tape';

import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';

import JogWheel from '../../library/index.js';

tape('constructor', t => {
	t.throws(() => {
		const instance = new JogWheel(undefined, windowStub, documentStub);
		instance.unplug();
	}, 'should throw when called without element');

	t.doesNotThrow(() => {
		const instance = new JogWheel(elementStub, {}, windowStub, documentStub);
		instance.unplug();
	}, 'should not throw when called with element');

	t.end();
});
