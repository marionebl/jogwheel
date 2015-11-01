var functionName = require('fn-name');

module.exports = function () {
	var environment = [].slice.call(arguments);
	var gulp = environment[0];
	/**
	 * Helper to create gulp tasks from named functions on the fly
	 * Allows for keeping tasks around as functions and keeping them private
	 * @param	{Function} fn named function that should be used as gulp task
	 * @param	{string}	 forced optional forced name for the task to create
	 * @return {string}	 name of the created task
	 */
	return function task(fn, forced) {
		var name = forced || functionName(fn);
		var names = Array.isArray(name) ? name : [name];

		names.forEach(function (name) {
			gulp.task(name, fn);
		});

		return name;
	};
};
