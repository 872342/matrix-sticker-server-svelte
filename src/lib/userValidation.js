import Joi from 'joi';

export const registerValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().lowercase().alphanum().min(3).required(),
		password: Joi.string().min(3).required()
	});
	return schema.validate(data);
};

export const loginValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().lowercase().alphanum().min(3).max(64).required(),
		password: Joi.string().min(3).max(64).required()
	});
	return schema.validate(data);
};
