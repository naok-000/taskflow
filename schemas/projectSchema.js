const Joi = require("joi");

const projectSchema = Joi.object({
    project: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
    }).required(),
}).required();

module.exports = projectSchema;
