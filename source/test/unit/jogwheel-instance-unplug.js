import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';

import jogwheel from '../../library/';

tape('instance.unplug', t => {
	const instance = jogwheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.unplug(windowStub, documentStub) === instance,
		'should return the jogwheel instance'
	);
	t.end();
});
