var util = require('gulp-util');

module.exports = function (gulp) {
	return function list() {
		/* @desc list all public tasks */
		var tasks = Object.keys(gulp.tasks || {})
			.reduce(function (results, taskName) {
				var task = gulp.tasks[taskName];
				var match = String(task.fn).match(/\/\*\s@desc\s(.*)?\s\*\//);

				return results.concat({
					name: task.name,
					description: match ? match[1] : '',
					fn: task.fn
				});
			}, []);

		var length = tasks.map(function (task) {
			return task.name.length;
		}).sort(function (a, b) {
			return b - a;
		})[0];

		var format = util.colors.cyan.bold;

		util.log('');
		util.log(util.colors.bold('Tasks'));

		tasks.forEach(function (task) {
			var aliases = tasks
				.filter(function (alias) {
					return alias !== task && alias.fn === task.fn;
				})
				.map(function (alias) {
					return alias.name;
				});

			var aliasList = aliases.length ? 'also: [' + aliases.join(', ') + ']' : '';
			var spacing = new Array(length + 4 - task.name.length).join(' ');
			util.log(`    ${format(task.name)}${spacing}– ${task.description} ${util.colors.bold.grey(aliasList)}`);
		});
		util.log('');
	};
};
