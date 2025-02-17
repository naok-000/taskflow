const Joi = require("./joiHtmlEscape");

const projectSchema = Joi.object({
    project: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().escapeHTML(),
    }).required(),
}).required();

module.exports = projectSchema;
