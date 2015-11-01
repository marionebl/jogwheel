var sequence = require('gulp-sequence');
var util = require('gulp-util');
var onError = require('./helpers/on-error');

module.exports = function (gulp, paths) {
	var task = require('./helpers/task')(gulp);
	var build = require('./build')(gulp, paths, {fails: true, notifies: true});

	return function watch(cb) {
		/* @desc execute sequence after changes */
		var watchOptions = {fails: false, notifies: true};
		var transpile = require('./transpile')(gulp, paths, watchOptions);
		var test = require('./test')(gulp, paths, watchOptions);
		var lint = require('./lint')(gulp, paths, watchOptions);

		return sequence(
			task(build, 'first-run'),
			task(function () {
				gulp.watch([
					paths.source.library,
					paths.source.test,
					paths.source.scripts
				], function () {
					sequence(
						[
							task(lint),
							task(transpile)
						],
						task(test)
					)(onError(watchOptions));
				});
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
