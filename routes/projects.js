const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Task = require("../models/tasks");
const Project = require("../models/projects");
const taskStatus = require("../constants/taskStatus");
const { validateProject, validateTask } = require("../middlewares");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const projects = await Project.find({});
        res.render("projects/index", { projects });
    })
);

router.post(
    "/",
    validateProject,
    catchAsync(async (req, res) => {
        const project = new Project(req.body.project);
        await project.save();
        res.redirect("/projects");
    })
);

router.get(
    "/:projectId",
    catchAsync(async (req, res) => {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        const tasks = await Task.find({ project: projectId });
        if (!project) {
            req.flash("error", "プロジェクトが見つかりません");
            return res.redirect("/projects");
        }
        res.render("projects/show", { project, tasks });
    })
);

router.get(
    "/:projectId/edit",
    catchAsync(async (req, res) => {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        res.render("projects/edit", { project });
    })
);

router.patch(
    "/:projectId",
    validateProject,
    catchAsync(async (req, res) => {
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
    })
);

router.delete(
    "/:projectId",
    catchAsync(async (req, res) => {
        const projectId = req.params.projectId;
        await Task.deleteMany({ project: projectId });
        await Project.findByIdAndDelete(projectId);
        res.redirect("/projects");
    })
);

router.post(
    "/:projectId/tasks",
    validateTask,
    catchAsync(async (req, res) => {
        const projectId = req.params.projectId;
        const task = new Task(req.body.task);
        task.project = projectId;
        await task.save();
        res.redirect(`/projects/${projectId}`);
    })
);

module.exports = router;
