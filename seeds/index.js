// シードデータを挿入するためのファイル
// MongoDBに接続し、シードデータを挿入する
const mongoose = require("mongoose");
const Task = require("../models/tasks");

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

const tasks = [
    {
        title: "Task 1",
        description: "Description 1",
    },
    {
        title: "Task 2",
        description: "Description 2",
    },
    {
        title: "Task 3",
        description: "Description 3",
    },
];

const seedDB = async () => {
    await Task.deleteMany({});
    await Task.insertMany(tasks);
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log("Seed data inserted");
});
