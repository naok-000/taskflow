// ユーザー関連のコントローラー
const User = require("../models/user");

// ログインフォームを表示
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

// ログイン処理
module.exports.login = (req, res) => {
    req.flash("success", `${req.user.username}さん、おかえりなさい！`);
    res.redirect("/projects");
};

// ユーザー登録フォームを表示
module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

// ユーザー登録処理
module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "TaskFlowへようこそ！");
            res.redirect("/projects");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

// ログアウト処理
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "ログアウトしました");
        res.redirect("/");
    });
};
