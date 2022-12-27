import { handler } from './build/handler.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
const uri = process.env['MONGODB_URI'];
const opts = {
	useNewUrlParser: true,
	maxPoolSize: 10, // Maintain up to 10 socket connections
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};
mongoose.connect(uri, opts).then(() => {
	console.log('db connected');
});

const app = express({ strict: true });

import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
	windowMs: 10000,
	max: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: 'Too many requests.',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

app.use('/api/', apiLimiter);

//serve /sticker-widget/ without "/index.html"
app.use(express.static('static', { extensions: ['html'] }));

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(4000, () => {
	console.log('listening on port 4000');
});
