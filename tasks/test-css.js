var next = require('gulp-cssnext');

module.exports = function (gulp, paths) {
	return function postcss() {
		/* @desc postprocess test css sources */
		return gulp.src(paths.source['test-css'])
			.pipe(next())
			.pipe(gulp.dest(paths.target.test));
	};
};
