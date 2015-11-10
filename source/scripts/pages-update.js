import 'babel-polyfill';
import path from 'path';
import {writeFile, readFile} from 'fs';

import globby from 'globby';
import inline from 'mdast-inline-links';
import denodeify from 'denodeify';
import chalk from 'chalk';
import mdast from 'mdast';
import html from 'mdast-html';
import slug from 'mdast-slug';
import highlight from 'mdast-highlight.js';
import visit from 'unist-util-visit';
import browserify from 'browserify';
import mkdirp from 'mkdirp';
import ncp from 'ncp';
import minimist from 'minimist';
import postcss from 'postcss';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import cssimport from 'postcss-import';

import shell from 'shelljs';
import Github from 'github-api';

import layout from './page-layout.js';
import pkg from '../../package.json';

const read = denodeify(readFile);
const write = denodeify(writeFile);
const mkdir = denodeify(mkdirp);
const copy = denodeify(ncp);

async function render(options) {
	const markdownFiles = await globby(['**/*.md', '!node_modules/**/*']);

	const queue = markdownFiles.map(async function(markdownFilePath) {
		const mdPathObject = path.parse(markdownFilePath);
		const name = mdPathObject.name === 'readme' ? 'index' : mdPathObject.name;
		const ext = '.html';
		const dir = path.join('public', mdPathObject.dir);
		const base = `${name}${ext}`;

		const pathObject = {
			...mdPathObject,
			dir, base, name, ext
		};

		const htmlFilePath = path.format(pathObject);

		const markdownFileContents = await read(markdownFilePath);

		const local = options.local ? {
			pages: {
				...pkg.config.pages,
				statichost: path.dirname(path.relative(htmlFilePath, './public/.')),
				branch: false,
				slug: false
			}
		} : {};

		const packageData = {
			...pkg,
			...pkg.config,
			...local
		};

		const staticBase = [
			packageData.pages.statichost,
			packageData.pages.branch,
			packageData.pages.slug
		].filter(Boolean).join('/');

		const md = mdast()
			.use(inline)
			.use(slug)
			.use(highlight)
			.use(() => {
				return ast => {
					visit(ast, 'link', node => {
						// Rewrite local md links to html files in md
						if (node.href[0] === '.') {
							node.href = node.href
								.replace('.md', '.html')
								.replace('readme', 'index');
						}
					});

					// Rewrite local md links to html files in inline html
					visit(ast, 'html', node => {
						node.value = node.value.replace(/href=\"\.\/(.*?)\.md\"/g, (match, basename) => {
							const name = basename.replace('readme', 'index');
							return `href="./${name}.html"`
						});

						node.value = node.value.replace(
							`${packageData.documentation.statichost}/${packageData.documentation.slug}/master/${packageData.documentation.logo}`,
							`${staticBase}/${packageData.pages.image}`
						);
					});
				};
			})
			.use(html);

		const htmlFileContents = layout({
			pkg: packageData,
			body: md.process(markdownFileContents.toString('utf-8')),
			static: staticBase
		});

		await mkdir(path.dirname(htmlFilePath));

		return async function(){
			await write(htmlFilePath, htmlFileContents);
			return htmlFilePath;
		}();
	});

	queue.forEach((task) => {
		task.then((filePath) => {
			// console.log(`  ${chalk.green('✔')}   Created "${filePath}".`);
		}).catch(err => {
			setTimeout(() => {
				throw err;
			}, 0);
		});
	});

	return Promise.all(queue);
}

function bundle() {
	const bundler = browserify(['./source/documentation/static/index.js'], {
		transform: ['babelify']
	});

	return new Promise((resolve, reject) => {
		bundler.bundle(function(err, results){
			if (err) {
				return reject(err);
			}
			resolve(results);
		})
	});
}

async function pack() {
	const js = await bundle();
	return write('public/static/index.js', js);
}

async function style() {
	const processor = postcss()
		.use(cssimport())
		.use(cssnext())
		.use(cssnano());

	const code = await read('./source/documentation/static/index.css');
	const processed = await processor.process(code.toString(), {
		from: './source/documentation/static/index.css'
	});
	return write('./public/static/index.css', processed.css);
}

async function main(options) {
	const start = Date.now();

	// Prepare gh-pages git subtree
	shell.exec('git stash',{silent:true});
	shell.exec('rm -rf public', {silent:true});
	shell.exec('git subtree add --prefix public origin gh-pages',{silent:true});
	shell.exec('git stash pop',{silent:true});
	shell.exec('mkdir -p public/static');
	shell.exec('cp -rf source/documentation/static/ public/static', {silent:true});

	const tasks = [{
		name: 'rendering',
		fn: render
	}, {
		name: 'packing',
		fn: pack
	}, {
		name: 'styling',
		fn: style
	}];

	const queue = tasks.map((task) => {
		console.log(`  ${chalk.gray('⧗')}   ${task.name} started.`);
		const queued = task.fn(options);
		const start = Date.now();

		return queued
			.then(() => {
				const delta = Date.now() - start;
				const timestamp = chalk.gray(`   [${delta}ms]`);
				console.log(`  ${chalk.green('✔')}   ${task.name} completed. ${timestamp}`);
				return queued;
			})
			.catch(err => {
				console.error(`  ${chalk.red('✖')}   Error in ${task.name}`);
				setTimeout(() => {
					throw err;
				}, 0);
			});
	});

	await Promise.all(queue);

	if (options['pull-request']) {
		const hashCall = shell.exec(`git rev-parse --short HEAD`, {silent:true});

		if (hashCall.code !== 0) {
			console.error(`  ${chalk.red('✖')}   Could not obtain commit hash`);
		}

		const branchName = `gh-pages-update-${hashCall.output.split('\n')[0]}`;
		const remote = options.local ?
			`origin` :
			`https://${process.env.GH_TOKEN}@github.com/${pkg.config.documentation.slug}.git`

		if (!options.local) {
			shell.exec(`git config --global user.email "${pkg.name}.ghpages@herebecode.com"`,{silent:true});
			shell.exec(`git config --global user.name "${pkg.name} Github pages bot"`,{silent:true});
		}

		shell.exec(`git add public`,{silent:true});
		const status = shell.exec(`git status --porcelain`,{silent:true});

		if (status.output.split('\n').filter(path => path.includes('public/')).length === 0) {
			console.log(`  ${chalk.green('✔')}   No changes on ${branchName}, aborting.`);
		} else {
			shell.exec(`git commit -m "docs: update master → gh-pages"`,{silent:true});
			console.log(`  ${chalk.gray('⧗')}   pushing to github.com/${pkg.config.documentation.slug}#${branchName}.`);
			shell.exec(`git subtree --prefix=public/ push ${remote} ${branchName}`,{silent:true});
			console.log(`  ${chalk.green('✔')}   pushed to github.com/${pkg.config.documentation.slug}#${branchName}.`);
			shell.exec(`git reset --soft "HEAD^2"`,{silent:true});

			if (process.env.GH_TOKEN) {
				const github = new Github({
					auth: 'oauth',
					token: process.env.GH_TOKEN
				});

				const repositoryNames = pkg.config.pages.slug.split('/');
				const repository = github.getRepo(...repositoryNames);

				console.log(`  ${chalk.gray('⧗')}   submitting pull request ${branchName} → gh-pages`);
				const pullRequest = await denodeify(repository.createPullRequest)({
					title: 'docs: update gh-pages to latest master build',
					body: 'This pull request was submitted automatically by Travis CI',
					base: 'gh-pages',
					head: branchName
				});
				console.log(`  ${chalk.green('✔')}   submitted pull request ${branchName} → gh-pages`);
			} else {
				console.log(`  ${chalk.yellow('✔')}  GH_TOKEN not set, will not submit PR.`);
			}
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
