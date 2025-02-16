const taskSchema = require("./schemas/taskSchema");
const projectSchema = require("./schemas/projectSchema");
const ExpressError = require("./utils/ExpressError");
const Project = require("./models/project");
const Task = require("./models/task");

module.exports.validateTask = (req, res, next) => {
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

module.exports.saveReturnTo = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
};

module.exports.isProjectOwner = async (req, res, next) => {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project.owner.equals(req.user._id)) {
        req.flash("error", "権限がありません");
        return res.redirect("/projects");
    }
    next();
};

module.exports.isTaskOwner = async (req, res, next) => {
    const taskId = req.params.id;
    const task = await Task.findById(taskId).populate("project");
    if (!task.project.owner.equals(req.user._id)) {
        req.flash("error", "権限がありません");
        return res.redirect(`/projects/${task.project._id}`);
    }
    next();
};
