import 'babel-polyfill';
import 'web-animations-js';
import 'whatwg-fetch';
import tape from 'tape';

const tests = [
	'simple',
	'keyword'
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
	let testing;

	tape('integration', t => {
		t.plan(tests.length);
		testing = t;
	});

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

		const inject = getInject(frame.contentDocument.querySelector('body'));

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

		try {
			frame.contentWindow.__jogWheelTape = testing.test;
			frame.contentWindow.eval(`
				var __jogwheel_originalRequire = require;
				function require(module) {
					if (module === 'tape') {
						return window.__jogWheelTape;
					} else {
						return __jogwheel_originalRequire(module);
					}
				}
				${code}
			`); // eslint-disable-line no-eval
		} catch (err) {
			container.setAttribute('class', `demo-failed`);
			testing.fail(err);
		}
	}

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
