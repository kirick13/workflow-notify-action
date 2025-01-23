import { appendFile } from 'node:fs/promises';

// STATUS:
// 0 - Succeeded
// 1 - Failed
// 2 - Skipped

await appendFile(
	process.env.GITHUB_OUTPUT,
	'value=' + JSON.stringify({
		status: 0,
		job_name: null,
	}),
);
