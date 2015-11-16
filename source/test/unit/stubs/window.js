const _media = {

};

const windowStub = {
	matchMedia(mediaRule) {
		return _media[mediaRule] === true;
	},
	getComputedStyle(element) {
		return element.style || {};
	},
	NodeList(elements) {
		elements.forEach((element, index) => this[index] = element);
		this.length = elements.length;
	}
};

export default windowStub;
