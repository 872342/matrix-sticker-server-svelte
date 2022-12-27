import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import User from '$lib/models/User';
import { registerValidation } from '$lib/userValidation';

export const POST = async ({ request }) => {
	const form = await request.formData();
	const username = form.get('username');
	const password = form.get('password');

	//check for Joi validation errors
	const { error } = registerValidation({ username, password });
	if (error) {
		return {
			status: 400,
			body: { error: 'Bad username or password.' }
		};
	}

	//check if user already in db
	const userExists = await User.findOne({ username: username });
	console.log(userExists);
	if (userExists) {
		return {
			status: 400,
			body: { error: 'Username already exists' }
		};
	}

	//else hash password,
	const hashedPassword = await bcrypt.hash(password, 10);

	//create user
	const user = new User({
		id: nanoid(),
		username: username,
		password: hashedPassword,
		authtoken: nanoid()
	});
	//try save new user to db and return ID
	try {
		user.save();
		return {
			status: 200,
			body: { success: 'Success.' }
		};
	} catch (err) {
		//db error
		return {
			status: 400,
			body: { error: `error` }
		};
	}
};
