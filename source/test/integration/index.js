import 'babel-polyfill';
import 'web-animations-js/web-animations-next.min.js';
import 'whatwg-fetch';
import tape from 'tape';

import JogWheel from '../../library';

const tests = [
	'simple',
	'keyword',
	'iteration-count',
	'node-list'
];
const base = './distribution/test/integration';

const mimeTypes = {
	'text/css': (container, content) => {
		const style = document.createElement('style');
		style.innerHTML = content;
		container.appendChild(style);
		return style;
	},
	'text/html': (container, content) => {
		const element = document.createElement('div');
		element.innerHTML = content;
		container.appendChild(element.firstChild);
		return element;
	},
	'application/javascript': (container, content) => {
		const script = document.createElement('script');
		script.text = content;
		script.type = 'text/javascript';
		container.appendChild(script);
		return script;
	}
};

function getInject(stage) {
	return async function inject(asset) {
		const contentType = asset.headers.get('content-type');
		const mimeType = contentType.split(';')[0];
		const injector = mimeTypes[mimeType];
		return injector(stage, await asset.text());
	};
}

function read() {
	return JSON.parse(localStorage.getItem('jogwheel')) || {};
}

function save(state) {
	const previous = read();
	localStorage.setItem('jogwheel', JSON.stringify({
		...previous,
		...state
	}));
}

function onStateChange(e) {
	save({
		visible: e.target.checked
	});
}

async function main() {
	const state = document.querySelector('[data-stage-state]');
	const stage = document.querySelector('[data-stage-demos]');
	const handle = document.querySelector('[data-stage-handle]');
	const img = document.createElement('img');
	img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

	state.checked = read().visible || false;
	onStateChange({target: state});
	state.addEventListener('change', onStateChange);

	handle.addEventListener('dragstart', e => {
		state.checked = true;
		onStateChange({target: state});
		e.dataTransfer.setDragImage(img, 0, 0);
	});

	handle.addEventListener('drag', e => {
		const height = window.innerHeight - e.pageY;

		if (Math.abs(e.pageY - stage.getBoundingClientRect().top) > 50) {
			return;
		}

		stage.style.height = `${height}px`;
	});

	handle.addEventListener('dragend', e => {
		const height = window.innerHeight - e.pageY;

		if (Math.abs(e.pageY - stage.getBoundingClientRect().top) > 50) {
			return;
		}

		stage.style.height = `${height}px`;
		save({height});
	});

	const containers = [];

	tape('integration', async function(t) { // eslint-disable-line no-loop-func
		t.plan(tests.length);

		for (const test of tests) {
			const container = document.createElement('div');
			container.setAttribute('data-stage-demo-container', 'data-stage-demo-container');
			container.setAttribute('class', 'demo-pending');
			const frame = document.createElement('iframe');
			frame.setAttribute('data-stage-demo-frame', 'data-stage-demo-frame');

			const headline = document.createElement('h4');
			headline.innerHTML = test;

			container.appendChild(headline);
			container.appendChild(frame);
			stage.appendChild(container);
			containers.push(container);

			try {
				/* eslint-disable no-loop-func */
				const onload = async function () {
					const frameDocument = frame.contentDocument || frame.contentWindow.document;
					const inject = getInject(frameDocument.body);

					// fetch test styling
					const cssURI = [base, test, `index.css`].join('/');
					const cssLoading = fetch(cssURI);

					// fetch test markup
					const htmlURI = [base, test, `index.html`].join('/');
					const htmlLoading = fetch(htmlURI);

					// fetch test javascript
					const jsURI = [base, test, `index.js`].join('/');
					const jsLoading = fetch(jsURI);

					// await css and html, inject them
					const css = await cssLoading;
					const html = await htmlLoading;

					await inject(css);
					await inject(html);

					// inject js when css and html is injected
					const js = await jsLoading;
					const code = await js.text();

					frame.contentWindow.__jogwheel = JogWheel;
					frame.contentWindow.__jogWheelTape = t.test;
					frame.contentWindow.___jogWheelElement = {
						animate: HTMLElement.prototype.animate,
						getAnimations: HTMLElement.prototype.getAnimations
					};

					frame.contentWindow.eval(`
						var __jogwheel_originalRequire = require;
						function require(module) {
							if (module === 'tape') {
								return window.__jogWheelTape;
							} else if (module.indexOf('web-animations-js') > -1) {
								HTMLElement.prototype.animate = window.___jogWheelElement.animate;
								HTMLElement.prototype.getAnimations = window.___jogWheelElement.getAnimations
								return;
							} else if (module === 'jogwheel') {
								return window.__jogwheel;
							} else {
								return __jogwheel_originalRequire(module);
							}
						}
						${code}
					`);
				};

				frame.onload = onload;
				if (frame.contentDocument.readyState === 'complete') {
					onload();
				}
				/* eslint-disable */
			} catch (err) {
				console.error(err);
				container.setAttribute('class', `demo-failed`);
				t.fail(err);
			}
		}
	});

	const poller = setInterval(() => {
		const ends = window.zuul_msg_bus.filter(message => message.type === 'test_end');
		const done = window.zuul_msg_bus.filter(message => message.type === 'done');

		ends.forEach((end, index) => {
			const className = end.passed ? 'passed' : 'failed';
			const container = containers[index - 1];

			if (container) {
				container.setAttribute('class', `demo-${className}`);
			}
		});

		if (done.length > 0) {
			clearInterval(poller);
		}
	}, 50);
}

main();
