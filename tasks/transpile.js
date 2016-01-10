var babel = require('gulp-babel');
var cached = require('gulp-cached');
var sourcemaps = require('gulp-sourcemaps');
var remember = require('gulp-remember');
var sequence = require('gulp-sequence');
var onError = require('./helpers/on-error');

function babelTask(gulp, source, target, options) {
	var name = 'transpile:' + [source, target].join(' → ');
	gulp.task(name, function () {
		return gulp.src(source)
			.pipe(cached(name))
//			.pipe(sourcemaps.init())
			.pipe(babel().on('error', onError(options)))
//			.pipe(sourcemaps.write('.'))
			.pipe(remember(name))
			.pipe(gulp.dest(target));
	});
	return name;
}

module.exports = function (gulp, paths, options) {
	return function transpile(cb) {
		/* @desc transpile sources */
		return sequence([
			babelTask(gulp, paths.source.library, paths.target.library, options),
			babelTask(gulp, paths.source.scripts, paths.target.scripts, options),
			babelTask(gulp, paths.source.test, paths.target.test, options)
		])(cb);
	};
};
