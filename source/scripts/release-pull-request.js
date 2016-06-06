import 'babel-polyfill';
import path from 'path';
import denodeify from 'denodeify';
import shell from 'shelljs';
import Github from 'github-api';
import chalk from 'chalk';
import conventionalChangelog from 'conventional-changelog';
import minimist from 'minimist';
import {stripIndent} from 'common-tags';
import gitFsRepository from '@marionebl/git-fs-repo';
import gitSemverTags from 'git-semver-tags';

import pkg from '../../package.json';

const semverTags = denodeify(gitSemverTags);

function getRepository() {
	return new Promise((resolve, reject) => {
		const dbPath = path.join(process.cwd(), '.git');
		gitFsRepository(dbPath, (error, git) => {
			if (error) {
				return reject(error);
			}
			resolve(git);
		});
	});
}

async function getCommitMessage() {
	const repository = await getRepository();
	const {hash} = repository.ref('HEAD');
	const find = denodeify(repository.find.bind(repository));
	const commit = await find(hash);
	const message = commit.message();
	return message;
}

function getChangelog() {
	return new Promise((resolve, reject) => {
		const data = [];

		conventionalChangelog({
			preset: 'angular'
		})
		.on('data', chunk => {
			data.push(chunk);
		})
		.on('end', () => {
			resolve(data.join(''));
		})
		.on('error', error => {
			reject(error);
		});
	});
}

async function getVersion() {
	const [version] = await semverTags();
	return version;
}

async function main() {
	const start = Date.now();
	const version = await getVersion();
	const head = `release/${version}`;

	const remote = process.env.GH_TOKEN ?
		`https://${process.env.GH_TOKEN}@github.com/${pkg.config.documentation.slug}.git` :
		`origin`;

	const title = `chore: release version ${version}`;
	const base = 'master';

	const message = await getCommitMessage();
	const gettingChangeLog = getChangelog();

	if (message.startsWith(title)) {
		console.log(`  ${chalk.green('✔')}   detected release build "${message}", exiting with code 0 and handing off to semantic-release.`);
		const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
		console.log(`  ${chalk.green('✔')}   release-pull-request executed successfully. ${timestamp}\n`);
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
		console.log(`  ${chalk.yellow('⚠')}   failed to commit changes to "${title}"`);
		console.log(`  ${chalk.green('✔')}   hand off to semantic-release`);
		process.exit(0);
	}

	console.log(`  ${chalk.gray('⧗')}   pushing to github.com/${pkg.config.documentation.slug}#${head}.`);
	const push = shell.exec(`git push ${remote} HEAD:refs/heads/${head}`, {silent: true});

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
		const changelog = await gettingChangeLog;

		const body = stripIndent`
		This release includes the following changes:
		${changelog}
		`;

		try {
			const createPullRequest = denodeify(repository.createPullRequest.bind(repository));
			await createPullRequest({
				title,
				base,
				body,
				head
			});

			console.log(`  ${chalk.green('✔')}   submitted pull request "${title}" via oauth`);
			console.log(`  ${chalk.green('✔')}   Exiting with code 1 to prevent semantic-release from publishing`);
			const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
			console.log(`  ${chalk.green('✔')}   release-pull-request successfully. ${timestamp}\n`);
			process.exit(1);
		} catch (err) {
			console.error(`  ${chalk.red('✖')}   pull request "${title}" failed`);
			console.log(`  ${chalk.gray('⧗')}   deleting branch "${head}"`);
			const remove = shell.exec(`git push ${remote} --delete ${head}`, {silent: true});
			if (remove.code === 0) {
				console.log(`  ${chalk.green('✔')}   removed github.com/${pkg.config.documentation.slug}#${head}.`);
			} else {
				console.log(`  ${chalk.red('✖')}   failed to remove github.com/${pkg.config.documentation.slug}#${head}`);
			}
			throw err;
		}
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
