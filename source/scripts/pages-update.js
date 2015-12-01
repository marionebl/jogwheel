import 'babel-polyfill';
import denodeify from 'denodeify';
import chalk from 'chalk';
import minimist from 'minimist';
import shell from 'shelljs';
import Github from 'github-api';
import pkg from '../../package.json';

async function main() {
	const start = Date.now();
	const hash = shell.exec(`git rev-parse --short HEAD`, {silent: true}).output.split('\n')[0];

	const head = `gh-pages-update-${hash}`;
	const remote = process.env.GH_TOKEN ?
		`https://${process.env.GH_TOKEN}@github.com/${pkg.config.documentation.slug}.git` :
		`origin`;

	if (process.env.CI) {
		shell.exec(`git config user.email "${pkg.author.email}"`, {silent: true});
		shell.exec(`git config user.name "${pkg.author.name}"`, {silent: true});
	}

	if (process.env.GH_PAGES_ADD === 'true') {
		const add = shell.exec(`git add public`, {silent: true});

		if (add.code === 0) {
			console.log(`  ${chalk.green('✔')}   added gh-pages changes`);
		} else {
			throw new Error(`failed to add gh-pages changes:\n${add.output}`);
		}

		const count = shell.exec(`git diff --cached --numstat`).output.split('\n').length;

		if (count === 0) {
			console.log(`  ${chalk.yellow('⚠')}   No file staged for commit and push, skipping`);
			const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
			return `  ${chalk.green('✔')}   pages-update executed successfully. ${timestamp}\n`;
		}

		console.log(`  ${chalk.green('✔')}   ${count} files staged for commit and push`);

		const commit = shell.exec(`git commit -m "docs: ${hash} master → gh-pages"`, {silent: true});

		if (commit.code === 0) {
			console.log(`  ${chalk.green('✔')}   commited changes`);
		} else {
			throw new Error(`failed to commit changes:\n${commit.output}`);
		}
	}

	console.log(`  ${chalk.gray('⧗')}   pushing to github.com/${pkg.config.documentation.slug}#${head}.`);
	const push = shell.exec(`git subtree --prefix=public/ push ${remote} ${head}`, {silent: true});

	if (push.code === 0) {
		console.log(`  ${chalk.green('✔')}   pushed to github.com/${pkg.config.documentation.slug}#${head}.`);
	} else {
		throw new Error(`failed pushing to github.com/${pkg.config.documentation.slug}#${head}:\n${push.output}`);
	}

	const title = `docs: ${hash} master → gh-pages`;
	const base = 'gh-pages';

	if (process.env.CI && process.env.GH_TOKEN) {
		console.log(`  ${chalk.gray('⧗')}   submitting pull request "${head} → gh-pages" via oauth`);
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
		console.log(`  ${chalk.green('✔')}   submitted pull request "${head} → gh-pages" via oauth`);
	} else {
		console.log(`  ${chalk.gray('⧗')}   submitting pull request "${head} → gh-pages" via hub`);
		const pr = shell.exec(`hub pull-request -f -m "${title}" -b ${base} -h ${head}`, {silent: true});

		if (pr.code === 0) {
			console.log(`  ${chalk.green('✔')}   submitted pull request "${head} → gh-pages" via hub: ${pr.output.split('\n')[0]}`);
		} else {
			console.log(`  ${chalk.red('✖')}   failed to submit pull request "${head} → gh-pages" via hub`);
			console.log(pr.output);
		}
	}

	const timestamp = chalk.gray(`   [${Date.now() - start}ms]`);
	return `  ${chalk.green('✔')}   pages-update executed successfully. ${timestamp}\n`;
}

main(minimist(process.argv.slice(2)))
	.then(message => console.log(message))
	.catch(err => {
		console.log(err);
		console.error(`  ${chalk.red('✖')}   pages-update failed.\n`);
		console.trace(err);
		setTimeout(() => {
			throw new Error(err);
		}, 0);
	});
