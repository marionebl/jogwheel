
<header class="jogwheel-header">
	<blockquote class="jogwheel-claim">Take control of your CSS keyframe animations [🌐](https://marionebl.github.io/jogwheel/)</blockquote>
	<div class="jogwheel-logo" align="center">
		<img width="200" src="https://cdn.rawgit.com/marionebl/jogwheel/master/source/documentation/static/jogwheel.svg" />
	</div>
	<h1 class="jogwheel-name" align="center"> jogwheel</h1>
	<nav class="jogwheel-navigation">
		<div align="center" class="jogwheel-navigation-list"><b><a href="#found-an-issue">Report issues</a></b> | <b><a href="#want-to-contribute">Contribute</a></b> | <b><a href="#coding-rules">Coding Rules</a></b> | <b><a href="#commit-rules">Commit Rules</a></b></div>
	</nav>
</header>
<br />


Yeay! You want to contribute to jogwheel. That's amazing!
To smoothen everyone's experience involved with the project please take note of the following guidelines and rules.

## Found an Issue?
Thank you for reporting any issues you find. We do our best to test and make jogwheel as solid as possible, but any reported issue is a real help.

> jogwheel issues

[![Issues][issue-image]][issue-url]

Please follow these guidelines when reporting issues:
* Provide a title in the format of `<Error> when <Task>`
* Tag your issue with the tag `bug`
* Provide a short summary of what you are trying to do
* Provide the log of the encountered error if applicable
* Provide the exact version of jogwheel. Check `npm ls jogwheel` when in doubt
* Be awesome and consider contributing a [pull request](#want-to-contribute)

## Want to contribute?
You consider contributing changes to jogwheel – we dig that!
Please consider these guidelines when filing a pull request:

> jogwheel pull requests

[![Pull requests][pr-image]][pr-url]

* Follow the [Coding Rules](#coding-rules)
* Follow the [Commit Rules](#commit-rules)
* Make sure you rebased the current master branch when filing the pull request
* Squash your commits when filing the pull request
* Provide a short title with a maximum of 100 characters
* Provide a more detailed description containing
	* What you want to achieve
	* What you changed
	* What you added
	* What you removed

## Coding Rules
To keep the code base of jogwheel neat and tidy the following rules apply to every change

> Coding standards

![Ecmascript version][ecma-image] [![Javascript coding style][codestyle-image]][codestyle-url]

* [Happiness](/sindresorhus/xo) enforced via eslint
* Use advanced language features where possible
* JSdoc comments for everything
* Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
* Coverage never drops below 90%
* No change may lower coverage by more than 5%
* Be awesome

## Commit Rules
To help everyone with understanding the commit history of jogwheel the following commit rules are enforced.
To make your life easier jogwheel is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards

[![Commitizen friendly][commitizen-image]][commitizen-url]

* [conventional-changelog](/commitizen/cz-conventional-changelog)
* husky commit message hook available
* present tense
* maximum of 100 characters
* message format of `$type($scope): $message`


---
jogwheel `v1.2.4` is built by Mario Nebl and [contributors](./documentation/contributors.md) with :heart:
and released under the [MIT License](./license.md).

[npm-url]: https://www.npmjs.org/package/jogwheel
[npm-image]: https://img.shields.io/npm/v/jogwheel.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.org/package/jogwheel
[npm-dl-image]: http://img.shields.io/npm/dm/jogwheel.svg?style=flat-square

[brcdn-url]: https://www.brcdn.org/?module=jogwheel
[brcdn-image]: https://img.shields.io/badge/cdn-v1.2.4-5ec792.svg?style=flat-square

[ci-url]: https://travis-ci.org/marionebl/jogwheel
[ci-image]: https://img.shields.io/travis/marionebl/jogwheel/master.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/marionebl/jogwheel
[coverage-image]: https://img.shields.io/coveralls/marionebl/jogwheel.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/marionebl/jogwheel
[climate-image]: https://img.shields.io/codeclimate/github/marionebl/jogwheel.svg?style=flat-square

[pr-url]: http://issuestats.com/github/marionebl/jogwheel
[pr-image]: http://issuestats.com/github/marionebl/jogwheel/badge/pr?style=flat-square
[issue-url]: undefined
[issue-image]: http://issuestats.com/github/marionebl/jogwheel/badge/issue?style=flat-square

[dependency-manager-image]: https://img.shields.io/badge/tracks%20with-greenkeeper-5ec792.svg?style=flat-square
[dependency-manager-url]: https://github.com/greenkeeperio/greenkeeper
[release-manager-image]: https://img.shields.io/badge/releases%20with-semantic--release-5ec792.svg?style=flat-square
[release-manager-url]: https://github.com/semantic-release/semantic-release
[ecma-image]: https://img.shields.io/badge/babel%20stage-0-5ec792.svg?style=flat-square
[ecma-url]: https://github.com/babel/babel
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-5ec792.svg?style=flat-square
[license-url]: ./license.md
[license-image]: https://img.shields.io/badge/license-MIT-5ec792.svg?style=flat-square
[commitizen-url]: http://commitizen.github.io/cz-cli/
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-5ec792.svg?style=flat-square

[gitter-image]: https://img.shields.io/badge/gitter-join%20chat-5ec792.svg?style=flat-square
[gitter-url]: https://gitter.im/sinnerschrader/patternplate

