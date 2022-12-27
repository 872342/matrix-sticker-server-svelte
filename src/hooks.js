import User from '$lib/models/User';

import * as cookie from 'cookie';

export const handle = async ({ event, resolve }) => {
	const cookieHeader = event.request.headers.get('cookie');
	const cookies = cookie.parse(cookieHeader ?? '');

	if (!cookies.session) {
		return await resolve(event);
	}

	const session = await User.findOne({ authtoken: cookies.session });

	if (session) {
		event.locals.user = { username: session.username };
		event.locals.user['id'] = session.id;
	}

	return await resolve(event);
};
export async function getSession({ locals }) {
	if (!locals.user) return {};
	return {
		user: locals.user
	};
}
