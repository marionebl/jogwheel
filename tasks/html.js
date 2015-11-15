var mdast = require('mdast');
var html = require('mdast-html');
var inline = require('mdast-inline-links');
var slug = require('mdast-slug');
var highlight = require('mdast-highlight.js');
var visit = require('unist-util-visit');
var VFile = require('vfile');
var through = require('through2');
var rename = require('gulp-rename');
var path = require('path');
var globby = require('globby');
var humanize = require('string-humanize');
var pkg = require('../package.json');
var layout = require('./partials/page-layout');

module.exports = function (gulp, paths) {
	function toHtml() {
		const rewrite = function () {
			return function (ast, file) {
				var base = path.relative(file.filePath(), path.resolve('./'));
				pkg.staticBase = base === '..' ? '.' : path.dirname(base);

				visit(ast, 'link', function (node) {
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
						return `href="./${name}.html"`;
					});
				});
			};
		};

		const processor = mdast()
			.use(inline)
			.use(slug)
			.use(highlight)
			.use(rewrite)
			.use(html);

		const markdownFiles = globby.sync(paths.source.markdown);

		return through.obj(function (file, enc, cb) {
			var vfile = new VFile({
				contents: file.contents.toString('utf-8'),
				directory: path.dirname(file.path),
				filename: path.basename(file.path, path.extname(file.path)),
				extension: path.extname(file.path).slice(1)
			});

			var result = processor.process(vfile);

			var navigationFiles = markdownFiles
				.map(function (markdownFile) {
					const absolutePath = path.resolve(markdownFile);
					const base = `${path.basename(markdownFile, path.extname(markdownFile))}.html`;
					const target = base === 'readme.html' ? path.join(markdownFile, '..', 'index.html') : path.join(path.dirname(markdownFile), base);
					const href = `${path.relative(file.path, target).slice(1)}`;
					const name = base === 'readme.html' ? humanize(path.dirname(target)) : humanize(path.basename(target));
					const active = absolutePath === file.path;
					return href && name ? {href, name, active, path: absolutePath} : null;
				})
				.filter(Boolean);

			var navigation = [
				{
					name: 'Home',
					href: path.relative(file.path, './index.html')
				}
			].concat(navigationFiles);

			file.contents = new Buffer(layout({
				pkg: pkg,
				navigation: navigation,
				body: result,
				static: pkg.staticBase
			}));

			cb(null, file);
		});
	}

	return function html() {
		/* @desc compile markdown to html */
		return gulp.src(paths.source.markdown)
			.pipe(toHtml())
			.pipe(rename(function (info) {
				info.basename = info.basename === 'readme' ? 'index' : info.basename;
				info.extname = '.html';
			}))
			.pipe(gulp.dest(paths.target.public));
	};
};
