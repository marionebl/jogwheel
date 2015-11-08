
<header class="jogwheel-header">
	<div align="center">
		<a href="https://github.com/marionebl/jogwheel#readme">
			<img width="200" src="https://cdn.rawgit.com/marionebl/jogwheel/master/jogwheel.svg" />
		</a>
	</div>
	<nav class="jogwheel-navigation">
		<h1 align="center"> jogwheel API</h1>
		<div align="center" class="jogwheel-navigation-list"></div>
	</nav>
</header>
<br />


# constructor

Creates a new JogWheel instance

**Parameters**

-   `element` **HTMLElement** HTMLElement to instantiate on
-   `options` **object** Options object
-   `window` **[Window]** Global context to use (optional, default `global.window`)
-   `document` **[Document]** Document context to use (optional, default `global.window`)
-   `window`   (optional, default `global.window`)
-   `document`   (optional, default `global.document`)

**Examples**

```javascript
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a JogWheel instance on element
const wheel = new JogWheel(element);
```

Returns **JogWheel** JogWheel instance

# pause

Pauses the animation

**Examples**

```javascript
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused JogWheel instance on element
const wheel = JogWheel.create(element, {
	paused: false
});

// Pause the animation and reset it to animation start
wheel.pause().seek(0);
```

Returns **JogWheel** JogWheel instance

# play

Plays the animation

**Examples**

```javascript
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused JogWheel instance on element
const wheel = JogWheel.create(element, {
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
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused JogWheel instance on element
const wheel = JogWheel.create(element, {
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

Returns **JogWheel** JogWheel instance

# create

Creates a new JogWheel instance

**Parameters**

-   `element` **HTMLElement** HTMLElement to instantiate on
-   `options` **object** Options object
-   `window` **[Window]** Global context to use (optional, default `global.window`)
-   `document` **[Document]** Document context to use (optional, default `global.window`)
-   `args` **...** 

**Examples**

```javascript
import JogWheel from 'jogwheel';
const element = document.querySelector('[data-animated]');

// Instantiate a paused JogWheel instance on element
const wheel = JogWheel.create(element, {
	paused: true
});

// Seek to middle of animation sequence
wheel.seek(0.5);

// Play the animation
wheel.play();
```

Returns **JogWheel** JogWheel instance

