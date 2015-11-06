// CSSRule type enums
const enums = {
	unknown: 0,
	style: 1,
	charset: 2,
	import: 3,
	media: 4,
	fontface: 5,
	page: 6,
	keyframes: 7,
	keyframe: 8,
	namespace: 9,
	counter: 11,
	supports: 12,
	document: 13,
	fontfeature: 14,
	viewport: 15,
	region: 16
};

export function parseKeyframeKey(keyText) {
	// parse valid keyFrameRule.keyText entries and return an array of integers
	return keyText.split(',').map(key => parseInt(key
		.trim()
		.replace('from', '0')
		.replace('to', '100')
		.replace('%', ''), 10));
}

export function getDeclarations(typeName = 'style', rules = [], predecate = Boolean) {
	// Get target type enum
	const type = enums[typeName];

	return [...rules]
		// filter by rule type
		.filter(rule => rule.type === type)
		// filter with user-provided predecate
		.filter(predecate)
		// unwrap cssRules
		.map(rule => rule.cssRules)
		// flatten
		.reduce((results, cssRules) => {
			return [...results, ...cssRules];
		}, []);
}

export function getKeyframeDeclarations(animationName, rules) {
	// filter for KeyFrameRules matching an animationName
	return getDeclarations('keyframes', rules, rule => rule.name === animationName);
}

export function transformKeyframeDeclaration(keyFrameRule) {
	// return valid webanimation keyframe objects
	const percentages = parseKeyframeKey(keyFrameRule.keyText);

	return percentages.map(percentage => {
		return {
			offset: percentage / 100,
			...keyFrameRule.style
		};
	});
}

export default function getKeyframes(animationName, window = global.window, document = global.document) {
	return [...document.styleSheets]
		.reduce((results, styleSheet) => {
			return [...results, ...getKeyframeDeclarations(animationName, styleSheet.cssRules)];
		}, [])
		.map(foo => {
			return foo;
		})
		.map(transformKeyframeDeclaration)
		.reduce((results, declaration) => {
			const amend = Array.isArray(declaration) ? declaration : [declaration];
			return [...results, ...amend];
		}, []);
}
