import cssStyleRules from '../stubs/css-style-rules';

export default [{
	cssRules: [{
		name: 'default-animation',
		type: 7,
		cssRules: [
			{
				keyText: 'from, to',
				style: cssStyleRules({
					'height': '0',
					'width': '0',
					'margin-top': '10px',
					'length': 3
				})
			},
			{
				keyText: '50%',
				style: cssStyleRules({
					'height': '100px',
					'width': '100px',
					'margin-top': '20px',
					'length': 3
				})
			}
		]
	}]
}];

export const keyframes = [
	[
		{
			offset: 0,
			height: '0',
			width: '0',
			marginTop: '10px'
		},
		{
			offset: 1,
			height: '0',
			width: '0',
			marginTop: '20px'
		}
	],
	{
		offset: 0.5,
		height: '100px',
		width: '100px',
		marginTop: '10px'
	}
];

export const animation = [
	{
		offset: 0,
		height: '0',
		width: '0',
		marginTop: '10px'
	},
	{
		offset: 1,
		height: '0',
		width: '0',
		marginTop: '10px'
	},
	{
		offset: 0.5,
		height: '100px',
		width: '100px',
		marginTop: '20px'
	}
];
