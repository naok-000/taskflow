const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projects");
const Task = require("../models/tasks");
const taskStatus = require("../constants/taskStatus");
const { validateTask } = require("../middlewares");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const tasks = await Task.find({});
        res.render("tasks/index", { tasks });
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const id = req.params.id;
        const task = await Task.findById(id);
        if (!task) {
            req.flash("error", "タスクが見つかりません");
            return res.redirect("/tasks");
        }
        res.render("tasks/show", { task });
    })
);

router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
        const id = req.params.id;
        const task = await Task.findById(id);
        res.render("tasks/edit", { task, taskStatus });
    })
);

router.patch(
    "/:id",
    validateTask,
    catchAsync(async (req, res) => {
        const id = req.params.id;
        const task = await Task.findByIdAndUpdate(id, req.body.task, {
            runValidators: true,
            new: true,
        });
        res.redirect(`/tasks/${task._id}`);
    })
);

router.delete(
    "/:id",
    catchAsync(async (req, res) => {
        const id = req.params.id;
        await Task.findByIdAndDelete(id);
        res.redirect("/tasks");
    })
);

module.exports = router;
