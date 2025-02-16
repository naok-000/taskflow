const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateTask, saveReturnTo } = require("../middlewares");
const tasksControllers = require("../controllers/tasks");

router.get("/", saveReturnTo, catchAsync(tasksControllers.index));

router
    .route("/:id")
    .get(saveReturnTo, catchAsync(tasksControllers.showTask))
    .patch(validateTask, catchAsync(tasksControllers.updateTask))
    .delete(catchAsync(tasksControllers.deleteTask));

router.get("/:id/edit", catchAsync(tasksControllers.renderEditForm));

module.exports = router;
