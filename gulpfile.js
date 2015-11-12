/**
 * This gulpfile bootstraps the tasks found in './tasks'
 * using the configuration in ./.gulprc
 * Please adapt configuration in ./gulprc
 */
var resolve = require('path').resolve;
var rc = require('rc');
var gulp = require('gulp');
var util = require('gulp-util');

// Helpers
var task = require('./tasks/helpers/task')(gulp);

// Get configuration
var config = rc('gulp', {
	paths: {},
	tasks: {
		directory: 'tasks',
		public: []
	}
});

// Iterate gulp task config
config.tasks.public.forEach(function(taskDefinition){
	var isAliased = Array.isArray(taskDefinition);
	var taskName = isAliased ? taskDefinition[0] : taskDefinition;
	var taskAliases = isAliased ? (taskDefinition[1] || []).concat([taskName]) : [taskName];
	var taskOptions = isAliased ? (taskDefinition[2] || {}) : {};
	var taskFile = resolve(config.tasks.directory, taskName + '.js');
	var taskFactory, taskFunction;

	try {
		taskFactory = require(taskFile);
	} catch(err) {
		util.log('Could not load task "' + taskName +'" from "' + taskFile + '":');
		util.log(err);
		util.log(err.stack);
		return;
	}

	if (typeof taskFactory !== 'function') {
		util.log('Could not load task "' + taskName +'" from "' + taskFile + '", does not export factory function.');
		util.log(err.stack);
		return;
	}

	try {
		taskFunction = taskFactory(gulp, config.paths, taskOptions);
	} catch(err) {
		util.log('Could not initialize task function "' + taskName +'" from "' + taskFile + '":');
		util.log(err);
		util.log(err.stack);
		return;
	}

	task(taskFunction, taskAliases, taskOptions);
});
