module.exports = function (props) {
	return function (badges) {
		return badges.map(badge => {
			var b;

			if (typeof badge === 'string') {
				b = {
					name: badge,
					image: `${badge}-image`,
					url: `${badge}-url`
				};
			} else {
				b = {
					name: badge.name,
					image: badge.image,
					url: badge.url
				};
			}

			return `[![${b.name}][${b.image}]][${b.url}]`;
		}).join(' ');
	};
};
