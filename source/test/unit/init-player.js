import tape from 'tape';
import windowStub from './stubs/window.js';
import documentStub from './stubs/document.js';
import elementStub, {unpolyfilledElementStub} from './stubs/element.js';
import initPlayer from '../../library/init-player.js';

tape('init-player', t => {
	t.ok(
		typeof initPlayer(elementStub,
			[],
			{},
			() => {},
			windowStub, documentStub) === 'object',
		'should return an object');

	t.ok(
		typeof initPlayer(unpolyfilledElementStub,
			[],
			{},
			() => {},
			windowStub, documentStub) === 'object',
		'should return an object when initializing on element without animate method');

	const stub = {...elementStub, style: {}};

	// overwrite element.animate
	stub.animate = function () {
		const element = this;
		return {
			play() {
				element.style.opacity = '0.3';
			},
			pause() {}
		};
	};

	let proxied = {};

	initPlayer(stub,
		[],
		{
			render(el, style) {
				proxied = {el, style};
			}
		},
		undefined,
		windowStub,
		documentStub);

	t.notEqual(proxied.style, stub.style,
	'should proxy style property assignments if called with options.render');

	// abort window.requestAnimationFrame
	const prev = windowStub.requestAnimationFrame;
	windowStub.requestAnimationFrame = () => {};
	windowStub.requestAnimationFrame = prev;

	const nativeStub = {...elementStub, style: {}};

	// overwrite element.animate
	nativeStub.animate = function () {
		if (this !== nativeStub) {
			throw new Error('Illegal invocation');
		}

		const element = this;

		return {
			play() {
				element.style.opacity = '0.3';
			},
			pause() {}
		};
	};

	t.doesNotThrow(() => {
		initPlayer(nativeStub,
			[],
			{
				render(el, style) {
					proxied = {el, style};
				}
			},
			undefined,
			windowStub,
			documentStub);
	}, 'should not fail when element.animate fails with "Illegal invocation"');

	// overwrite element.animate
	nativeStub.animate = function () {
		throw new Error();
	};

	t.throws(() => {
		initPlayer(nativeStub,
			[],
			{
				render(el, style) {
					proxied = {el, style};
				}
			},
			undefined,
			windowStub,
			documentStub);
	}, 'should fail when element.animate fails with other error');

	// abort window.requestAnimationFrame
	windowStub.requestAnimationFrame = () => {};
	t.end();
});
