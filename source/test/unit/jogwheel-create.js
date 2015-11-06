import tape from 'tape';

import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';
import JogWheel from '../../library/index.js';

tape('JogWheel.create', t => {
	t.ok(
		JogWheel.create(elementStub, {}, windowStub, documentStub) instanceof JogWheel,
		'should return an instance of JogWheel');

	t.end();
});
