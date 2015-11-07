var babel = require('gulp-babel');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var sequence = require('gulp-sequence');
var onError = require('./helpers/on-error');
var rc = require('rc');
var config = rc('babel-gulp');
delete config.config;
delete config._;
delete config.configs;

function babelTask(gulp, source, target, options) {
	var name = 'transpile:' + [source, target].join(' → ');
	gulp.task(name, function () {
		return gulp.src(source)
			.pipe(cached(name))
			.pipe(babel(config).on('error', onError(options)))
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
