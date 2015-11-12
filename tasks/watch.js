var sequence = require('gulp-sequence');
var util = require('gulp-util');
var onError = require('./helpers/on-error');
var shell = require('shelljs');

function values(object) {
	return Object.keys(object)
		.map(function (key) {
			return object[key];
		});
}

function getUpdatePages(gulp, paths) {
	return function updatepages(cb) {
		shell.exec('node ' + paths.executable.pages + ' --local', cb);
	};
}

module.exports = function (gulp, paths) {
	var task = require('./helpers/task')(gulp);
	var build = require('./build')(gulp, paths, {fails: true, notifies: true});

	return function watch(cb) {
		/* @desc execute sequence after changes */
		var watchOptions = {fails: false, notifies: true};
		var transpile = require('./transpile')(gulp, paths, watchOptions);
		var test = require('./test')(gulp, paths, watchOptions);
		var lint = require('./lint')(gulp, paths, watchOptions);
		var copy = require('./copy')(gulp, paths, watchOptions);
		var updatePages = getUpdatePages(gulp, paths, watchOptions);

		return sequence(
			task(build, 'first-run'),
			task(updatePages, 'pages-first-run'),
			task(function () {
				gulp.watch(
					values(paths.source),
					function () {
						sequence(
							[
								task(copy),
								task(lint),
								task(transpile)
							],
							[
								task(updatePages),
								task(test)
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
