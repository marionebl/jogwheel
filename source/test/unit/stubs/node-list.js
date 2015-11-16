import windowStub from './window.js';
import elementStub from './element.js';

const nodeListStub = new windowStub.NodeList([
	{...elementStub},
	{...elementStub}
]);

export default nodeListStub;
