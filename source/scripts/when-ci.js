import 'babel-polyfill';
import chalk from 'chalk';
import minimist from 'minimist';
import globby from 'globby';
import shell from 'shelljs';

function isLeader(jobNumber = '') {
	const fragments = jobNumber.split('.');
	return fragments[fragments.length - 1] === '1';
}

function isTrusted() {
	return process.env.TRAVIS_SECURE_ENV_VARS === 'true';
}

function isNoPullRequest() {
	return process.env.TRAVIS_PULL_REQUEST === 'false';
}

async function main(options) {
	const job = process.env.TRAVIS_JOB_NUMBER;

	if (!job) {
		console.log(`  ${chalk.yellow('⚠')}   Skipping, "$TRAVIS_JOB_NUMBER" is not defined.`);
		throw new Error(1);
	} else {
		console.log(`  ${chalk.green('✔')}   Job number is "${job}".`);
	}

	if (options.leader) {
		if  (!isLeader(job)) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" is not the leader. ${chalk.gray('[--leader]')}`);
			throw new Error(1);
		} else if (options.leader) {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is the leader. ${chalk.gray('[--leader]')}`);
		}
	}

	if (options['pull-request'] === false) {
		if (!isNoPullRequest()) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, "${job}" is a pull request. ${chalk.gray('[--no-pull-request]')}`);
			throw new Error(1);
		} else {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is no pull request. ${chalk.gray('[--no-pull-request]')}`);
		}
	}

	if (options.trusted) {
		if (!isTrusted(job)) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" has no secure env variables. ${chalk.grey('[--trusted]')}`);
			throw new Error(1);
		} else {
			console.log(`  ${chalk.green('✔')}   Job "${job}" has secure env variables. ${chalk.grey('[--trusted]')}`);
		}
	}

	if (options.master) {
		if (process.env.TRAVIS_BRANCH !== "master") {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" on branch "${process.env.TRAVIS_BRANCH}", not master. ${chalk.grey('[--master]')}`);
			throw new Error(1);
		} else if (!isNoPullRequest()) {
			console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" on branch "master", but pull-request. ${chalk.grey('[--master]')}`);
			throw new Error(1);
		} else {
			console.log(`  ${chalk.green('✔')}   Job "${job}" is on branch master. ${chalk.grey('[--trusted]')}`);
		}
	}

	if (options.changed) {
		const pattern = typeof options.changed === 'string' ? options.changed.split(',') : ['**/*', '!node_modules/**'];

		if (!process.env.TRAVIS_COMMIT) {
			console.log(`  ${chalk.yellow('⚠')}   Changed argument "${options.changed}" given, but "process.env.TRAVIS_COMMIT" is not defined, ignoring "changed" filter. ${chalk.grey('[--changed]')}`);
			throw new Error(1);
		} else {
			const command = `git diff-tree --no-commit-id --name-only -r ${process.env.TRAVIS_COMMIT}`;
			const changedFiles = shell.exec(command, {silent: true}).output.split('\n');
			const searchedFiles = await globby(pattern);
			const intersection = searchedFiles.filter((searchedFile) => changedFiles.indexOf(searchedFile) > -1);

			if (intersection.length > 0 || intersection.length === 0 && options.changed === true) {
				console.log(`  ${chalk.green('✔')}   Commit ${process.env.TRAVIS_COMMIT} has ${intersection.length} changed files matching ${pattern}. ${chalk.grey('[--changed]')}`);
			} else {
				console.log(`  ${chalk.yellow('⚠')}   Commit ${process.env.TRAVIS_COMMIT} has no changed files matching ${pattern}. ${chalk.grey('[--changed]')}`);
				throw new Error(1);
			}
		}
	}

	if (options.dirty) {
		const pattern = typeof options.dirty === 'string' ? options.dirty.split(',') : ['**/*', '!node_modules/**'];

		const command = `git status --porcelain | sed s/^...//`;
		const changedFiles = shell.exec(command, {silent: true}).output.split('\n');
		const searchedFiles = await globby(pattern);
		const intersection = searchedFiles.filter((searchedFile) => changedFiles.indexOf(searchedFile) > -1);

		if (intersection.length > 0 || intersection.length === 0 && options.changed === true) {
			console.log(`  ${chalk.green('✔')}   ${intersection.length} dirty files matching ${pattern}. ${chalk.grey('[--dirty]')}`);
		} else {
			console.log(`  ${chalk.yellow('⚠')}   No dirty files matching ${pattern}. ${chalk.grey('[--dirty]')}`);
			throw new Error(1);
		}
	}
}

const args = minimist(process.argv.slice(2));

main(args)
	.catch(err => {
		if (err.message !== '1') {
			console.error(err.message);
			console.trace(err.trace);
		}
		process.exit(1);
	});
