// Joiスキーマの定義
const Joi = require("./joiExtension");
const taskStatus = require("../constants/taskStatus");

// タスクのスキーマを定義
const taskSchema = Joi.object({
    task: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().allow("").escapeHTML(),
        status: Joi.string()
            .valid(...Object.values(taskStatus))
            .default(taskStatus.NOT_STARTED),
    }),
});

module.exports = taskSchema;
