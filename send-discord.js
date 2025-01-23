console.log(process.env);

const {
	'INPUT_DISCORD-WEBHOOK': webhook,
	'DATA': input,
	'INPUT_ICON': icon_url,
	'INPUT_SIGNATURE': signature,
} = process.env;

if (
	input?.length > 0
	&& webhook?.length > 0
) {
	const { repo_name, status, job_failed } = JSON.parse(input);

	const COLORS = [
		0x16a34a, // succeeded
		0xdc2626, // failed
		0x525252, // skipped
	];
	const TITLES = [
		'✅ Workflow succeeded!', // succeeded
		`❌ Job \`${job_failed}\` failed`, // failed
		'🗿 Workflow skipped', // skipped
	];
	
	const embed = {
		color: COLORS[status],
		title: TITLES[status],
		author: {
			name: repo_name,
			icon_url,
		},
		timestamp: new Date().toISOString(),
	};

	if (typeof signature === 'string') {
		embed.footer = {
			text: signature,
		};
	}

	const body = {
		embeds: [
			embed,
		],
	};

	console.log(JSON.stringify(body, null, 4));
	console.log();

	const response = await fetch(
		webhook,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	);

	console.log(response.status, response.statusText);
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
