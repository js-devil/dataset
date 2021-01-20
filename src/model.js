import Joi from '@hapi/joi';

const actor = Joi.object({
  id: Joi.number().required().positive().integer().required().strict(),
  login: Joi.string().min(6).max(200).lowercase().required(),
  avatar_url: Joi.string().uri().lowercase().required(),
});

const repo = Joi.object({
  id: Joi.number().required().positive().integer().required().strict(),
  name: Joi.string().min(6).max(200).lowercase().required(),
  url: Joi.string().uri().lowercase().required(),
});

export const eventModel = Joi.object({
  id: Joi.number().required().positive().integer().required().strict(),
  type: Joi.string().min(3).max(200).required(),
  actor,
  repo,
});

export const actorUpdate = Joi.object({
  id: Joi.number().required().positive().integer().required().strict(),
  avatar_url: Joi.string().uri().lowercase().required(),
});
