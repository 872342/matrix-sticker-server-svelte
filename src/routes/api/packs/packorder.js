import * as cookie from 'cookie';
import User from '$lib/models/User';

export const POST = async ({ request }) => {
	const { order } = await request.json();

	if (!order || order.length === 0)
		return {
			status: 400,
			body: { error: 'Invalid order' }
		};

	const cookieHeader = request.headers.get('cookie');
	const cookies = cookie.parse(cookieHeader ?? '');
	if (!cookies.session)
		return {
			status: 403,
			body: { error: 'Forbidden' }
		};

	const user = await User.findOne({ authtoken: cookies.session });
	if (!user)
		return {
			status: 403,
			body: { error: 'Forbidden' }
		};

	//see if given array === current array with IDs
	const currentList = user.packs.map((pack) => pack.id).sort();
	const sortedOrder = [...order].sort();
	const compareArray = currentList.toString() === sortedOrder.toString() ? true : false;
	if (!compareArray)
		return {
			status: 400,
			body: { error: 'Enable pack to use custom ordering' }
		};

	const newArray = [];
	for (let el of order) {
		const thing = user.packs.find((item) => item.id === el);
		newArray.push(thing);
	}
	user.packs = newArray;
	await user.save();

	return {
		status: 200,
		body: { success: 'Order updated' }
	};
};
