import tape from 'tape';

import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub from './stubs/element.js';

import JogWheel from '../../library/';

tape('instance.render', t => {
	const instance = JogWheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.render() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});
