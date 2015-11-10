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
	<blockquote class="jogwheel-claim">${props.pkg.description}</blockquote>
	<div class="jogwheel-logo" align="center">
		<img width="200" src="${props.pkg.statichost}/${props.pkg.slug}/master/${image.src}" />
	</div>
	<h1 class="jogwheel-name" align="center">${props.pkg.icon} ${headline || props.pkg.name}</h1>
	<nav class="jogwheel-navigation">
		<div align="center" class="jogwheel-navigation-list">${navigation.map(function (item) {
				var name = item.name || item;
				var href = item.href || `#${name.split(' ').join('-').toLowerCase()}`;
				return `<b><a href="${href}">${name}</a></b>`;
			}).join(' | ')}</div>
	</nav>
</header>
<br />
`
		);
	};
};
