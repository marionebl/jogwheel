import toArray from './to-array';

/**
 * get cssRules for styleSheet
 * @param {string} styleSheet - styleSheet to extract cssRules from
 * @return {array} cssRules for styleSheet
 * @private
 */
export default function getCSSRules(styleSheet) {
	try {
		return toArray(styleSheet.cssRules || []);
	} catch (err) {
		console.warn(`Error while reading cssRules from StyleSheet "${styleSheet.href || 'local'}".`);
		console.error(err);
		return [];
	}
}
