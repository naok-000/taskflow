const Project = require("../models/projects");
const Task = require("../models/tasks");
const taskStatus = require("../constants/taskStatus");

module.exports.index = async (req, res) => {
    const projects = await Project.find({});
    res.render("projects/index", { projects });
};

module.exports.createProject = async (req, res) => {
    const project = new Project(req.body.project);
    await project.save();
    res.redirect("/projects");
};

module.exports.showProject = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    const tasks = await Task.find({ project: projectId });
    const notStarted = tasks.filter(
        (task) => task.status === taskStatus.NOT_STARTED
    );
    const inProgress = tasks.filter(
        (task) => task.status === taskStatus.IN_PROGRESS
    );
    const completed = tasks.filter(
        (task) => task.status === taskStatus.COMPLETED
    );
    if (!project) {
        req.flash("error", "プロジェクトが見つかりません");
        return res.redirect("/projects");
    }
    res.render("projects/show", {
        project,
        tasks,
        notStarted,
        inProgress,
        completed,
    });
};

module.exports.renderEditForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    res.render("projects/edit", { project });
};

module.exports.updateProject = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await Project.findByIdAndUpdate(
        projectId,
        req.body.project,
        {
            runValidators: true,
            new: true,
        }
    );
    res.redirect(`/projects/${project._id}`);
};

module.exports.deleteProject = async (req, res) => {
    const projectId = req.params.projectId;
    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);
    res.redirect("/projects");
};

module.exports.createTask = async (req, res) => {
    const projectId = req.params.projectId;
    const task = new Task(req.body.task);
    task.project = projectId;
    await task.save();
    res.redirect(`/projects/${projectId}`);
};
