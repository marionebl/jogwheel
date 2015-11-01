var eslint = require('gulp-eslint');
var onError = require('./helpers/on-error');

module.exports = function (gulp, paths, options) {
	return function lint() {
		var fail = options.fails ? 'failOnError' : 'failAfterError';

		/* @desc lint sources */
		return gulp.src([paths.source.library, paths.source.test])
			.pipe(eslint())
			.pipe(eslint.format())
			.pipe(eslint[fail]().on('error', onError(options)))
			.on('error', onError(options));
	};
};
