import tape from 'tape';
import createTrap from '../../library/create-trap';

tape('create-trap', t => {
	t.equals(
		typeof createTrap({}, 'trap', () => {}),
		'object',
		'should return an object'
	);

	t.equals(
		typeof createTrap({}, 'trap', () => {}).trap,
		'object',
		'should return an object with trapped property of type object'
	);

	t.test('when writing a trapped property object', test => {
		const host = {trap: {trapped: true}};
		const calls = [];

		const prison = createTrap(host, 'trap', (...args) => {
			calls.push(args);
		});

		prison.trap.trapped = false;

		t.ok(
			prison.trap.trapped,
			'should not write property on trapped object'
		);

		setTimeout(() => {
			test.equals(
				calls.length,
				2,
				'should call the warden function twice'
			);

			test.deepEquals(
				calls[0][0],
				host,
				'should be called with correct host object'
			);

			test.deepEquals(
				calls[1][0],
				host,
				'should be called with correct host object'
			);

			test.equals(
				calls[0][1],
				'trapped',
				'should be called with correct propertyName'
			);

			test.equals(
				calls[1][1],
				'trapped',
				'should be called with correct propertyName'
			);

			test.end();
		});
	});
});
