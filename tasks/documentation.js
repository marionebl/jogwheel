'use strict';

const path = require('path');
const merge = require('lodash.merge');
const async = require('async');
const documentationjs = require('documentation');
const shell = require('shelljs');

const cached = require('gulp-cached');
const remember = require('gulp-remember');

const data = require('gulp-data');
const template = require('gulp-template');
const extension = require('gulp-ext-replace');
const rename = require('gulp-rename');
const globby = require('globby');
const request = require('sync-request');

const pkg = require('../package');
const header = require('./partials/header');
const footer = require('./partials/footer');
const badges = require('./partials/badges');

module.exports = function (gulp, paths) {
	const props = {
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
				async.reduce(formats, {}, (result, format, callback) => {
					documentationjs.formats[format](comments, {}, (err, formatted) => {
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
		getApiDocumentation(paths.source.entry, ['md', 'json', 'html'], (err, docs) => {
			if (err) {
				return done(err);
			}

			props.pkg.tag = props.pkg.version ?
				`v${props.pkg.version}` :
				shell
					.exec('git describe --abbrev=0 --tags', {silent: true})
					.output.split('\n')[0];

			const exampleFiles = globby.sync(paths.source.example);

			const examples = exampleFiles.reduce((registry, exampleFile) => {
				const name = path.basename(exampleFile, path.extname(exampleFile));
				const uri = path.relative(paths.target.root, exampleFile)
					.split(path.sep).slice(1).join('/');

				const host = props.pkg.config.documentation.host;
				let url = `https://${host}/${props.pkg.name}/${uri}`;

				const response = request('POST', 'https://git.io', {
					body: `url=${url}`
				});

				url = response.headers.location || url;

				const amendment = {};
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
				.pipe(rename(pathInfo => {
					if (pathInfo.basename[0] === '_') {
						pathInfo.basename = pathInfo.basename.slice(1);
					}
				}))
				.pipe(gulp.dest(paths.target.root))
				.on('end', done);
		});
	};
};
