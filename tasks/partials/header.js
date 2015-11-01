module.exports = function (props) {
	return function (image, navigation) {
		image = image || {
			href: props.pkg.homepage,
			src: props.pkg.logo
		};
		navigation = navigation || [];

		return (
`
<div align="center">
	<!-- <a href="${image.href}">
		<img width="200" src="https://cdn.rawgit.com/${props.pkg.repository.slug}/master/${image.src}" />
	</a> -->
</div>
<h1 align="center">${props.pkg.icon} ${props.pkg.name}</h1>
<p align="center">
	<b>
	${navigation.map(function (item) {
		var name = item.name || item;
		var href = item.href || `#${name.split(' ').join('-').toLowerCase()}`;
		return `<a href="${href}" target="_blank">${name}</a>`;
	}).join(' | ')}
	</b>
</p>
<br />
`
		);
	};
};
