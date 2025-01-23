console.log(process.env);

const webhook = process.env['INPUT_DISCORD-WEBHOOK'];

if (
	process.env.DATA?.length > 0
	&& webhook?.length > 0
) {
	const { repo_name, status, job_failed } = JSON.parse(process.env.DATA);
	
	const COLORS = [
		0x16a34a, // succeeded
		0xdc2626, // failed
		0x525252, // skipped
	];
	const TITLES = [
		'✅ Workflow succeeded!', // succeeded
		`❌ Job ${job_failed} failed`, // failed
		'🗿 Workflow skipped', // skipped
	];
	
	const embed = {
		color: COLORS[status],
		title: TITLES[status],
		author: {
			name: repo_name,
			icon_url: process.env.INPUT_LOGO,
		},
		timestamp: new Date().toISOString(),
	};
	
	// if (typeof process.env['INPUT_REPO-DESCRIPTION'] === 'string') {
	// 	embed.description = process.env['INPUT_REPO-DESCRIPTION'];
	// }
	
	// if (typeof process.env.SIGNATURE === 'string') {
	// 	embed.footer = {
	// 		text: process.env.SIGNATURE,
	// 	};
	// }
	
	const body = {
		embeds: [
			embed,
		],
	};
	
	console.log(JSON.stringify(body, null, 4));
	console.log();
	
	const response = await fetch(
		process.env['INPUT_DISCORD-WEBHOOK'],
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);
	
	console.log(
		[ ...response.headers.entries() ]
			.map(([ k, v ]) => k + ': ' + v)
			.join('\n'),
	);
	console.log();
	console.log(
		await response.text(),
	);
}
