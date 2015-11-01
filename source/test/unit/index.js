import tape from 'tape-catch';

import JogWheel from '../../library/index.js';
import getPlayer from '../../library/get-player.js';

const playerStub = {
	play() {

	},
	pause() {

	},
	effect: {
		currentTime: 0,
		activeDuration: 0
	}
};

const elementStub = {
	style: {},
	animate() {
		return playerStub;
	}
};

tape('get-player', t => {
	t.ok(typeof getPlayer(elementStub) === 'object', 'should return an object');
	t.end();
});

tape('constructor', t => {
	t.throws(() => {
		const instance = new JogWheel();
		instance.unplug();
	}, 'should throw when called without element');

	t.doesNotThrow(() => {
		const instance = new JogWheel(elementStub);
		instance.unplug();
	}, 'should not throw when called with element');

	t.end();
});

tape('JogWheel.create', t => {
	t.ok(
		JogWheel.create(elementStub) instanceof JogWheel,
		'should return an instance of JogWheel');
	t.end();
});

tape('instance.play', t => {
	const instance = JogWheel.create(elementStub);
	t.ok(
		instance.play() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});

tape('instance.pause', t => {
	const instance = JogWheel.create(elementStub);
	t.ok(
		instance.pause() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});

tape('instance.seek', t => {
	const instance = JogWheel.create(elementStub);
	t.ok(
		instance.seek() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});

tape('instance.unplug', t => {
	const instance = JogWheel.create(elementStub);
	t.ok(
		instance.unplug() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});

tape('instance.render', t => {
	const instance = JogWheel.create(elementStub);
	t.ok(
		instance.render() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});
