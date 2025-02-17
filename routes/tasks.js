const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateTask, saveReturnTo, isTaskOwner } = require("../middlewares");
const tasksControllers = require("../controllers/tasks");

router.get("/", saveReturnTo, catchAsync(tasksControllers.index));

router
    .route("/:id")
    // .get(isTaskOwner, saveReturnTo, catchAsync(tasksControllers.showTask))
    .patch(isTaskOwner, validateTask, catchAsync(tasksControllers.updateTask))
    .delete(isTaskOwner, catchAsync(tasksControllers.deleteTask));

router.get(
    "/:id/edit",
    isTaskOwner,
    catchAsync(tasksControllers.renderEditForm)
);

module.exports = router;
