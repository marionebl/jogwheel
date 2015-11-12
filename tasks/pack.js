var path = require('path');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

module.exports = function (gulp, paths, options) {
	return function pack() {
		/* @desc pack js sources for browser consumption */
		var relPath = path.relative('source/documentation', paths.source['public-js']);

		var bundler = browserify({
			entries: paths.source['public-js'],
			transform: ['babelify']
		});

		if (options.watch) {
			bundler = watchify(bundler);
		}

		return bundler
			.bundle()
			.pipe(source(relPath))
			.pipe(gulp.dest(paths.target.public));
	};
};
