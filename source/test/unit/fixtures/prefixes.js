export default [
	{
		prefix: 'Moz',
		unprefixed: 'transition',
		prefixed: 'MozTransition',
		available: 'animationName',
		style: {
			animationName: null,
			MozTransition: null
		}
	},
	{
		prefix: 'Webkit',
		unprefixed: 'transition',
		prefixed: 'WebkitTransition',
		available: 'transitionDuration',
		style: {
			transitionDuration: null,
			WebkitTransition: null
		}
	},
	{
		prefix: 'ms',
		unprefixed: 'transition',
		prefixed: 'msTransition',
		available: 'borderRadius',
		style: {
			borderRadius: null,
			msTransition: null
		}
	}
];
