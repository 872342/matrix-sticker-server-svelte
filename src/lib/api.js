export async function send(form) {
	const response = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: 'application/json' }
	});
	return await response.json();
}
