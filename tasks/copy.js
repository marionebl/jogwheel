module.exports = function (gulp, paths) {
	return function copy() {
		/* @desc copy static files to distribution */
		return gulp.src(paths.source.static)
			.pipe(gulp.dest(paths.target.distribution));
	};
};
