import 'babel-polyfill';
import denodeify from 'denodeify';
import chalk from 'chalk';
import minimist from 'minimist';
import shell from 'shelljs';
import Github from 'github-api';
import pkg from '../../package.json';

async function main(options) {
	const start = Date.now();
	const hash = shell.exec(`git rev-parse --short HEAD`, {silent: true}).output.split('\n')[0];

	const head = `gh-pages-update-${hash}`;
	const remote = process.env.GH_TOKEN ?
		`https://${process.env.GH_TOKEN}@github.com/${pkg.config.documentation.slug}.git` :
		`origin`;

	shell.exec(`git add public`, {silent: true});
	shell.exec(`git status --porcelain`, {silent: true});

	shell.exec(`git commit -m "docs: ${hash} master → gh-pages"`, {silent: true});
	console.log(`  ${chalk.gray('⧗')}   pushing to github.com/${pkg.config.documentation.slug}#${head}.`);
	shell.exec(`git subtree --prefix=public/ push ${remote} ${head}`, {silent: true});
	console.log(`  ${chalk.green('✔')}   pushed to github.com/${pkg.config.documentation.slug}#${head}.`);

	const title = 'docs: ${hash} master → gh-pages';
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
