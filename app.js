// アプリのエントリーポイント
// サーバーを起動する
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

const ExpressError = require("./utils/ExpressError");
const { isLoggedIn } = require("./middlewares");
const Task = require("./models/task");
const taskStatus = require("./constants/taskStatus");
const tasksRoutes = require("./routes/tasks");
const projectsRoutes = require("./routes/projects");
const usersRoutes = require("./routes/users");

const app = express();
const port = 3000;

// MongoDBに接続
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/taskflow";
mongoose
    .connect(dbUrl)
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
const secret = process.env.SECRET || "mysecret";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret,
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", (e) => {
    console.log("セッションストアエラー", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig)); // セッションを有効にする
app.use(flash()); // フラッシュメッセージを有効にする

// セキュリティ対策
const scriptSrcUrls = ["https://cdn.jsdelivr.net"];
const styleSrcUrls = ["https://cdn.jsdelivr.net"];
const connectSrcUrls = [];
const fontSrcUrls = ["https://cdn.jsdelivr.net"];
const imgSrcUrls = ["https://images.unsplash.com"];
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);

// ユーザー認証の設定
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.taskStatus = taskStatus;
    res.locals.currentRoute = req.path;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/tasks", isLoggedIn, tasksRoutes);
app.use("/projects", isLoggedIn, projectsRoutes);
app.use("/", usersRoutes);

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
