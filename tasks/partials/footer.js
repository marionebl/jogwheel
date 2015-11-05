module.exports = function (props) {
	return function () {
		return (
`
---
${props.pkg.name} is built by ${props.pkg.author.name} and [contributors](./documentation/contributors.md) with :heart:
and released under the [${props.pkg.license} License](./license.md).

[npm-url]: https://www.npmjs.org/package/${props.pkg.name}
[npm-image]: https://img.shields.io/npm/v/${props.pkg.name}.svg?style=flat-square
[npm-dl-image]: http://img.shields.io/npm/dm/${props.pkg.name}.svg?style=flat-square

[ci-url]: https://travis-ci.org/${props.pkg.slug}
[ci-image]: https://img.shields.io/travis/${props.pkg.slug}/master.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/${props.pkg.slug}
[coverage-image]: https://img.shields.io/coveralls/${props.pkg.slug}.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/${props.pkg.slug}
[climate-image]: https://img.shields.io/codeclimate/github/${props.pkg.slug}.svg?style=flat-square

[pr-url]: http://issuestats.com/github/${props.pkg.slug}
[pr-image]: http://issuestats.com/github/${props.pkg.slug}/badge/pr?style=flat-square
[issue-url]: ${props.pkg.bugs.url}
[issue-image]: http://issuestats.com/github/${props.pkg.bugs.slug}/badge/issue?style=flat-square

[dependency-manager-image]: https://img.shields.io/badge/tracks%20with-greenkeeper-3989c9.svg?style=flat-square
[dependency-manager-url]: https://github.com/greenkeeperio/greenkeeper
[release-manager-image]: https://img.shields.io/badge/releases%20with-semantic--release-3989c9.svg?style=flat-square
[release-manager-url]: https://github.com/semantic-release/semantic-release
[ecma-image]: https://img.shields.io/badge/babel%20stage-0-3989c9.svg?style=flat-square
[ecma-url]: https://github.com/babel/babel
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-3989c9.svg?style=flat-square
[license-url]: ./license.md
[license-image]: https://img.shields.io/badge/license-MIT-3989c9.svg?style=flat-square
[commitizen-url]: http://commitizen.github.io/cz-cli/
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-3989c9.svg?style=flat-square

[gitter-image]: https://img.shields.io/badge/gitter-join%20chat-3989c9.svg?style=flat-square
[gitter-url]: https://gitter.im/sinnerschrader/patternplate
`
);
	};
};
