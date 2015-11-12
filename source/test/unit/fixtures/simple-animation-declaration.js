import cssStyleRules from '../stubs/css-style-rules';

export default [{
	cssRules: [{
		name: 'default-animation',
		type: 7,
		cssRules: [
			{
				keyText: '0%',
				style: cssStyleRules({
					height: '0',
					width: '0',
					length: 2
				})
			},
			{
				keyText: '100%',
				style: cssStyleRules({
					height: '100px',
					width: '100px',
					length: 2
				})
			}
		]
	}]
}];

export const keyframes = [
	{
		offset: 0,
		height: '0',
		width: '0'
	},
	{
		offset: 1,
		height: '100px',
		width: '100px'
	}
];

export const animation = [
	{
		offset: 0,
		height: '0',
		width: '0'
	},
	{
		offset: 1,
		height: '100px',
		width: '100px'
	}
];
