const Task = require("../models/tasks");
const taskStatus = require("../constants/taskStatus");

module.exports.index = async (req, res) => {
    const tasks = await Task.find({}).populate("project");
    const notStarted = tasks.filter(
        (task) => task.status === taskStatus.NOT_STARTED
    );
    const inProgress = tasks.filter(
        (task) => task.status === taskStatus.IN_PROGRESS
    );
    const completed = tasks.filter(
        (task) => task.status === taskStatus.COMPLETED
    );
    res.render("tasks/index", { tasks, notStarted, inProgress, completed });
};

module.exports.showTask = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
        req.flash("error", "タスクが見つかりません");
        return res.redirect("/tasks");
    }
    res.render("tasks/show", { task, taskStatus });
};

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.render("tasks/edit", { task, taskStatus });
};

module.exports.updateTask = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body.task, {
        runValidators: true,
        new: true,
    });
    res.redirect(`/projects/${task.project._id}`);
};

module.exports.deleteTask = async (req, res) => {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
    res.redirect("/tasks");
};
