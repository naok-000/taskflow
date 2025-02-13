const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateTask } = require("../middlewares");
const tasksControllers = require("../controllers/tasks");

router.get("/", catchAsync(tasksControllers.index));

router
    .route("/:id")
    .get(catchAsync(tasksControllers.showTask))
    .patch(validateTask, catchAsync(tasksControllers.updateTask))
    .delete(catchAsync(tasksControllers.deleteTask));

router.get("/:id/edit", catchAsync(tasksControllers.renderEditForm));

module.exports = router;
