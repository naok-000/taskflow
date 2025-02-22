// プロジェクトのコントローラー
const Project = require("../models/project");
const Task = require("../models/task");
const taskStatus = require("../constants/taskStatus");

// プロジェクト一覧を表示
module.exports.index = async (req, res) => {
    const projects = await Project.find({ owner: req.user._id });
    res.render("projects/index", { projects });
};

// プロジェクトを作成
module.exports.createProject = async (req, res) => {
    const project = new Project(req.body.project);
    project.owner = req.user._id;
    console.log(project);
    await project.save();
    req.flash("success", `'${project.title}'を作成しました`);
    res.redirect("/projects");
};

// プロジェクトの詳細を表示
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

// プロジェクトの編集フォームを表示
module.exports.renderEditForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    res.render("projects/edit", { project });
};

// プロジェクトを更新
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
    req.flash("success", `'${project.title}'を更新しました`);
    res.redirect(`/projects/${project._id}`);
};

// プロジェクトを削除
module.exports.deleteProject = async (req, res) => {
    const projectId = req.params.projectId;
    await Task.deleteMany({ project: projectId });
    await Project.findByIdAndDelete(projectId);
    req.flash("success", `'${project.title}'を削除しました`);
    res.redirect("/projects");
};

// タスクを作成
module.exports.createTask = async (req, res) => {
    const projectId = req.params.projectId;
    const task = new Task(req.body.task);
    task.project = projectId;
    await task.save();
    req.flash("success", `'${task.title}'を追加しました`);
    res.redirect(`/projects/${projectId}`);
};
