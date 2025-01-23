import { appendFile } from 'node:fs/promises';

const results = new Set();
let job_failed;

for (const [ job, { result }] of Object.entries(JSON.parse(process.env.INPUT_RESULT))) {
	results.add(result);

	if (result === 'failure' && typeof job_failed !== 'string') {
		job_failed = job;
	}
}

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
	
	await appendFile(
		process.env.GITHUB_OUTPUT,
		'value=' + JSON.stringify({
			status: 0,
			job_failed,
		}),
	);
}
