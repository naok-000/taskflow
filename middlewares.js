const taskSchema = require("./schemas/taskSchema");
const ExpressError = require("./utils/ExpressError");

module.exports.validateTask = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        const message = error.details.map((el) => el.message).join(",");
        throw new ExpressError(message, 400);
    } else {
        next();
    }
};
