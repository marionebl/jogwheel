import chalk from 'chalk';

function main() {
	const job = process.env.TRAVIS_JOB_NUMBER;

	if (!job) {
		throw new Error(1);
	}

	return;
}

try {
	main();
} catch (err) {
	process.exit(1);
}
