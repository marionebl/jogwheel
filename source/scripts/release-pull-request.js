import 'babel-polyfill';
import denodeify from 'denodeify';
import shell from 'shelljs';
import Github from 'github-api';
import chalk from 'chalk';
import minimist from 'minimist';
import pkg from '../../package.json';

function getHash() {
	return process.env.TRAVIS_COMMIT || shell.exec(`git rev-parse --verify HEAD`, {silent: true}).output.split('\n')[0].trim()
}

function getCommitMessage(hash = getHash()) {
	return shell.exec(`git log -1 --format=oneline ${hash}`, {silent: true}).output
		.split('\n')[0]
		.replace(hash, '')
		.trim();
}

async function main() {
	const start = Date.now();
	const version = pkg.version ? 'v' + pkg.version : shell.exec('git describe --abbrev=0 --tags', {silent: true}).output.split('\n')[0];
	const head = `release/${version}`;

	const remote = process.env.GH_TOKEN ?
		`https://${process.env.GH_TOKEN}@github.com/${pkg.config.documentation.slug}.git` :
		`origin`;

	const title = `chore: release version ${version}`;
	const base = 'master';

	const message = getCommitMessage();

	if (title === message) {
		console.log(`  ${chalk.green('✔')}   detected release build, exiting with code 0 and handing off to semantic-release.`);
		const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
		console.log(`  ${chalk.green('✔')}   release-pull-request successfully. ${timestamp}\n`);
		process.exit(0);
	}

	if (process.env.CI) {
		shell.exec(`git config user.email "${pkg.author.email}"`, {silent: true});
		shell.exec(`git config user.name "${pkg.author.name}"`, {silent: true});
	}

	const add = shell.exec(`git add *.md documentation/ examples/ public/`, {silent: true});

	if (add.code === 0) {
		console.log(`  ${chalk.green('✔')}   added docs and gh-pages changes`);
	} else {
		throw new Error(`failed to add docs and gh-pages changes:\n${add.output}`);
	}

	const commit = shell.exec(`git commit -m "${title}"`, {silent: true});

	if (commit.code === 0) {
		console.log(`  ${chalk.green('✔')}   commited changes to "${title}"`);
	} else {
		throw new Error(`failed to commit changes to "${title}":\n${commit.output}`);
	}

	console.log(`  ${chalk.gray('⧗')}   pushing to github.com/${pkg.config.documentation.slug}#${head}.`);
	const push = shell.exec(`git push ${remote} master:${head}`, {silent: true});

	if (push.code === 0) {
		console.log(`  ${chalk.green('✔')}   pushed to github.com/${pkg.config.documentation.slug}#${head}.`);
	} else {
		throw new Error(`failed pushing to "${title}":\n${push.output}`);
	}

	if (process.env.CI && process.env.GH_TOKEN) {
		console.log(`  ${chalk.gray('⧗')}   submitting pull request "${title}" via oauth`);
		const github = new Github({
			auth: 'oauth',
			token: process.env.GH_TOKEN
		});
		const repositoryNames = pkg.config.pages.slug.split('/');
		const repository = github.getRepo(...repositoryNames);
		await denodeify(repository.createPullRequest)({
			title,
			base,
			head
		});
		console.log(`  ${chalk.green('✔')}   submitted pull request "${title}" via oauth`);
	} else {
		console.log(`  ${chalk.gray('⧗')}   submitting pull request "${title}" via hub`);
		const pr = shell.exec(`hub pull-request -f -m "${title}" -b ${base} -h ${head}`, {silent: true});

		if (pr.code === 0) {
			console.log(`  ${chalk.green('✔')}   submitted pull request "${title}" via hub: ${pr.output.split('\n')[0]}`);
			console.log(`  ${chalk.green('✔')}   Exiting with code 1 to prevent semantic-release from publishing`);
			const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
			console.log(`  ${chalk.green('✔')}   release-pull-request successfully. ${timestamp}\n`);
			process.exit(1);
		} else {
			throw new Error(`failed to submit pull request "${title}":\n${pr.output}`);
		}
	}

	const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
	return `  ${chalk.green('✔')}   release-pull-request successfully. ${timestamp}\n`;
}

main(minimist(process.argv.slice(2)))
	.then(message => console.log(message))
	.catch(err => {
		console.log(err);
		console.error(`  ${chalk.red('✖')}   release-pull-request failed.\n`);
		console.trace(err);
		setTimeout(() => {
			throw new Error(err);
		}, 0);
	});
