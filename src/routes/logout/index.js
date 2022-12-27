import * as cookie from 'cookie';

export const GET = async () => {
	return {
		status: 303,
		headers: {
			'Set-Cookie': cookie.serialize('session', '', {
				path: '/',
				// the cookie should expire immediately
				expires: new Date(0)
			}),
			location: '/'
		}
	};
};
