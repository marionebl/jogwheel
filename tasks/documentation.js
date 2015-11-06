var merge = require('lodash.merge');

var cached = require('gulp-cached');
var remember = require('gulp-remember');

var data = require('gulp-data');
var template = require('gulp-template');
var extension = require('gulp-ext-replace');
var rename = require('gulp-rename');

var pkg = require('../package');
var header = require('./partials/header');
var footer = require('./partials/footer');
var badges = require('./partials/badges');

module.exports = function (gulp, paths) {
	var props = {
		paths: paths,
		gulp: gulp,
		pkg: merge({}, pkg, pkg.config.documentation),
		helpers: {

		}
	};

	props.partials = {
		header: header(props),
		footer: footer(props),
		badges: badges(props)
	};

	return function documentation() {
		/* @desc build markdown from sources */
		return gulp.src(paths.source.documentation)
			.pipe(cached('documentation'))
			.pipe(data({
				props: props
			}))
			.pipe(template())
			.pipe(remember('documentation'))
			.pipe(extension('.md'))
			.pipe(rename(function(pathInfo){
				if (pathInfo.basename[0] === '_') {
					pathInfo.basename = pathInfo.basename.slice(1);
				}
			}))
			.pipe(gulp.dest(paths.target.root));
	};
};
