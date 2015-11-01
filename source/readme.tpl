> ${props.pkg.description}

<%= props.partials.header('', ['About', 'Install', 'Usage', {'name': 'API', 'href': './documentation/api.md'}]) %>


## About
${props.pkg.name} gives you the power to control your CSS keyframe animations via CSS. By combining the best of CSS keyframe animations and the upcoming Web Animation API you get:

- [x] **separation of concerns**: Animations are styling, thus should be written in CSS
- [x] **declarative animations**: CSS keyframes are the simplest way to author animations on the web
- [x] **animation sequences**: No fiddling with animationEnd
- [x] **static interpolation**: Because ${props.pkg.name} leverages the Web Animation API you can play, pause and scrub your animations
- [ ] world peace

## Install
[${props.pkg.name}](npm-url) is available on npm.
```
npm install --save ${props.pkg.name}
```

## Usage
${props.pkg.name} exposes its API as commonjs module.
See [API Documentation](./documentation/api.md) for details.

```js
import JogWheel from '${props.pkg.name}';
const element = document.querySelector('[data-animated]');
const player = JogWheel.create(element);

// Jump halfway into the animation
player.seek(0.5);
```

```css
[data-animated] {
	animation: bounce 1s;
	animation-play-state: paused;
}

```

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
See [development](./documentation/development.md) for more details.

<%= props.partials.footer() %>
