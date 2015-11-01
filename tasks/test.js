var tape = require('gulp-tape');
var spec = require('tap-spec');
var onError = require('./helpers/on-error');

module.exports = function (gulp, paths, options) {
	return function test() {
		/* @desc execute the test suite */
		return gulp.src(paths.executable.unit)
			.pipe(tape({reporter: spec()}))
			.on('error', onError(options));
	};
};
