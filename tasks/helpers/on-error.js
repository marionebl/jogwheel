var util = require('gulp-util');
var notifier = require('node-notifier');

var defaults = {
	fails: true,
	notifies: false
};

module.exports = function (options) {
	options = Object.assign({}, defaults, options);

	return function (err) {
		if (!err) {
			return;
		}

		if (options.notifies) {
			notifier.notify({
				title: err.plugin,
				message: err.message,
				sound: true
			});
		}

		if (!err.logged) {
			var plugin = util.colors.red('[' + err.plugin + ']');
			var meta = util.colors.grey(' [' + err.fileName + ':' + err.lineNumber + ']');
			util.log([plugin, err.message, meta].join(' '));
		}

		if (err.stack) {
			util.log(util.colors.grey(err.stack));
		}

		if (options.fails) {
			throw err;
		}

		if (this.end) {
			this.end();
		}
	};
};
