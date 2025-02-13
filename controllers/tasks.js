const Task = require("../models/tasks");
const taskStatus = require("../constants/taskStatus");

module.exports.index = async (req, res) => {
    const tasks = await Task.find({});
    res.render("tasks/index", { tasks });
};

module.exports.showTask = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
        req.flash("error", "タスクが見つかりません");
        return res.redirect("/tasks");
    }
    res.render("tasks/show", { task });
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
    res.redirect(`/tasks/${task._id}`);
};

module.exports.deleteTask = async (req, res) => {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
    res.redirect("/tasks");
};
