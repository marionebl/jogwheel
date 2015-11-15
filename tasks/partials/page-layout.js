module.exports = function (props) {
	return `<!doctype html>
<html lang="en" prefix="og: http://ogp.me/ns#">
	<head>
		<title>${props.pkg.name} - ${props.pkg.description}</title>
		<link rel="stylesheet" href="${props.static}/${props.pkg.config.pages.stylesheet}" />
		<meta property="og:title" content="${props.pkg.name}" />
		<meta property="og:title" content="${props.pkg.description}" />
		<meta property="og:image" content="${props.static}/${props.pkg.config.pages.image}" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" type="image/svg+xml" href="${props.static}/${props.pkg.config.pages.svgicon}" />
		<link rel="icon" type="image/png" href="${props.static}/${props.pkg.config.pages.pngicon}" />
	</head>
	<body>
		<div class="jogwheel-teaser">
			<a href="https://github.com/${props.pkg.config.documentation.slug}#-${props.pkg.name}">
				Fork me on Github
			</a>
			<nav class="jogwheel-main-navigation">
				<ul class="jogwheel-main-navigation-list">
					${props.navigation.map(function(item) {
						var className = item.active ? 'jogwheel-item jogwheel-item--active' : 'jogwheel-item';
						return `<li class="${className}"><a href="${item.href}">${item.name}</a></li>`
					}).join('\n')}
				</ul>
			</nav>
		</div>
		${props.body}
		<aside class="jogwheel-archive-teaser">
			Looking for older versions? Search our <a href="./archives/index.html">archives</a>.
		</aside>
		<script src="${props.static}/${props.pkg.config.pages.script}"></script>
	</body>
</html>
`;
};
