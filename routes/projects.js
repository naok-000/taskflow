const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
    validateProject,
    validateTask,
    saveReturnTo,
} = require("../middlewares");
const projectsControllers = require("../controllers/projects");

router
    .route("/")
    .get(catchAsync(projectsControllers.index))
    .post(validateProject, catchAsync(projectsControllers.createProject));

router
    .route("/:projectId")
    .get(saveReturnTo, catchAsync(projectsControllers.showProject))
    .patch(validateProject, catchAsync(projectsControllers.updateProject))
    .delete(catchAsync(projectsControllers.deleteProject));

router.get("/:projectId/edit", catchAsync(projectsControllers.renderEditForm));

router.post(
    "/:projectId/tasks",
    validateTask,
    catchAsync(projectsControllers.createTask)
);

module.exports = router;
