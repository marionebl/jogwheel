var cached = require('gulp-cached');
var remember = require('gulp-remember');

module.exports = function (gulp, paths, options) {
	return function copy() {
		/* @desc copy static files to distribution */
		return gulp.src(paths.source.static)
			.pipe(gulp.dest(paths.target.distribution));
	};
};
