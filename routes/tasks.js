// タスクに関するルーティングを定義するファイル
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateTask, saveReturnTo, isTaskOwner } = require("../middlewares");
const tasksControllers = require("../controllers/tasks");

router.get("/", saveReturnTo, catchAsync(tasksControllers.index)); // タスク一覧を表示

router
    .route("/:id")
    // .get(isTaskOwner, saveReturnTo, catchAsync(tasksControllers.showTask))
    .patch(isTaskOwner, validateTask, catchAsync(tasksControllers.updateTask)) // タスクを更新
    .delete(isTaskOwner, catchAsync(tasksControllers.deleteTask)); // タスクを削除

router.get(
    // タスクの編集フォームを表示
    "/:id/edit",
    isTaskOwner,
    catchAsync(tasksControllers.renderEditForm)
);

module.exports = router;
