const taskSchema = require("./schemas/taskSchema");
const projectSchema = require("./schemas/projectSchema");
const ExpressError = require("./utils/ExpressError");

module.exports.validateTask = (req, res, next) => {
    console.log(req.body);
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};

module.exports.validateProject = (req, res, next) => {
    const { error } = projectSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};
