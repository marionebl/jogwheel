
<header class="jogwheel-header">
	<blockquote class="jogwheel-claim">take control over your css keyframe animations</blockquote>
	<div class="jogwheel-logo" align="center">
		<img width="200" src="https://cdn.rawgit.com/marionebl/jogwheel/master/source/documentation/static/jogwheel.svg" />
	</div>
	<h1 class="jogwheel-name" align="center"> jogwheel</h1>
	<nav class="jogwheel-navigation">
		<div align="center" class="jogwheel-navigation-list"><b><a href="#about">About</a></b> | <b><a href="#install">Install</a></b> | <b><a href="#usage">Usage</a></b> | <b><a href="#browser-support">Browser Support</a></b> | <b><a href="./documentation/api.md">API Documentation</a></b> | <b><a href="./examples/readme.md">Examples</a></b> | <b><a href="./contributing.md">Contributing</a></b></div>
	</nav>
</header>
<br />


[![ci][ci-image]][ci-url]
[![coverage][coverage-image]][coverage-url] [![climate][climate-image]][climate-url]


[![npm][npm-image]][npm-url] [![npm-dl][npm-dl-image]][npm-dl-url]


[![pr][pr-image]][pr-url] [![issue][issue-image]][issue-url]


[![dependency-manager][dependency-manager-image]][dependency-manager-url] [![release-manager][release-manager-image]][release-manager-url] [![ecma][ecma-image]][ecma-url] [![codestyle][codestyle-image]][codestyle-url] [![license][license-image]][license-url] [![commitizen][commitizen-image]][commitizen-url]

## About
jogwheel gives you the power to take full control over your CSS keyframe animations via JavaScript.

- [x] **separation of concerns**: Declare animations with CSS
- [x] **full control**: Play, pause and scrub your animations
- [x] **animation sequences**: No brittle fiddling with animationEnd
- [ ] world peace

## Install
[jogwheel](npm-url) is available on npm.
```
npm install --save jogwheel
```

## Usage
jogwheel exposes its API as commonjs module.

```js
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');
const player = JogWheel.create(element);

// Jump halfway into the animation
player.seek(0.5);
```
---
See [API Documentation](./documentation/api.md) for details.


## Example
jogwheel shines brightest when used with CSS animations.

**JavaScript**

```js
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');
const player = JogWheel.create(element);

// Jump halfway into the animation
player.seek(0.5);
```

**CSS**

```css
@keframes bounce {
	0% {
		transform: none;
	}

	25% {
		transform: translateY(-100%);
	}

	50% {
		transform: none;
	}

	75% {
		transform: translateY(100%);
	}

	100% {
		transform: none;
	}
}

[data-animated] {
	animation: bounce 1s;
	animation-play-state: paused;
	height: 100px;
	width: 100px;
	background: #333;
	border-radius: 50%;
}

```

**HTML**

```html
<div data-animated>
</div>
```
---
See [Examples](./examples/readme.md) for more use cases.


## Browser support
jogwheel performs cross browser testing with SauceLabs

[![Browser Support](https://saucelabs.com/browser-matrix/jogwheel-unit.svg)](https://saucelabs.com/u/jogwheel-unit)

## Development
You dig jogwheel and want to submit a pull request? Awesome!
Be sure to read the [contribution guide](./contributing.md) and you should be good to go.
Here are some notes to get you coding real quick.

Fetch, install and start the default watch task
```
git clone https://github.com/marionebl/jogwheel.git
cd jogwheel
npm install
npm start
```
This will watch all files in `source` and start the appropriate tasks when changes are detected.

## Roadmap
jogwheel is up to a lot of good. This includes but is not limited to
- [x] super-awesome cross-browser tests
- [ ] unit-tested documentation code examples, because rust isn't the only language that can do cool dev convenience stuff
- [ ] an interactive playground and animation editor
- [ ] a plug-an-play react integration component

---
See [Roadmap](./documentation/roadmap.md) for details.



---
jogwheel `v1.0.0` is built by Mario Nebl and [contributors](./documentation/contributors.md) with :heart:
and released under the [MIT License](./license.md).

[npm-url]: https://www.npmjs.org/package/jogwheel
[npm-image]: https://img.shields.io/npm/v/jogwheel.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.org/package/jogwheel
[npm-dl-image]: http://img.shields.io/npm/dm/jogwheel.svg?style=flat-square

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

