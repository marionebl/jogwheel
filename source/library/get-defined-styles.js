/**
 * Gets map of defined styles from CSS2Properties object
 * @param  {CSS2Properties} properties CSS2Properties object to return defined styles from
 * @return {object}       plain object containing defined styles as key value pairs
 * @private
 */
export default function getDefinedStyles(properties) {
	const styles = {};

	for (let i = properties.length - 1; i >= 0; i -= 1) {
		const name = properties.item(i);
		const value = properties.getPropertyValue(name);
		if (value !== 'initial') {
			styles[name] = value;
		}
	}

	return styles;
}
