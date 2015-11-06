import 'babel-polyfill';
import 'web-animations-js';
import 'whatwg-fetch';
import tape from 'tape';

const tests = [
	'simple',
	'keyword'
];

tape('integration', t => {
	t.plan(tests.length);
	window.tape = t.test;
});

const base = './distribution/test/integration';

const mimeTypes = {
	'text/css': (stage, content) => {
		const style = document.createElement('style');
		style.innerHTML = content;
		stage.appendChild(style);
		return style;
	},
	'text/html': (stage, content) => {
		const element = document.createElement('div');
		element.innerHTML = content;
		stage.appendChild(element.firstChild);
		return element;
	},
	'application/javascript': (stage, content) => {
		const script = document.createElement('script');
		script.text = content;
		script.type = 'text/javascript';
		stage.appendChild(script);
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

async function main() {
	const stage = document.querySelector('[data-stage]');

	const inject = getInject(stage);

	for (const test of tests) {
		// reset stage html
		stage.innerHTML = '';

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
		console.log(code);
		eval(code); // eslint-disable-line no-eval
	}
}

main();
