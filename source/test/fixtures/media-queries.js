export default [{
	cssRules: [{
		type: 1,
		styles: {
			animationName: 'default-animation'
		}
	},
	{
		type: 4,
		media: 'screen and (min-width: 768px)',
		cssRules: [{
			type: 1,
			styles: {
				animationName: 'mid-animation'
			}
		}]
	}, {
		type: 4,
		media: 'screen and (min-width: 1024px)',
		cssRules: [{
			type: 1,
			styles: {
				animationName: 'max-animation'
			}
		}]
	}, {
		name: 'default-animation',
		type: 7,
		cssRules: [
			{
				keyText: '0%',
				style: {
					height: '0',
					width: '0',
					length: 2
				}
			},
			{
				keyText: '100%',
				style: {
					height: '100px',
					width: '100px',
					length: 2
				}
			}
		]
	}, {
		name: 'mid-animation',
		type: 7,
		cssRules: [
			{
				keyText: '0%',
				style: {
					height: '0',
					width: '0',
					length: 2
				}
			},
			{
				keyText: '100%',
				style: {
					height: '200px',
					width: '200px',
					length: 2
				}
			}
		]
	}, {
		name: 'max-animation',
		type: 7,
		cssRules: [
			{
				keyText: '0%',
				style: {
					height: '0',
					width: '0',
					length: 2
				}
			},
			{
				keyText: '100%',
				style: {
					height: '300px',
					width: '300px',
					length: 2
				}
			}
		]
	}]
}];
