import User from '$lib/models/User';

//public
export const GET = async ({ params }) => {
	const { id } = await params;

	//...
	const userID = await User.findOne({ id: id });
	if (!userID)
		return {
			status: 400,
			body: { error: 'Invalid id' }
		};

	let xxx = userID.packs.map(({ id }) => id);
	const userObj = {
		packs: xxx,
		homeserver_url: 'https://matrix.org'
	};
	return {
		status: 200,
		body: userObj
	};
};
