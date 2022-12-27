import * as cookie from 'cookie';
import User from '$lib/models/User';
import Pack from '$lib/models/Pack';

export const POST = async ({ request }) => {
	const { id, order } = await request.json();
	//404s
	// if (!id)
	// 	return {
	// 		status: 400,
	// 		body: { error: 'Invalid id' }
	// 	};

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

	//see if id in user.packs
	const hasPack = user.packs.find((pack) => pack.id === id);
	if (!hasPack)
		return {
			status: 400,
			body: { error: 'Enable pack to use custom ordering' }
		};

	const pack = await Pack.findOne({ id: id });
	let packArray = [...Array(pack.stickercount).keys()];
	let orderSorted = [...order].sort((a, b) => {
		return a - b;
	});
	let compareArray = packArray.toString() === orderSorted.toString() ? true : false;
	//if order doesnt match sticker count length/values
	if (!compareArray)
		return {
			status: 403,
			body: {
				error: 'Invalid order'
			}
		};
	else {
		const updatePack = user.packs.find((pack) => pack.id === id);
		updatePack.order = order;
		await user.save();
	}

	return {
		status: 200,
		body: { success: 'Order updated' }
	};
};
