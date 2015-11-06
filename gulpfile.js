var gulp = require('gulp');
var sequence = require('gulp-sequence');

var paths = {
	// sources
	source: {
		entry: 'source/library/index.js',
		library: 'source/library/**/*.js',
		test: 'source/test/**/*.js',
		scripts: 'source/scripts/**/*.js',
		documentation: 'source/**/*.tpl',
		coverage: 'distribution/library/**/*.js'
	},
	// clean targets
	clean: {
		documentation: '*.md',
		distribution: 'distribution'
	},
	// targets
	target: {
		root: '.',
		library: 'distribution/library/',
		test: 'distribution/test/',
		scripts: 'distribution/scripts/',
	},
	// executables
	executable: {
		unit: 'distribution/test/unit/index.js'
	}
};

// Helpers
var task = require('./tasks/helpers/task')(gulp);

// Gulp tasks
var transpile = require('./tasks/transpile')(gulp, paths);
var test = require('./tasks/test')(gulp, paths);
var clean = require('./tasks/clean')(gulp, paths);
var documentation = require('./tasks/documentation')(gulp, paths);
var lint = require('./tasks/lint')(gulp, paths);
var list = require('./tasks/list')(gulp, paths);
var build = require('./tasks/build')(gulp, paths);
var watch = require('./tasks/watch')(gulp, paths);

// Register public tasks
task(clean);
task(transpile);
task(test);
task(documentation);
task(lint);
task(build);
task(watch, ['watch', 'default']);
task(list, ['list', 'help'])
