export default function (rules) {
	return {
		...rules,
		item(index) {
			return Object.keys(this)[index];
		},
		getPropertyValue(key) {
			return this[key];
		}
	};
}
