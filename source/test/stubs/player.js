const playerStub = options => {
	const _state = {
		currentTime: 0,
		activeDuration: 0,
		playState: 'running'
	};

	_state.activeDuration = options.duration;

	return {
		play() {
			_state.playState = 'running';
		},
		pause() {
			_state.playState = 'paused';
		},
		effect: {
			get currentTime() {
				return _state.currentTime;
			},
			get activeDuration() {
				return _state.activeDuration;
			}
		},
		get playState() {
			return _state.playState;
		}
	};
};

export default playerStub;
