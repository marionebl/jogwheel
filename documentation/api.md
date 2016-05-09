
<header class="jogwheel-header">
	<blockquote class="jogwheel-claim">Take control of your CSS keyframe animations</blockquote>
	<div class="jogwheel-logo" align="center">
		<img width="200" src="https://cdn.rawgit.com/marionebl/jogwheel/master/source/documentation/static/jogwheel.svg" />
	</div>
	<h1 class="jogwheel-name" align="center"> jogwheel API</h1>
	<nav class="jogwheel-navigation">
		<div align="center" class="jogwheel-navigation-list"></div>
	</nav>
</header>
<br />


# constructor

Creates a new jogwheel instance

**Parameters**

-   `nodes` **Node or NodeList** Node or NodeList to instantiate on
-   `options` **object** Options object
-   `window` **[Window]** Global context to use (optional, default `global.window`)
-   `document` **[Document]** Document context to use (optional, default `global.window`)

**Examples**

```javascript
import jogwheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a jogwheel instance on element
const wheel = new jogwheel(element);
```

Returns **jogwheel** jogwheel instance

# JogWheel.prototype.durations

Returns **array** durations used by jogwheel instance

# JogWheel.prototype.players

Returns **array** WebAnimationPlayer instances by jogwheel instance

# JogWheel.prototype.playState

Returns **string** playState, either `running` or `paused`

# JogWheel.prototype.progress

Returns **float** progress in fraction of 1 [0..1]

# pause

Pauses the animation

**Examples**

```javascript
import jogwheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused jogwheel instance on element
const wheel = jogwheel.create(element, {
	paused: false
});

// Pause the animation and reset it to animation start
wheel.pause().seek(0);
```

Returns **jogwheel** jogwheel instance

# play

Plays the animation

**Examples**

```javascript
import jogwheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused jogwheel instance on element
const wheel = jogwheel.create(element, {
	paused: true
});

// Seek to middle of animation sequence and play
wheel.seek(0.5).play();
```

Returns **JogWheel** JogWheel instance

# seek

Seeks the timeline of the animation

**Parameters**

-   `progress` **float** fraction of the animation timeline [0..1]

**Examples**

```javascript
import jogwheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused jogwheel instance on element
const wheel = jogwheel.create(element, {
	paused: true
});

// Keep track of scroll position
let scrollTop = document.scrollTop;
document.addEventListener('scroll', () => scrollTop = document.scrollTop);

// Seek the animation [0..1] for scroll position of [0..300]
function loop() {
	const fraction = Math.max((300 / scrollTop) - 1, 0);
	wheel.seek(fraction);
	window.requestAnimationFrame(loop);
}

// Start the render loop
loop();
```

Returns **jogwheel** jogwheel instance

# create

Creates a new jogwheel instance

**Parameters**

-   `nodes` **Node or NodeList** Node or NodeList to instantiate on
-   `options` **object** Options object
-   `window` **[Window]** Global context to use (optional, default `global.window`)
-   `document` **[Document]** Document context to use (optional, default `global.window`)
-   `args` **...** 

**Examples**

```javascript
import jogwheel from 'jogwheel';
const element = document.querySelector('[data-animated]');
:
// Instantiate a paused jogwheel instance on element
const wheel = jogwheel.create(element, {
	paused: true
});

// Seek to middle of animation sequence
wheel.seek(0.5);

// Play the animation
wheel.play();
```

Returns **jogwheel** jogwheel instance



---
jogwheel `v1.4.3` is built by Mario Nebl and [contributors](./documentation/contributors.md) with :heart:
and released under the [MIT License](./license.md).

[npm-url]: https://www.npmjs.org/package/jogwheel
[npm-image]: https://img.shields.io/npm/v/jogwheel.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.org/package/jogwheel
[npm-dl-image]: http://img.shields.io/npm/dm/jogwheel.svg?style=flat-square

[cdn-url]: https://wzrd.in/standalone/jogwheel@latest
[cdn-image]: https://img.shields.io/badge/cdn-v1.4.3-5ec792.svg?style=flat-square

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

