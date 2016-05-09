const path = require('path');
const fs = require('fs');

const remark = require('remark');
const html = require('remark-html');
const inline = require('remark-inline-links');
const slug = require('remark-slug');
const highlight = require('remark-highlight.js');
const gemoji = require('remark-gemoji');
const emojiParser = require('emoji-parser');
const visit = require('unist-util-visit');
const VFile = require('vfile');
const through = require('through2');
const rename = require('gulp-rename');
const globby = require('globby');
const humanize = require('string-humanize');
const pkg = require('../package.json');
const layout = require('./partials/page-layout');

const emojiBase = './.tmp/emoji/';
const emoji = emojiParser.init(emojiBase).update();

module.exports = function (gulp, paths) {
	'use strict';
	function toHtml() {
		const rewrite = function () {
			return function (ast, file) {
				const base = path.relative(file.filePath(), path.resolve('./'));
				pkg.staticBase = base === '..' ? '.' : path.dirname(base);

				visit(ast, 'link', node => {
					// Rewrite local md links to html files in md
					if (node.url[0] === '.') {
						node.url = node.url
							.replace('.md', '.html')
							.replace('readme', 'index');
					}
				});

				// Rewrite local md links to html files in inline html
				visit(ast, 'html', node => {
					node.value = node.value.replace(/href=\"\.\/(.*?)\.md\"/g, (match, basename) => {
						const name = basename.replace('readme', 'index');
						return `href="./${name}.html"`;
					});
				});
			};
		};

		const processor = remark()
			.use(inline)
			.use(slug)
			.use(highlight)
			.use(rewrite)
			.use(gemoji)
			.use(html);

		const markdownFiles = globby.sync(paths.source.markdown);

		return through.obj((file, enc, cb) => {
			const isPlain = file.contents.indexOf('<!doctype html>') === 0;

			if (isPlain) {
				return cb(null, file);
			}

			const vfile = new VFile({
				contents: emoji.parse(file.contents.toString('utf-8'), '', (match, url, className, options) => {
					const name = match[1];
					if (options.parser.list.indexOf(name) > -1) {
						const image = fs.readFileSync(path.resolve(emojiBase, `${name}.png`));
						return `<img width="20" height="20" class="emoji" src="data:image/png;base64,${image.toString('base64')}" />`;
					}
					return match;
				}),
				directory: path.dirname(file.path),
				filename: path.basename(file.path, path.extname(file.path)),
				extension: path.extname(file.path).slice(1)
			});

			const result = processor.process(vfile);

			const navigationFiles = markdownFiles
				.map(markdownFile => {
					const absolutePath = path.resolve(markdownFile);
					const base = `${path.basename(markdownFile, path.extname(markdownFile))}.html`;
					const target = base === 'readme.html' ? path.join(markdownFile, '..', 'index.html') : path.join(path.dirname(markdownFile), base);
					const href = `${path.relative(file.path, target).slice(1)}`;
					const name = base === 'readme.html' ? humanize(path.dirname(target)) : humanize(path.basename(target));
					const active = absolutePath === file.path;
					return href && name ? {href, name, active, path: absolutePath} : null;
				})
				.filter(Boolean);

			const navigation = [
				{
					name: 'Home',
					href: path.relative(file.path, './').slice(1)
				}
			].concat(navigationFiles);

			const renderedResult = layout({
				pkg: pkg,
				navigation: navigation,
				body: result,
				static: pkg.staticBase
			});

			file.contents = new Buffer(renderedResult);
			cb(null, file);
		});
	}

	return function html() {
		/* @desc compile markdown to html */
		return gulp.src(paths.source.markdown)
			.pipe(toHtml())
			.pipe(rename(info => {
				info.basename = info.basename === 'readme' ? 'index' : info.basename;
				info.extname = '.html';
			}))
			.pipe(gulp.dest(paths.target.public));
	};
};
