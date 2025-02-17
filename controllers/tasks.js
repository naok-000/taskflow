const Project = require("../models/project");
const Task = require("../models/task");
const taskStatus = require("../constants/taskStatus");

module.exports.index = async (req, res) => {
    const projectIds = await Project.find({ owner: req.user._id });
    console.log(projectIds);
    const tasks = await Task.find({
        project: { $in: projectIds },
    }).populate("project");
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

// module.exports.showTask = async (req, res) => {
//     const id = req.params.id;
//     const task = await Task.findById(id);
//     if (!task) {
//         req.flash("error", "タスクが見つかりません");
//         return res.redirect("/tasks");
//     }
//     res.render("tasks/show", { task, taskStatus });
// };

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id).populate("project");
    if (!task) {
        req.flash("error", "タスクが見つかりません");
        return res.redirect("/tasks");
    }
    const returnTo = req.session.returnTo || `/projects/${task.project._id}`;
    res.render("tasks/edit", { task, taskStatus, returnTo });
};

module.exports.updateTask = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body.task, {
        runValidators: true,
        new: true,
    });
    const url = req.session.returnTo || `/projects/${task.project._id}`;
    delete req.session.returnTo;
    req.flash("success", `'${task.title}'を更新しました`);
    res.redirect(url);
};

module.exports.deleteTask = async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete(id);
    const url = req.session.returnTo || `/projects/${task.project._id}`;
    delete req.session.returnTo;
    req.flash("success", `'${task.title}'を削除しました`);
    res.redirect(url);
};
