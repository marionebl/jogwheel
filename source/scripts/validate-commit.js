import 'babel-polyfill';

import chalk from 'chalk';
import denodeify from 'denodeify';
import {exec} from 'child_process';
import {readFile} from 'fs';

const execute = denodeify(exec);
const read = denodeify(readFile);

function validate(message) {
	const length = 100;
	const pattern = /^((?:fixup!\s*)?(\w*)(\(([\w\$\.\*/-]*)\))?\: (.*))(\n|$)/;
	const release = /^\d.\d.\d$/;
	const pullRequest = /^(Merge pull request)|(Merge (.*?) into (.*?)$)/i;

	const types = [
		'feat',
		'fix',
		'docs',
		'style',
		'refactor',
		'perf',
		'test',
		'chore',
		'revert'
	];

	if (message.match(pullRequest)) {
		return true;
	}

	if (message.match(release)) {
		return true;
	}

	const match = message.match(pattern);

	if (!match) {
		throw new Error(`does not match "<type>(<scope>): <subject>", was: "${message}"`);
	}

	const [, line, type, scope, scopeName, subject] = [...match];

	if (line.length > length) {
		throw new Error(`is too long: ${line.length} characters, ${length} allowed`);
	}

	if (types.indexOf(type) === -1) {
		throw new Error(`unknown type: "${type}", allowed: ${types.join(', ')}`);
	}

	if (!scopeName && !scope) {
		console.warn(`  ${chalk.yellow('⚠')}   Specifying a scope is recommended. Format: <type>(<scope>): <subject>`);
	}

	if (scope && !scopeName) {
		throw new Error(`empty scope: specifying empty scope parenthesis is not allowed`);
	}

	if (!subject) {
		throw new Error(`empty subject: a subject is required`);
	}

	return true;
}

async function getHashes() {
	return [process.env.TRAVIS_COMMIT];
}

async function getMessage(hash) {
	if (!hash) {
		return '';
	}

	const raw = await execute(`git log -1 --format=oneline ${hash}`);
	return raw.split('\n')[0].replace(`${hash} `, '');
}

async function getMessages(hashes) {
	// This lives here until babel has its shit together again. Move to
	// top level, then pass down as messagePath
	const messagePath = process.argv.slice(2)[0];

	// message path provided, read from fs
	if (messagePath) {
		const message = await read(messagePath);
		return [message.toString().split('\n')[0]];
	}

	// Try to read from history by hashes array
	return Promise.all(hashes
		.filter(hash => hash)
		.map(async function(hash) {
			return getMessage(hash);
		}));
}

async function main() {
	const messagePath = process.argv.slice(2)[0];
	const hashes = await getHashes();
	const messages = await getMessages(hashes, messagePath);
	const checked = messages.filter(message => message).map(validate);

	return `  ${chalk.green('✔')}   Executed validate-commit-msg on ${checked.length} messages successfully.\n`;
}

main()
	.then(message => console.log(message))
	.catch(err => {
		console.error(`  ✖   validate-commit-msg failed.\n`);
		console.trace(err);
		setTimeout(() => {
			throw new Error(err);
		}, 0);
	});
