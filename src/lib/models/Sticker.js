import mongoose from 'mongoose';

const thumbnail = new mongoose.Schema({
	w: { type: Number },
	h: { type: Number },
	size: { type: Number },
	mimetype: { type: String }
});

const info = new mongoose.Schema({
	w: { type: Number },
	h: { type: Number },
	size: { type: Number },
	mimetype: { type: String },
	thumbnail_url: { type: String },
	thumbnail_info: { type: thumbnail }
});

const stickerSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true
		},
		position: {
			type: Number,
			required: true
		},
		packid: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		body: {
			type: String,
			default: 'x'
		},
		url: { type: String },
		info: { type: info }
	},
	{ timestamps: true }
);

export default mongoose.models.Sticker || mongoose.model('Sticker', stickerSchema);
