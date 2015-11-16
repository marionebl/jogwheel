var sequence = require('gulp-sequence');
var util = require('gulp-util');
var flatten = require('lodash.flatten');
var onError = require('./helpers/on-error');

function values(object) {
	return Object.keys(object)
		.map(function (key) {
			return object[key];
		});
}

module.exports = function (gulp, paths, options, cli) {
	var task = require('./helpers/task')(gulp);
	var build = require('./build')(gulp, paths, {fails: true, notifies: true}, cli);

	return function watch(cb) {
		/* @desc execute sequence after changes */
		var watchOptions = {fails: false, notifies: true, watch: true};
		var transpile = require('./transpile')(gulp, paths, watchOptions, cli);
		var documentation = require('./documentation')(gulp, paths, watchOptions, cli);
		var lint = require('./lint')(gulp, paths, watchOptions, cli);
		var test = require('./test')(gulp, paths, watchOptions, cli);
		var copy = require('./copy')(gulp, paths, watchOptions, cli);
		var copyStatic = require('./static')(gulp, paths, watchOptions, cli);
		var html = require('./html')(gulp, paths, watchOptions, cli);
		var css = require('./css')(gulp, paths, watchOptions, cli);
		var pack = require('./pack')(gulp, paths, watchOptions, cli);

		var excludeGlobs = flatten(values(paths.exclude)).map(function (glob) {
			return '!' + glob;
		});

		var watchGlobs = flatten(values(paths.source));

		return sequence(
			task(build, 'first-run'),
			task(function () {
				gulp.watch(
					watchGlobs.concat(excludeGlobs),
					function () {
						sequence(
							[
								task(copy),
								task(copyStatic, 'copy-static'),
								task(lint),
								task(css),
								task(sequence(
									task(documentation),
									task(html)), 'docs-html'),
								task(sequence(
									task(transpile),
									task(sequence(
										[
											task(pack),
											task(test)
										]
									), 'test-pack')),
									'transpile-test-pack')
							]
						)(onError(watchOptions));
					}
				);
			}, 'watch-setup')
		)(function (err) {
			if (err) {
				return cb(err);
			}

			util.log('Watching sources for changes, happy hacking ✊');
			cb(null);
		});
	};
};
