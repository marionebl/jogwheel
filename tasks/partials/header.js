module.exports = function (props) {
	return function (image, headline, navigation) {
		image = image || {
			href: props.pkg.homepage,
			src: props.pkg.logo
		};
		navigation = navigation || [];

		return (
`
<header class="jogwheel-header">
	<div align="center">
		<a href="${image.href}">
			<img width="200" src="https://cdn.rawgit.com/${props.pkg.repository.slug}/master/${image.src}" />
		</a>
	</div>
	<nav class="jogwheel-navigation">
		<h1 align="center">${props.pkg.icon} ${headline || props.pkg.name}</h1>
		<div align="center" class="jogwheel-navigation-list">${navigation.map(function (item) {
				var name = item.name || item;
				var href = item.href || `#${name.split(' ').join('-').toLowerCase()}`;
				var target = href[0] === '#' ? '_self' : '_blank';
				return `<b><a href="${href}" target="${target}">${name}</a></b>`;
			}).join(' | ')}</div>
	</nav>
</header>
<br />
`
		);
	};
};
