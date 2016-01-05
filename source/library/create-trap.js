/**
 * isObject
 * Tests if value is an object
 * @param value to test
 * @returns {boolean}
 * @private
 */
function isObject(value) {
	return Object.prototype.toString.call(value) === '[object Object]'; // eslint-disable-line prefer-reflect
}

/**
 * createTrap
 * Traps writes to property targetName on host and calls handler instead
 *
 * @param host {object} object holding the trapped object as property
 * @param prisonerName {string} propertyName of the object ot trap
 * @param warden {function} handler function to execute instead of setter builtin
 * @returns prison {object} host with trapped targetName property
 * @private
 */
export default function createTrap(host, prisonerName, warden) {
	const prison = {...host};
	let cell = {};

	Reflect.defineProperty(prison, prisonerName, {
		configurable: true,
		enumerable: prison.propertyIsEnumerable(prisonerName),

		get() {
			if (!isObject(cell)) {
				return cell;
			}

			const trap = {...cell};

			setTimeout(() => {
				for (const key in trap) {
					if (trap.hasOwnProperty(key)) {
						if (cell[key] !== trap[key]) {
							cell[key] = warden(host, key, trap[key]);
						}
					}
				}
			});

			return trap;
		},

		set(value) {
			cell = warden(host, null, value);
			return cell;
		}
	});

	return prison;
}
