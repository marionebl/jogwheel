module.exports = function (gulp, paths) {
	return function copyExamples() {
		/* @desc copy static files to distribution */
		return gulp.src(paths.source.example)
			.pipe(gulp.dest(paths.target.example));
	};
};
