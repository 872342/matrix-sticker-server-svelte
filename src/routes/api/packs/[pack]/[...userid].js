import * as cookie from 'cookie';
import User from '$lib/models/User';
import Sticker from '$lib/models/Sticker';
import Pack from '$lib/models/Pack';

// this endpoint is private and public
// so it should check if you are logged in to send order
// else send normal order
// how?
export const GET = async ({ request, params }) => {
	const { pack, userid } = await params;
	let userData;

	const cookieHeader = request.headers.get('cookie');
	const cookies = cookie.parse(cookieHeader ?? '');

	//get via auth cookie or query param
	if (cookies.session) {
		userData = await User.findOne({ authtoken: cookies.session });
	} else if (userid) {
		userData = await User.findOne({ id: userid });
	}

	//404s without pack, so, pointless
	// if (!pack)
	// 	return {
	// 		status: 400,
	// 		body: { error: 'Invalid pack id' }
	// 	};

	//get all stickers with this pack ID
	const stickerdata = await Sticker.find({ packid: pack }, [
		'-_id',
		'-info._id',
		'-info.thumbnail_info._id',
		'-createdAt',
		'-updatedAt',
		'-__v'
	]).lean();

	//get the pack object
	const packdata = await Pack.findOne({ id: pack });
	if (!packdata || !stickerdata)
		return {
			status: 400,
			body: { error: 'Invalid pack id' }
		};

	//create the pack object and send
	let sa = stickerdata.map(({ ...item }) => item);
	let stickersArray = sa.sort((a, b) => a.position - b.position);

	//check if user param exists and user has custom order
	if (userData) {
		const userPack = userData.packs.find((p) => p.id === pack);
		if (userPack && userPack.order.length > 0) {
			let result = [];
			for (let i of userPack.order) {
				for (let s of stickersArray) {
					if (s.position === i) {
						result.push(s);
					}
				}
			}
			stickersArray = result;
		}
	}

	const obj = {
		title: packdata.name,
		id: packdata.id,
		stickers: stickersArray
	};

	return {
		status: 200,
		body: obj
	};
};
