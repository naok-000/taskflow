// Joiスキーマの定義
const Joi = require("./joiExtension");

// プロジェクトのスキーマを定義
const projectSchema = Joi.object({
    project: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().escapeHTML(),
    }).required(),
}).required();

module.exports = projectSchema;
