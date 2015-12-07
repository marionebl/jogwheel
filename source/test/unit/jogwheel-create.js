import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';
import jogwheel from '../../library/index.js';

tape('jogwheel.create', t => {
	t.ok(
		jogwheel.create(elementStub, {}, windowStub, documentStub) instanceof jogwheel,
		'should return an instance of jogwheel');

	t.end();
});
