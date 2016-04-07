import playerStub from './player.js';

const elementStub = {
	style: {
	},
	animate(_, options) {
		return playerStub(options);
	},
	getAnimations() {
		return [];
	}
};

export const unpolyfilledElementStub = {
	style: {}
};

export default elementStub;
