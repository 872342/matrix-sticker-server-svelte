import mongoose from 'mongoose';

const packSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			min: 1,
			max: 30
		},
		id: {
			type: String,
			required: true
		},
		position: {
			type: Number,
			required: true
		},
		owner: {
			type: String,
			required: true
		},
		stickercount: {
			type: Number,
			required: true
		},
		date: {
			type: Date,
			default: Date.now
		}
	},
	{ timestamps: true }
);

export default mongoose.models.Pack || mongoose.model('Pack', packSchema);
