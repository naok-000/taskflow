// アプリのエントリーポイント
// サーバーを起動する
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { validateTask } = require("./middlewares");
const Task = require("./models/tasks");
const taskStatus = require("./constants/taskStatus");
const tasksRoutes = require("./routes/tasks");
const projectsRoutes = require("./routes/projects");

const app = express();
const port = 3000;

// MongoDBに接続
mongoose
    .connect("mongodb://127.0.0.1:27017/taskflow")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error");
        console.log(err);
    });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); // テンプレートエンジンを設定
app.set("views", path.join(__dirname, "views")); // テンプレートファイルのディレクトリを指定

app.use(express.static("public")); // 静的ファイルのディレクトリを指定
app.use(express.urlencoded({ extended: true })); // フォームデータを解析するミドルウェア
app.use(methodOverride("_method")); // HTTPメソッドを上書きするミドルウェア
app.use(express.static(path.join(__dirname, "public"))); // 静的ファイルのディレクトリを指定
const sessionConfig = {
    secret: "mysecert",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig)); // セッションを有効にする
app.use(flash()); // フラッシュメッセージを有効にする

app.use((req, res, next) => {
    res.locals.currentRoute = req.path;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/tasks", tasksRoutes);
app.use("/projects", projectsRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりません", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "問題が起きました" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
