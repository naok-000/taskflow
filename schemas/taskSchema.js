const Joi = require("joi");
const taskStatus = require("../constants/taskStatus");

const taskSchema = Joi.object({
    task: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        status: Joi.string()
            .valid(...Object.values(taskStatus))
            .default(taskStatus.NOT_STARTED),
    }).required(),
}).required();

module.exports = taskSchema;
