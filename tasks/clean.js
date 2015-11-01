var del = require('del');

module.exports = function (gulp, paths) {
	return function clean() {
		/* @desc clean all build results from project */
		var cleanPaths = [paths.clean.documentation, paths.clean.distribution];
		return del(cleanPaths);
	};
};
