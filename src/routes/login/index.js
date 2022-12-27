import * as bcrypt from 'bcrypt';
import * as cookie from 'cookie';
import User from '$lib/models/User';

import { loginValidation } from '$lib/userValidation';

export const POST = async ({ request }) => {
	const form = await request.formData();
	const username = form.get('username');
	const password = form.get('password');

	//check for Joi validation errors
	const { error } = loginValidation({ username, password });
	if (error) {
		return {
			status: 400,
			body: { error: 'Incorrect username or password.' }
		};
	}
	//check if user doesnt exist
	const user = await User.findOne({ username: username });
	if (!user) {
		return {
			status: 400,
			body: { error: 'Incorrect username or password.' }
		};
	}

	//check if password is correct
	const validPass = await bcrypt.compare(password, user.password);
	if (!validPass) {
		return {
			status: 400,
			body: { error: 'Incorrect username or password.' }
		};
	}

	return {
		status: 200,
		body: {
			user: { username: username, id: user.id },
			success: 'Success.'
		},
		headers: {
			'Set-Cookie': [
				cookie.serialize('session', user.authtoken, {
					// send cookie for every page
					path: '/',
					// server side only cookie so you can't use `document.cookie`
					httpOnly: true,
					// only requests from same site can send cookies
					// and serves to protect from CSRF
					// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
					sameSite: 'strict',
					// only sent over HTTPS
					secure: true, // process.env.NODE_ENV === 'production',
					// set cookie to expire after a month
					maxAge: 60 * 60 * 24 * 30
				})
			]
		}
	};
};
