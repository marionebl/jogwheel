var sequence = require('gulp-sequence');

module.exports = function (gulp, paths, options) {
	options = Object.assign({}, options, {fails: true});

	var task = require('./helpers/task')(gulp);
	var clean = require('./clean')(gulp, paths, options);
	var lint = require('./lint')(gulp, paths, options);
	var documentation = require('./documentation')(gulp, paths, options);
	var transpile = require('./transpile')(gulp, paths, options);
	var test = require('./test')(gulp, paths, options);
	var copy = require('./copy')(gulp, paths, options);

	return function build(done) {
		return sequence(
			task(clean),
			[
				task(copy),
				task(lint),
				task(documentation),
				task(transpile)
			]
		)(done);
	};
};
