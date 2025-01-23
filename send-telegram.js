const {
	'INPUT_TELEGRAM-BOT-TOKEN': bot_token,
	'INPUT_TELEGRAM-CHAT-ID': chat_id,
	'DATA': input,
	'INPUT_SIGNATURE': signature,
} = process.env;

const { repo_name, status, job_failed } = JSON.parse(input);

const TITLES = [
	'✅ Workflow succeeded!', // succeeded
	`❌ Workflow failed`, // failed
	'🗿 Workflow skipped', // skipped
];


const text_lines = [
	TITLES[status],
];

if (status === 1) {
	text_lines.push(`Job \`${job_failed}\` failed.`);
}

if (signature) {
	text_lines.push('');
	text_lines.push(`<i>${signature}</i>`);
}

console.log(text_lines.join('\n'));
console.log();

const response = await fetch(
	`https://api.telegram.org/bot${bot_token}/sendMessage`,
	{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chat_id,
			text: text_lines.join('\n'),
			parse_mode: 'HTML',
		}),
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
