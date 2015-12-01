import {prefix} from './get-vendor-prefix';

const propertyNames = [
	'name',
	'duration',
	'iterationCount',
	'timingFunction',
	'fillMode',
	'playState',
	'delay'
];

/**
 * Returns applicable animation properties for a given node
 * @param  {Node} node Node to read animation properties from
 * @param  {Window} window  Global context to use
 * @return {Object}         Applicable animation properties for node in window
 * @private
 */
export default function getAnimationProperties(node, window = global.window, document = global.document) {
	const styles = window.getComputedStyle(node);

	return propertyNames.reduce((properties, propertyName) => {
		const cssName = `animation${propertyName[0].toUpperCase()}${propertyName.slice(1)}`;
		properties[propertyName] = styles[prefix(cssName, window, document)];
		return properties;
	}, {});
}
