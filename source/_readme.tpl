<%= props.partials.header('', '',
  [
    'About',
    'Install',
    'Usage',
    {
      name: 'Browser Support',
      href: '#browser-support'
    },
    {
      name: 'API Documentation',
      href: './documentation/api.md'
    },
    {
      name: 'Examples',
      href: './examples/readme.md'
    },
    {
      name: 'Contributing',
      href: './contributing.md'
    }
  ]
) %>

> Health

<%= props.partials.badges(['ci']) %>
<%= props.partials.badges(['coverage', 'climate']) %>

> Availability

<%= props.partials.badges(['npm', 'brcdn', 'npm-dl']) %>

> Activity

<%= props.partials.badges(['pr', 'issue']) %>

> Conventions and standards

<%= props.partials.badges(['dependency-manager', 'release-manager', 'ecma', 'codestyle', 'license', 'commitizen']) %>

## About
${props.pkg.name} gives you the power to take full control of your CSS keyframe animations via JavaScript.

- [x] **separation of concerns**: Declare animations with CSS
- [x] **full control**: Play, pause and scrub your animations
- [x] **animation sequences**: No brittle fiddling with animationEnd
- [ ] world peace

## Install
[${props.pkg.name}][npm-url] is available on npm.
```
npm install --save ${props.pkg.name}
```

## Usage
**:warning: Please note** ${props.pkg.name} assumes `Element.prototype.animate` is defined and returns a valid WebAnimationPlayer instance.
To achieve this you will have to include a WebAnimation polyfill, [web-animations-js](https://github.com/web-animations/web-animations-js) by Google is recommended.

The usage examples show recommended ways to include the polyfill.

### CommonJS
${props.pkg.name} exposes its API as CommonJS module. Using the export and bundling your JavaScript with browserify, webpack or rollup is **recommended**.

```js
// import the polyfill
import 'web-animations-js';

// import JogWheel
import JogWheel from '${props.pkg.name}';

// Select target element
const element = document.querySelector('[data-animated]');

// Construct JogWheel instance from element
const player = JogWheel.create(element);

// Jump halfway into the animation
player.seek(0.5);
```

### CDN
${props.pkg.name} provides prebundled downloads via [brcdn.org](https://www.brcdn.org/?module=${props.pkg.name}).
Either embed or download the standalone bundle. Given you do not use a module system the standalone build will pollute `window.jogwheel`. This usage is viable but **not recommended**.

* Development [${props.pkg.tag}](https://www.brcdn.org/${props.pkg.name}/${props.pkg.tag}/?standalone=${props.pkg.name}&uglify=false)
* Production [${props.pkg.tag}](https://www.brcdn.org/${props.pkg.name}/${props.pkg.tag.slice(1)}/?standalone=${props.pkg.name}&uglify=true)
* Development [latest](https://www.brcdn.org/${props.pkg.name}/latest/?standalone=${props.pkg.name}&uglify=false)
* Production [latest](https://www.brcdn.org/${props.pkg.name}/latest/?standalone=${props.pkg.name}&uglify=true)

```html
<!doctype html>
<html>
  <head>
    <title>CDN example</title>
  </head>
  <style>
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
      animation-fill-mode: both;
      animation-play-state: paused;
      height: 100px;
      width: 100px;
      background: #333;
      border-radius: 50%;
    }
  </style>
  <body>
    <div data-animated></div>
    <script src="https://www.brcdn.org/web-animations-js/latest/?standalone=web-animations-js&uglify=true" />
    <script src="https://www.brcdn.org/${props.pkg.name}/latest/?standalone=${props.pkg.name}&uglify=true" />
    <script>
      var element = document.querySelector('[data-animated]');
      var player = JogWheel.create(element);
      player.seek(0.5).play();
    </script>
  </body>
</html>
```

---
See [API Documentation](./documentation/api.md) for details.

## Example
${props.pkg.name} shines brightest when used with CSS animations.

**JavaScript**

```js
import JogWheel from '${props.pkg.name}';
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
  /* animation-fill-mode and animation-play-state are recommended */
  animation-fill-mode: both;
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
${props.pkg.name} performs cross browser testing with SauceLabs

[![Browser Support](https://saucelabs.com/browser-matrix/jogwheel-unit.svg)](https://saucelabs.com/u/jogwheel-unit)

## Development
You dig ${props.pkg.name} and want to submit a pull request? Awesome!
Be sure to read the [contribution guide](./contributing.md) and you should be good to go.
Here are some notes to get you coding real quick.

Fetch, install and start the default watch task
```
git clone ${props.pkg.repository.url}
cd ${props.pkg.name}
npm install
npm start
```
This will watch all files in `source` and start the appropriate tasks when changes are detected.

## Roadmap
${props.pkg.name} is up to a lot of good. This includes but is not limited to
- [x] super-awesome cross-browser tests
- [ ] unit-tested documentation code examples, because rust isn't the only language that can do cool dev convenience stuff
- [ ] an interactive playground and animation editor
- [ ] a plug-an-play react integration component

---
See [Roadmap](./documentation/roadmap.md) for details.


<%= props.partials.footer() %>
