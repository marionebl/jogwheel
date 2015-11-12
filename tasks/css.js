var next = require('gulp-cssnext');

module.exports = function (gulp, paths, options) {
	return function postcss() {
		/* @desc postprocess css sources */
		return gulp.src(paths.source['public-css'])
			.pipe(next())
			.pipe(gulp.dest(paths.target.public));
	};
};
