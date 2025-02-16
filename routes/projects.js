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
    .get(catchAsync(projectsControllers.index))
    .post(validateProject, catchAsync(projectsControllers.createProject));

router
    .route("/:projectId")
    .get(
        isProjectOwner,
        saveReturnTo,
        catchAsync(projectsControllers.showProject)
    )
    .patch(
        isProjectOwner,
        validateProject,
        catchAsync(projectsControllers.updateProject)
    )
    .delete(isProjectOwner, catchAsync(projectsControllers.deleteProject));

router.get(
    "/:projectId/edit",
    isProjectOwner,
    catchAsync(projectsControllers.renderEditForm)
);

router.post(
    "/:projectId/tasks",
    isProjectOwner,
    validateTask,
    catchAsync(projectsControllers.createTask)
);

module.exports = router;
