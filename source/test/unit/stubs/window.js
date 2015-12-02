const _media = {

};

const windowStub = {
	matchMedia(mediaRule) {
		return _media[mediaRule] === true;
	},
	getComputedStyle(element) {
		return element.style || {};
	},
	requestAnimationFrame(fn) {
		setTimeout(fn, 15);
	},
	NodeList(elements) {
		elements.forEach((element, index) => this[index] = element);
		this.length = elements.length;
	}
};

export default windowStub;
