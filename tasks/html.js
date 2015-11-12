var mdast = require('mdast');
var html = require('mdast-html');
var inline = require('mdast-inline-links');
var slug = require('mdast-slug');
var highlight = require('mdast-highlight.js');
var visit = require('unist-util-visit');
var VFile = require('vfile');

var through = require('through2');
var util = require('gulp-util');
var rename = require('gulp-rename');
var merge = require('lodash.merge');
var path = require('path');

var pkg = require('../package.json');
var layout = require('./partials/page-layout');

module.exports = function (gulp, paths, _, cli) {
	function rewrite() {
		return function(ast, file) {
			var slugFragments = pkg.config.pages.slug.split('/');
			var userName = slugFragments[0];
			var repositoryName = slugFragments[1];

			var base = path.relative(file.filePath(), path.resolve('./'));
			pkg.staticBase = base === '..' ? '.' : base;

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
		}
	}

	const processor = mdast()
		.use(inline)
		.use(slug)
		.use(highlight)
		.use(rewrite)
		.use(html);

	return function html() {
		/* @desc compile markdown to html */
		return gulp.src(paths.source.markdown)
			.pipe(function(){
				return through.obj(function(file, enc, cb){
					var vfile = new VFile({
						contents: file.contents.toString('utf-8'),
						directory: path.dirname(file.path),
						filename: path.basename(file.path, path.extname(file.path)),
						extension: path.extname(file.path).slice(1)
					});

					var result = processor.process(vfile);

					file.contents = new Buffer(layout({
						pkg: pkg,
						body: result,
						static: pkg.staticBase
					}));

					cb(null, file);
				});
			}())
			.pipe(rename(function(info){
				info.basename = info.basename === 'readme' ? 'index' : info.basename;
				info.extname = '.html';
			}))
			.pipe(gulp.dest(paths.target.public));
	};
};
