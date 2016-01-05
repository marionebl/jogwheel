import tape from 'tape';
import convertAnimationIterations from '../../library/convert-animation-iterations.js';

tape('convert-animation-iterations', t => {
	t.equal(
		typeof convertAnimationIterations(),
		'number',
		'should return a number'
	);

	t.equal(
		convertAnimationIterations(),
		1,
		'should default to 1'
	);

	t.equal(
		convertAnimationIterations('infinite'),
		Infinity,
		'should return Infinity for "infinite"'
	);

	t.end();
});
