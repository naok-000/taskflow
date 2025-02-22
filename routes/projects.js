// プロジェクトのCRUD操作を行うためのルーティングを定義するファイル
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
    validateProject,
    validateTask,
    saveReturnTo,
    isProjectOwner,
} = require("../middlewares");
const projectsControllers = require("../controllers/projects");

router
    .route("/")
    .get(catchAsync(projectsControllers.index)) // プロジェクト一覧を表示
    .post(validateProject, catchAsync(projectsControllers.createProject)); // プロジェクトを作成

router
    .route("/:projectId")
    .get(
        // プロジェクトの詳細を表示
        isProjectOwner,
        saveReturnTo,
        catchAsync(projectsControllers.showProject)
    )
    .patch(
        // プロジェクトを更新
        isProjectOwner,
        validateProject,
        catchAsync(projectsControllers.updateProject)
    )
    .delete(isProjectOwner, catchAsync(projectsControllers.deleteProject)); // プロジェクトを削除

router.get(
    // プロジェクトの編集フォームを表示
    "/:projectId/edit",
    isProjectOwner,
    catchAsync(projectsControllers.renderEditForm)
);

router.post(
    // タスクを作成
    "/:projectId/tasks",
    isProjectOwner,
    validateTask,
    catchAsync(projectsControllers.createTask)
);

module.exports = router;
