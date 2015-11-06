const _media = {

};

const windowStub = {
	matchMedia(mediaRule) {
		return _media[mediaRule] === true;
	},
	getComputedStyle(element) {
		return element.style || {};
	}
};

export default windowStub;
