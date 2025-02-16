const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const passport = require("passport");

router
    .route("/login")
    .get(usersControllers.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        usersControllers.login
    );

router
    .route("/register")
    .get(usersControllers.renderRegister)
    .post(usersControllers.register);

router.get("/logout", usersControllers.logout);

module.exports = router;
