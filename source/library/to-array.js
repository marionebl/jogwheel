const empty = [];

/**
 * Cast array-like objects and collections to Array
 * @param  {Object} arrayLike array-like to cast to Array
 * @return {Array} Array cast from arrayLike
 * @private
 */
export default function toArray(arrayLike) {
	return empty.slice.call(arrayLike); // eslint-disable-line prefer-reflect
}
