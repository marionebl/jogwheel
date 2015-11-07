import chalk from 'chalk';
import minimist from 'minimist';

function isLeader(jobNumber = '') {
	const fragments = jobNumber.split('.');
	return fragments[fragments.length - 1] === '1';
}

function isTrusted() {
	return process.env.TRAVIS_SECURE_ENV_VARS === 'true';
}

function main(options) {
	const job = process.env.TRAVIS_JOB_NUMBER;

	if (!job) {
		console.log(`  ${chalk.yellow('⚠')}   Skipping, "$TRAVIS_JOB_NUMBER" is not defined.`);
		throw new Error(1);
	} else {
		console.log(`  ${chalk.green('✔')}   Job number is "${job}".`);
	}

	if (options.leader && !isLeader(job)) {
		console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" is not the leader. ${chalk.gray('[--leader]')}`);
		throw new Error(1);
	} else if (options.leader) {
		console.log(`  ${chalk.green('✔')}   Job "${job}" is the leader. ${chalk.gray('[--leader]')}`);
	}

	if (options.trusted && !isTrusted(job)) {
		console.log(`  ${chalk.yellow('⚠')}   Skipping, job "${job}" has no secure env variables. ${chalk.grey('[--trusted]')}`);
		throw new Error(1);
	} else if (options.trusted) {
		console.log(`  ${chalk.green('✔')}   Job "${job}" has secure env variables. ${chalk.grey('[--trusted]')}`);
	}

	if (isLeader(process.env.TRAVIS_JOB_NUMBER)) {
		return;
	}
}

try {
	main(minimist(process.argv.slice(2)));
} catch (err) {
	process.exit(1);
}
