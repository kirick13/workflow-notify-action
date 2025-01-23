import { appendFile } from 'node:fs/promises';

const repo_url = new URL(process.env.GITHUB_REPOSITORY);
const repo_name = repo_url.pathname.replace(/^\//, '').replace(/\.git$/, '');

const results = new Set();
let job_failed;

for (const [ job, { result }] of Object.entries(JSON.parse(process.env.INPUT_RESULT))) {
	results.add(result);

	if (result === 'failure' && typeof job_failed !== 'string') {
		job_failed = job;
	}
}

let output = '';
if (results.size > 0) {
	// STATUS:
	// 0 - Succeeded
	// 1 - Failed
	// 2 - Skipped
	let status;
	if (results.has('failure')) {
		status = 1;
	}
	else if (results.has('skipped') && results.size === 1) {
		status = 2;
	}
	else if (results.has('success')) {
		status = 0;
	}
	else {
		console.error('process.env.INPUT_RESULT', process.env.INPUT_RESULT);
		console.error('results', results);
		throw new Error('Unknown state found.');
	}
	
	output = JSON.stringify({
		repo_name,
		status,
		job_failed,
	});
}

await appendFile(
	process.env.GITHUB_OUTPUT,
	`value=${output}`,
);
