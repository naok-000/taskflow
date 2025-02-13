// アプリのエントリーポイント
// サーバーを起動する
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const Task = require("./models/tasks");
const taskStatus = require("./constants/taskStatus");

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

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find({});
    res.render("tasks/index", { tasks });
});

app.get("/tasks/new", (req, res) => {
    res.render("tasks/new");
});

app.post("/tasks", async (req, res) => {
    const task = new Task(req.body.task);
    await task.save();
    res.redirect("/tasks");
});

app.get("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.render("tasks/show", { task });
});

app.get("/tasks/:id/edit", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    res.render("tasks/edit", { task, taskStatus });
});

app.patch("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body.task, {
        runValidators: true,
        new: true,
    });
    res.redirect(`/tasks/${task._id}`);
});

app.delete("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    await Task.findByIdAndDelete(id);
    res.redirect("/tasks");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
