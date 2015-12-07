var sequence = require('gulp-sequence');

module.exports = function (gulp, paths, options) {
	options = Object.assign({}, options, {fails: true});

	var args = [].slice.call(arguments);

	var task = require('./helpers/task')(gulp);
	var clean = require('./clean').apply(null, args);
	var lint = require('./lint').apply(null, args);
	var documentation = require('./documentation').apply(null, args);
	var transpile = require('./transpile').apply(null, args);
	var copy = require('./copy').apply(null, args);
	var copyExample = require('./copy-example').apply(null, args);
	var copyStatic = require('./static').apply(null, args);
	var html = require('./html').apply(null, args);
	var css = require('./css').apply(null, args);
	var testCSS = require('./test-css').apply(null, args);
	var pack = require('./pack').apply(null, args);
	var test = require('./test').apply(null, args);

	return function build(done) {
		return sequence(
			task(clean),
			[
				task(copy),
				task(copyStatic, 'copy-static'),
				task(copyExample, 'copy-example'),
				task(lint),
				task(css),
				task(testCSS, 'test-css'),
				task(
					sequence(
						task(documentation),
						task(html)
					),
				'docs-html'),
				task(sequence(
					task(transpile),
					task(sequence(
						[
							task(pack),
							task(test)
						]
					), 'test-pack')),
					'transpile-test-pack')
			]
		)(done);
	};
};
