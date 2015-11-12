module.exports = function (gulp, paths) {
	return function copyStatic() {
		/* @desc copy public static assets */
		return gulp.src(paths.source['public-static'])
			.pipe(gulp.dest(paths.target.public));
	};
};
