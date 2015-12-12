var path = require('path');
var merge = require('lodash.merge');
var async = require('async');
var documentationjs = require('documentation');
var shell = require('shelljs');

var cached = require('gulp-cached');
var remember = require('gulp-remember');

var data = require('gulp-data');
var template = require('gulp-template');
var extension = require('gulp-ext-replace');
var rename = require('gulp-rename');
var globby = require('globby');
var request = require('sync-request');

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

	function getApiDocumentation(entry, formats, callback) {
		async.waterfall([
			function (cb) {
				documentationjs(entry, {
					private: false,
					github: false
				}, cb);
			},
			function (comments, cb) {
				async.reduce(formats, {}, function (result, format, callback) {
					documentationjs.formats[format](comments, {}, function (err, formatted) {
						if (err) {
							return callback(err);
						}
						result[format] = formatted;
						callback(err, result);
					});
				}, cb);
			}
		], callback);
	}

	return function documentation(done) {
		/* @desc build markdown from sources */
		getApiDocumentation(paths.source.entry, ['md', 'json', 'html'], function (err, docs) {
			if (err) {
				return done(err);
			}

			props.pkg.tag = props.pkg.version ? 'v' + props.pkg.version : shell.exec('git describe --abbrev=0 --tags', {silent: true}).output.split('\n')[0];

			var exampleFiles = globby.sync(paths.source.example);

			var examples = exampleFiles.reduce(function(registry, exampleFile){
				var name = path.basename(exampleFile, path.extname(exampleFile));
				var uri = path.relative(paths.target.root, exampleFile)
					.split(path.sep).slice(1).join('/');

				var host = props.pkg.config.documentation.host;
				var url = 'https://' + host + '/' + props.pkg.name + '/' + uri;

				var response = request('POST', 'https://git.io', {
					body: 'url=' + url
				});

				url = response.headers.location || url;

				var amendment = {};
				amendment[name] = url;

				return Object.assign(registry, amendment);
			}, {});

			gulp.src(paths.source.documentation)
				.pipe(cached('documentation'))
				.pipe(data({
					props: props,
					docs: docs,
					examples: examples
				}))
				.pipe(template())
				.pipe(remember('documentation'))
				.pipe(extension('.md'))
				.pipe(rename(function (pathInfo) {
					if (pathInfo.basename[0] === '_') {
						pathInfo.basename = pathInfo.basename.slice(1);
					}
				}))
				.pipe(gulp.dest(paths.target.root))
				.on('end', done);
		});
	};
};
