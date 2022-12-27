import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
			min: 3,
			max: 255
		},
		password: {
			type: String,
			required: true,
			max: 1024,
			min: 3
		},
		authtoken: {
			type: String,
			required: true
		},
		packs: [
			new mongoose.Schema({
				id: { type: String, required: true },
				position: { type: Number, default: Math.floor(Date.now() / 10) },
				order: { type: Array, default: [], required: true }
			}),
			{ _id: false }
		]
	},
	{ timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
