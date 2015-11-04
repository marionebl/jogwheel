> take control over your css keyframe animations


<div align="center">
	<!-- <a href="https://github.com/marionebl/jogwheel#readme">
		<img width="200" src="https://cdn.rawgit.com/undefined/master/source/jogwheel.svg" />
	</a> -->
</div>
<h1 align="center"> jogwheel</h1>
<p align="center">
	<b>
	<a href="#about" target="_blank">About</a> | <a href="#install" target="_blank">Install</a> | <a href="#usage" target="_blank">Usage</a> | <a href="./documentation/api.md" target="_blank">API</a>
	</b>
</p>
<br />



## About
jogwheel gives you the power to take full control over your CSS keyframe animations via JavaScript.

- [x] **separation of concerns**: Animations are styling, thus should be written in CSS
- [x] **declarative animations**: CSS keyframes are the simplest way to author animations on the web
- [x] **animation sequences**: No fiddling with animationEnd
- [x] **static interpolation**: Because jogwheel leverages the Web Animation API you can play, pause and scrub your animations
- [ ] world peace

## Install
[jogwheel](npm-url) is available on npm.
```
npm install --save jogwheel
```

## Usage
jogwheel exposes its API as commonjs module.
See [API Documentation](./documentation/api.md) for details.

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

## Development
You dig jogwheel and want to submit a pull request? Awesome!
Be sure to read the [contribution guide](./contributing.md) and you should be good to go.
Here are some notes to get you coding real quick.

Fetch, install and start the default watch task
```
git clone git+https://github.com/marionebl/jogwheel.git
cd jogwheel
npm install
npm start
```
This will watch all files in `source` and start the appropriate tasks when changes are detected.
See [development](./documentation/development.md) for more details.


---
jogwheel is built by Mario Nebl and [contributors](./documentation/contributors.md) with :heart:
and released under the [MIT License](./license.md).

[npm-url]: https://www.npmjs.org/package/jogwheel
[npm-image]: https://img.shields.io/npm/v/jogwheel.svg?style=flat-square
[npm-dl-image]: http://img.shields.io/npm/dm/jogwheel.svg?style=flat-square

[ci-url]: https://travis-ci.org/undefined
[ci-image]: https://img.shields.io/travis/undefined/master.svg?style=flat-square

[coverage-url]: https://coveralls.io/r/undefined
[coverage-image]: https://img.shields.io/coveralls/undefined.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/undefined
[climate-image]: https://img.shields.io/codeclimate/github/undefined.svg?style=flat-square

[pr-url]: http://issuestats.com/github/undefined
[pr-image]: http://issuestats.com/github/undefined/badge/pr?style=flat-square
[issue-url]: https://github.com/marionebl/jogwheel/issues
[issue-image]: http://issuestats.com/github/undefined/badge/issue?style=flat-square

[dependency-manager-image]: https://img.shields.io/badge/tracks%20with-greenkeeper-3989c9.svg?style=flat-square
[dependency-manager-url]: https://github.com/greenkeeperio/greenkeeper
[release-manager-image]: https://img.shields.io/badge/releases%20with-semantic--release-3989c9.svg?style=flat-square
[release-manager-url]: https://github.com/semantic-release/semantic-release
[buildsystem-url]: https://github.com/flyjs/fly
[ecma-image]: https://img.shields.io/badge/babel%20stage-0-3989c9.svg?style=flat-square
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-xo-3989c9.svg?style=flat-square
[license-url]: ./license.md
[license-image]: https://img.shields.io/badge/license-MIT-3989c9.svg?style=flat-square
[commitizen-url]: http://commitizen.github.io/cz-cli/
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-3989c9.svg?style=flat-square

[gitter-image]: https://img.shields.io/badge/gitter-join%20chat-3989c9.svg?style=flat-square
[gitter-url]: https://gitter.im/sinnerschrader/patternplate

