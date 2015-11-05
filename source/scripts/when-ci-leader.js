import chalk from 'chalk';


function isLeader(jobNumber = '') {
	const fragments = jobNumber.split('.');
	return fragments[fragments.length - 1] === '1';
}

function main() {
	const job = process.env.TRAVIS_JOB_NUMBER;

	if (!job) {
		console.log(`  ${chalk.green('✔')}   Skipping, "$TRAVIS_JOB_NUMBER" is not defined.`);
		throw new Error(1);
	}

	if (!isLeader(job)) {
		console.log(`  ${chalk.green('✔')}   Skipping, job "${job}" is not the leader.`);
		throw new Error(1);
	}

	if (isLeader(process.env.TRAVIS_JOB_NUMBER)) {
		return;
	}
}

try {
	main();
} catch (err) {
	process.exit(1);
}
