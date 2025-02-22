// ユーザーに関するルーティングを定義するファイル
const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const passport = require("passport");

router
    .route("/login")
    .get(usersControllers.renderLogin) // ログインフォームを表示
    .post(
        // ログイン処理
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        usersControllers.login
    );

router
    .route("/register")
    .get(usersControllers.renderRegister) // ユーザー登録フォームを表示
    .post(usersControllers.register); // ユーザー登録処理

router.get("/logout", usersControllers.logout); // ログアウト処理

module.exports = router;
