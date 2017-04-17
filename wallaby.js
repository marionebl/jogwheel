const babelConfig = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '.babelrc')));
babelConfig.babel = require('babel');

module.exports = function (wallaby) {
	return {
		files: [
			{pattern: 'source/library/*.js'}
		],
		tests: [
			{pattern: 'source/test/unit/*.js'}
		],
		compilers: {
			'**/*.js': wallaby.compilers.babel(babelConfig)
		},
		env: {
			type: 'node',
			runner: 'node'
		}
	};
};
