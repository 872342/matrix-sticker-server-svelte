import * as cookie from 'cookie';
import User from '$lib/models/User';
import Sticker from '$lib/models/Sticker';
import Pack from '$lib/models/Pack';

const getAllPacks = async () => {
	const res = await Pack.find({}, [
		'-_id',
		'-owner',
		'-date',
		'-private',
		'-createdAt',
		'-updatedAt',
		'-__v'
	]).lean();
	return res;
};

export const GET = async ({ request }) => {
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

	//valid user, get their packs
	const userpacks = user.packs;
	const enabledpacks = [];

	if (userpacks.length !== 0) {
		for (let pack of userpacks) {
			//user.pack == ["id",..] so get the packname too..
			const packName = await Pack.findOne({ id: pack.id }).lean();
			const obj = {
				name: packName.name,
				id: pack.id
			};
			enabledpacks.push(obj);
		}
	}

	//const enabledpacks = userpacks.map((pack) => pack.id);

	const allpacks = await getAllPacks();

	return {
		status: 200,
		body: { allpacks, enabledpacks }
	};
};

export const POST = async ({ request }) => {
	const { id } = await request.json();
	if (!id)
		return {
			status: 400,
			body: { error: 'Invalid id' }
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

	//make sure pack isnt just garbage by checking if any sticker has it
	const pack = await Sticker.findOne({ packid: id });
	if (!pack)
		return {
			status: 400,
			body: { error: 'Invalid id' }
		};

	//if user has no packs, just add
	if (user.packs.length === 0) {
		user.packs.push({ id: id, position: Math.floor(Date.now() / 10) });
		await user.save();
	} else {
		//check if user has the specific pack
		const hasPack = user.packs.find((p) => p.id === id);

		//user has pack so remove
		if (hasPack) {
			user.packs = user.packs.filter((p) => p.id !== id);
			await user.save();
		}
		//user doesnt have so add
		else {
			user.packs.push({ id: id, position: Math.floor(Date.now() / 10) });
			await user.save();
		}
	}

	//then
	//valid user, get their packs
	const userpacks = user.packs;
	const enabledpacks = [];

	if (userpacks.length !== 0) {
		for (let pack of userpacks) {
			//user.pack == ["id",..] so get the packname too..
			const packName = await Pack.findOne({ id: pack.id }, [
				'-_id',
				'-id',
				'-owner',
				'-date',
				'-private',
				'-createdAt',
				'-updatedAt',
				'-__v'
			]).lean();
			const obj = {
				name: packName.name,
				id: pack.id
				//position:packName.position
			};
			enabledpacks.push(obj);
		}
	}

	//const enabledpacks = userpacks.map((pack) => pack.id);

	const allpacks = await getAllPacks();

	return {
		status: 200,
		body: { allpacks, enabledpacks }
	};
};
