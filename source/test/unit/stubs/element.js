import playerStub from './player.js';

const elementStub = {
	style: {
	},
	animate(_, options) {
		return playerStub(options);
	}
};

export default elementStub;
