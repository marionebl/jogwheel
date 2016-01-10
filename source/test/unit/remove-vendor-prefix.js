import tape from 'tape';

import removeVendorPrefix from '../../library/remove-vendor-prefix';

tape('remove-vendor-prefix', t => {
	t.equals(
		typeof removeVendorPrefix(),
		'string',
		'should return a string'
	);

	t.equals(
		removeVendorPrefix('border-radius'),
		'border-radius',
		'should return an unprefixed property unaltered'
	);

	t.equals(
		removeVendorPrefix('-webkit-border-radius'),
		'border-radius',
		'should return the unprefixed property'
	);

	t.equals(
		removeVendorPrefix('-moz-border-radius'),
		'border-radius',
		'should return the unprefixed property'
	);

	t.equals(
		removeVendorPrefix('-ms-border-radius'),
		'border-radius',
		'should return the unprefixed property'
	);

	t.end();
});
